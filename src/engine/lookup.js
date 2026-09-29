// Sheet-driven model lookup.
//
// Replaces the hand-computed aggregate weight-solver (computeWeights + the
// _propTbl/_pasTbl/_outTbl tables + residual-fill + international
// redistribution) and the model-naming tables (MT/EM/modelName) for every
// VALID (sums-to-100%) configuration. Those are now read directly from the
// source-of-truth spreadsheet, bundled as src/data/combinations.json by
// scripts/generate_combinations.py.
//
// The lookup returns the seven aggregate sleeve weights and the model name.
// Ticker-level expansion (Passive -> IVV/IVW/IJH, Outsourced -> PVAL/FFLC,
// Fixed Income -> AGG/IGSB, ...) and dollar-minimum validation stay in the app.
//
// Configurations that don't sum to 100% (most strategies toggled off) have no
// sheet row; lookupModel returns null for those and the caller keeps its
// existing "incomplete allocation" behavior.

import data from "../data/combinations.json";

// "|" never appears in any Style / Equity Strategy / Fixed Income value.
const SEP = "|";
const keyOf = (style, eq, prop, out, pas, intl, fi) =>
  [style, eq, prop, out, pas, intl, fi].join(SEP);

const INDEX = new Map(
  data.configs.map((c) => [
    keyOf(c.style, c.eq, c.prop, c.out, c.pas, c.intl, c.fi),
    c,
  ])
);

export const combinationsMeta = data.meta;
export const allConfigs = data.configs;

// Map the UI's effective style (from resolveStyle) to the spreadsheet's Style
// column: synthetic custom splits carry a "10/90"-style label; everything else
// (Conservative/Moderate/Aggressive/Equity Only, and the 30/60/80 customs that
// resolveStyle already routes to a named style) uses the style name as-is.
export function sheetStyleFor(effStyle, splitLabel) {
  return effStyle === "__CUSTOM__" ? splitLabel : effStyle;
}

// ui = { effStyle, splitLabel, eqStrat, propActive, outsourced, passive,
//        intlEffective, fi }
// Returns { name, alt, weights } for a valid config, or null for an
// incomplete one (no matching sheet row).
export function lookupModel(ui) {
  const style = sheetStyleFor(ui.effStyle, ui.splitLabel);
  const isEQ = style === "Equity Only";
  const eq = ui.propActive ? ui.eqStrat : "—";
  const fi = isEQ ? "N/A" : ui.fi;
  const cfg = INDEX.get(
    keyOf(
      style,
      eq,
      ui.propActive ? 1 : 0,
      ui.outsourced ? 1 : 0,
      ui.passive ? 1 : 0,
      ui.intlEffective ? 1 : 0,
      fi
    )
  );
  if (!cfg) return null;
  const w = cfg.w;
  return {
    name: cfg.name,
    alt: cfg.alt || [],
    weights: {
      cea: w[0],
      lcy: w[1],
      outsourced: w[2],
      passive: w[3],
      international: w[4],
      fixedIncome: w[5],
      cash: w[6],
    },
  };
}
