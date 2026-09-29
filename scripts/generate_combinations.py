#!/usr/bin/env python3
"""
Generate src/data/combinations.json from the CorePlus source-of-truth workbook.

This is a build-time / manual tool, NOT part of the app build or CI. Run it
whenever the source spreadsheet changes to regenerate the bundled lookup table
that drives the app (model names + sleeve weights).

Zero external dependencies: an .xlsx is a zip of XML, parsed here with the
Python standard library (zipfile + xml.etree), so no pip install is required.

Usage:
    python scripts/generate_combinations.py [path-to-xlsx]

Default source path (Sandhill "Client Service" share):
    U:\\Client Service\\CorePlus_All_Combinations_Updated.xlsx

Output: src/data/combinations.json  (relative to the repo root)

The "All Combinations" tab is authoritative. Its Summary tab is known to be
internally inconsistent (claims 1,605 rows / lists a 60/40 split that isn't in
the data) and is intentionally ignored here.
"""
import sys, os, json, zipfile, datetime
import xml.etree.ElementTree as ET

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
DEFAULT_XLSX = r"U:\Client Service\CorePlus_All_Combinations_Updated.xlsx"
DATA_SHEET_NAME = "All Combinations"

KEY_COLS = ["Style", "Equity Strategy", "Proprietary Active",
            "Outsourced Active", "Passive", "International", "Fixed Income"]
WEIGHT_COLS = ["CEA %", "LCY %", "Outsourced %", "Passive %",
               "International %", "Fixed Income %", "Cash %"]
WEIGHT_ORDER = ["cea", "lcy", "outsourced", "passive",
                "international", "fixedIncome", "cash"]


def _col_idx(ref):
    letters = "".join(c for c in ref if c.isalpha())
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def _read_workbook(path):
    z = zipfile.ZipFile(path)
    shared = [
        "".join(t.text or "" for t in si.iter(NS + "t"))
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall(NS + "si")
    ]
    # Map sheet display name -> worksheet part path via workbook.xml + rels
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    rid_to_target = {
        r.attrib["Id"]: r.attrib["Target"]
        for r in rels
    }
    RID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    name_to_part = {}
    for s in wb.findall(".//" + NS + "sheet"):
        target = rid_to_target[s.attrib[RID]]
        if not target.startswith("xl/"):
            target = "xl/" + target
        name_to_part[s.attrib["name"]] = target
    part = name_to_part[DATA_SHEET_NAME]

    rows = []
    for r in ET.fromstring(z.read(part)).iter(NS + "row"):
        cells = {}
        for c in r.findall(NS + "c"):
            t = c.attrib.get("t")
            v = c.find(NS + "v")
            iss = c.find(NS + "is")
            if t == "s" and v is not None:
                val = shared[int(v.text)]
            elif t == "inlineStr" and iss is not None:
                val = "".join(x.text or "" for x in iss.iter(NS + "t"))
            elif v is not None:
                val = v.text
            else:
                val = None
            cells[_col_idx(c.attrib["r"])] = val
        width = max(cells) + 1 if cells else 0
        rows.append([cells.get(i) for i in range(width)])
    return rows


def _norm(x):
    return (x or "").strip()


def _num(x):
    x = _norm(x)
    return float(x) if x not in ("", "—", "N/A") else 0.0


def _model_number(name):
    return int(_norm(name).split()[-1])


def build(path):
    rows = _read_workbook(path)
    header = rows[0]
    col = {name: i for i, name in enumerate(header)}

    def get(row, name):
        i = col[name]
        return row[i] if len(row) > i else None

    data = [r for r in rows[1:] if _norm(get(r, "Model Name"))]

    # Group identical input configurations (the sheet contains duplicate model
    # NUMBERS for allocations that collapse to the same weights). Weights are
    # always consistent within a group; only the model name is ambiguous. We
    # keep the HIGHEST number as canonical and the rest as `alt`, because that
    # matches the number the pre-lookup app displayed for every such config
    # (verified 180/180) — so adopting the sheet lookup changes no visible model
    # name. The duplicate numbering itself is a sheet artifact worth cleaning up.
    groups = {}
    for r in data:
        key = tuple(_norm(get(r, c)) for c in KEY_COLS)
        groups.setdefault(key, []).append(r)

    configs = []
    for key, members in groups.items():
        members = sorted(members, key=lambda r: _model_number(get(r, "Model Name")), reverse=True)
        canon = members[0]
        style, eq, prop, out, pas, intl, fi = key
        weights = [_num(get(canon, c)) for c in WEIGHT_COLS]
        total = round(sum(weights), 4)
        if abs(total - 100) > 0.01:
            raise ValueError(f"Config {key} weights sum to {total}, expected 100")
        rec = {
            "style": style,
            "eq": eq,
            "prop": 1 if prop == "ON" else 0,
            "out": 1 if out == "ON" else 0,
            "pas": 1 if pas == "ON" else 0,
            "intl": 1 if intl == "ON" else 0,
            "fi": fi,
            "w": weights,
            "name": _norm(get(canon, "Model Name")),
        }
        alts = [_norm(get(r, "Model Name")) for r in members[1:]]
        if alts:
            rec["alt"] = alts
        configs.append(rec)

    return {
        "meta": {
            "source": os.path.basename(path),
            "generated": datetime.date.today().isoformat(),
            "sheetRows": len(data),
            "distinctConfigs": len(configs),
            "twins": sum(1 for c in configs if "alt" in c),
            "weightOrder": WEIGHT_ORDER,
        },
        "configs": configs,
    }


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_XLSX
    if not os.path.exists(path):
        sys.exit(f"Source spreadsheet not found: {path}")
    result = build(path)
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(repo_root, "src", "data", "combinations.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, separators=(",", ":"), ensure_ascii=False)
    m = result["meta"]
    print(f"Wrote {out_path}")
    print(f"  source:          {m['source']}")
    print(f"  sheet rows:      {m['sheetRows']}")
    print(f"  distinct configs:{m['distinctConfigs']}")
    print(f"  twins (alt name):{m['twins']}")
    print(f"  size:            {os.path.getsize(out_path)/1024:.1f} KB")


if __name__ == "__main__":
    main()
