import data from "../data/combinations.json";
import {
  EMPTY_FILTERS, SLEEVES, SORTED_CONFIGS, STYLE_OPTIONS,
  equityPctOf, filterConfigs, fmtWeight, modelNumber, styleLabel,
} from "./catalogData";

const all = data.configs;
const run = (over) => filterConfigs(SORTED_CONFIGS, { ...EMPTY_FILTERS, ...over });
const names = (rows) => rows.map((c) => c.name);

test("no filters returns every config, sorted by equity % then model number", () => {
  const rows = run({});
  expect(rows).toHaveLength(1335);
  expect(new Set(names(rows))).toEqual(new Set(names(all)));
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1], b = rows[i];
    const ea = equityPctOf(a.style), eb = equityPctOf(b.style);
    expect(ea < eb || (ea === eb && modelNumber(a.name) < modelNumber(b.name))).toBe(true);
  }
});

test("style options cover every style, ordered by equity", () => {
  expect(new Set(STYLE_OPTIONS)).toEqual(new Set(all.map((c) => c.style)));
  expect(STYLE_OPTIONS[0]).toBe("10/90");
  expect(STYLE_OPTIONS[STYLE_OPTIONS.length - 1]).toBe("Equity Only");
  expect(styleLabel("Moderate")).toBe("Moderate (60/40)");
  expect(styleLabel("15/85")).toBe("15/85");
});

test("each single filter matches an independent count over the raw data", () => {
  for (const style of STYLE_OPTIONS)
    expect(run({ style })).toHaveLength(all.filter((c) => c.style === style).length);
  for (const [k, field] of [["prop", "prop"], ["out", "out"], ["pas", "pas"], ["intl", "intl"]]) {
    expect(run({ [k]: "on" })).toHaveLength(all.filter((c) => c[field] === 1).length);
    expect(run({ [k]: "off" })).toHaveLength(all.filter((c) => c[field] === 0).length);
  }
  for (const eq of ["CEA", "LCY", "CEA/LCY"])
    expect(run({ eq })).toHaveLength(all.filter((c) => c.eq === eq).length);
  for (const fi of ["Sandhill Corporate Bond", "AGG/IGSB", "NYF"])
    expect(run({ fi })).toHaveLength(all.filter((c) => c.fi === fi).length);
});

test("combined filters intersect", () => {
  const rows = run({ style: "Moderate", eq: "LCY", out: "on", pas: "off", fi: "NYF" });
  const want = all.filter((c) => c.style === "Moderate" && c.eq === "LCY" && c.out === 1 && c.pas === 0 && c.fi === "NYF");
  expect(new Set(names(rows))).toEqual(new Set(names(want)));
  expect(rows.length).toBeGreaterThan(0);
});

test("equity strategy is ignored while Proprietary Active is off (mirrors the builder)", () => {
  expect(run({ prop: "off", eq: "CEA" })).toHaveLength(all.filter((c) => c.prop === 0).length);
});

test("fixed income is ignored for Equity Only (mirrors the builder)", () => {
  expect(run({ style: "Equity Only", fi: "NYF" })).toHaveLength(30);
});

test("International never appears at 30% equity or less", () => {
  expect(run({ intl: "on" }).every((c) => equityPctOf(c.style) > 30)).toBe(true);
});

test("search: exact model number, split label, case, twins", () => {
  expect(names(run({ q: "Moderate 42" }))).toEqual(["CorePlus Moderate 42"]);
  expect(names(run({ q: "moderate 4" }))).toEqual(["CorePlus Moderate 4"]);
  expect(run({ q: "15/85" })).toHaveLength(all.filter((c) => c.style === "15/85").length);
  expect(run({ q: "  EQUITY   only " })).toHaveLength(30);
  // A bare number is the model number, in every style (split labels don't count).
  const n85 = run({ q: "85" });
  expect(n85.length).toBeGreaterThan(0);
  expect(n85.every((c) => [c.name, ...(c.alt || [])].some((n) => modelNumber(n) === 85))).toBe(true);
  expect(names(run({ q: "15/85 15" }))).toEqual(names(all.filter((c) => [c.name, ...(c.alt || [])].includes("CorePlus 15/85 15"))));
  expect(run({ q: "no such model" })).toHaveLength(0);
});

test("search: a twin's alternate number finds exactly its canonical row", () => {
  for (const twin of all.filter((c) => c.alt)) {
    // Twin numbers are never canonical names, so the alt name finds only this row.
    expect(names(run({ q: twin.alt[0] }))).toEqual([twin.name]);
  }
});

test("search combines with filters", () => {
  expect(run({ q: "Moderate 42", style: "Aggressive" })).toHaveLength(0);
});

test("sleeve metadata lines up with the data's weight order", () => {
  expect(SLEEVES.map((s) => s.key)).toEqual(data.meta.weightOrder);
  expect(SLEEVES.every((s, i) => s.idx === i)).toBe(true);
});

test("weight formatting", () => {
  expect(fmtWeight(30)).toBe("30%");
  expect(fmtWeight(12.5)).toBe("12.5%");
  expect(fmtWeight(1.875)).toBe("1.875%");
});
