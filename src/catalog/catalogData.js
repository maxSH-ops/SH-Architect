// Pure data helpers for the catalog view: style ordering, sleeve metadata,
// and the filter/search/sort logic over the 1,335 spreadsheet configs
// (allConfigs from engine/lookup). No React here, so it can be unit-tested.

import { allConfigs, combinationsMeta } from "../engine/lookup";

// Equity % for a Style value: named styles map to fixed equity; split labels
// ("15/85") carry it as the first number.
const NAMED_EQUITY = { Conservative: 30, Moderate: 60, Aggressive: 80, "Equity Only": 100 };
export const equityPctOf = (style) => NAMED_EQUITY[style] ?? parseInt(style, 10);

// "Moderate" -> "Moderate (60/40)", "15/85" -> "15/85".
export const styleLabel = (style) => {
  const eq = NAMED_EQUITY[style];
  return eq == null ? style : `${style} (${eq}/${100 - eq})`;
};

// Model number = the trailing integer of the name ("CorePlus 15/85 19" -> 19).
export const modelNumber = (name) => parseInt(name.slice(name.lastIndexOf(" ") + 1), 10);

// Every Style in the data, ordered by equity % (10/90 ... Conservative ... Equity Only).
export const STYLE_OPTIONS = [...new Set(allConfigs.map((c) => c.style))].sort(
  (a, b) => equityPctOf(a) - equityPctOf(b)
);
export const EQ_OPTIONS = ["CEA", "LCY", "CEA/LCY"];
export const FI_OPTIONS = ["Sandhill Corporate Bond", "AGG/IGSB", "NYF"];

// Sleeve columns, in the same order as each config's `w` array. Colors are a
// categorical palette validated for adjacent-slice contrast and color-vision
// deficiency in the donut's slice order (the table/legend carry the numbers too).
export const SLEEVES = [
  { key: "cea", label: "CEA", color: "#2a78d6" },
  { key: "lcy", label: "LCY", color: "#eb6834" },
  { key: "outsourced", label: "Outsourced Active", short: "Outsourced", color: "#1baf7a" },
  { key: "passive", label: "Passive", color: "#4a3aa7" },
  { key: "international", label: "International", short: "Intl", color: "#eda100" },
  { key: "fixedIncome", label: "Fixed Income", short: "Fixed Inc.", color: "#008300" },
  { key: "cash", label: "Cash", color: "#e87ba4" },
].map((s) => ({ ...s, idx: combinationsMeta.weightOrder.indexOf(s.key) }));

// 12.5 -> "12.5%", 1.875 -> "1.875%", 30 -> "30%".
export const fmtWeight = (x) => `${Number(x.toFixed(3))}%`;

// Toggle filters are "any" | "on" | "off"; eq/style/fi are "" (any) or a value.
export const EMPTY_FILTERS = { q: "", style: "", prop: "any", eq: "", out: "any", pas: "any", intl: "any", fi: "" };

export const isFiltered = (f) =>
  Object.keys(EMPTY_FILTERS).some((k) => f[k] !== EMPTY_FILTERS[k]);

// Mirrors the builder: Equity Strategy only applies while Proprietary Active
// can be on, and Fixed Income doesn't apply to Equity Only.
export const eqFilterActive = (f) => f.prop !== "off";
export const fiFilterActive = (f) => f.style !== "Equity Only";

const toggleOk = (want, v) => want === "any" || (want === "on") === (v === 1);

// Search: whitespace-separated tokens, all must match (case-insensitive).
// A bare-number token must equal the model number, so "Moderate 4" finds
// Moderate 4 (not 40-49) and "15/85 15" finds 15/85 #15 (the split label's
// own "15" doesn't count); other tokens are substrings ("15/85", "mod").
// Matches the canonical name or any twin ("alt") number for the same allocation.
export function searchTokens(q) {
  return q.toLowerCase().trim().split(/\s+/).filter(Boolean);
}
function nameMatches(name, tokens) {
  const lower = name.toLowerCase();
  const num = String(modelNumber(name));
  return tokens.every((t) => (/^\d+$/.test(t) ? String(Number(t)) === num : lower.includes(t)));
}
export function matchesSearch(cfg, tokens) {
  if (!tokens.length) return true;
  return nameMatches(cfg.name, tokens) || (cfg.alt || []).some((n) => nameMatches(n, tokens));
}

export function filterConfigs(configs, f) {
  const tokens = searchTokens(f.q);
  return configs.filter(
    (c) =>
      (!f.style || c.style === f.style) &&
      toggleOk(f.prop, c.prop) &&
      (!f.eq || !eqFilterActive(f) || c.eq === f.eq) &&
      toggleOk(f.out, c.out) &&
      toggleOk(f.pas, c.pas) &&
      toggleOk(f.intl, c.intl) &&
      (!f.fi || !fiFilterActive(f) || c.fi === f.fi) &&
      matchesSearch(c, tokens)
  );
}

// Catalog order: by equity % (low -> high), then model number.
export const SORTED_CONFIGS = [...allConfigs].sort(
  (a, b) => equityPctOf(a.style) - equityPctOf(b.style) || modelNumber(a.name) - modelNumber(b.name)
);
