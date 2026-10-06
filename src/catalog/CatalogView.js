// Model Catalog: browse/search all spreadsheet model configurations.
// Filters mirror the builder's controls; the table shows each model's sleeve
// weights, and clicking a row expands a donut + strategy summary.
import { Fragment, memo, useMemo, useState } from "react";
import { C, inp } from "../ui/theme";
import { Donut, Lbl, SecLbl } from "../ui/components";
import {
  EMPTY_FILTERS, EQ_OPTIONS, FI_OPTIONS, SLEEVES, SORTED_CONFIGS, STYLE_OPTIONS,
  eqFilterActive, fiFilterActive, filterConfigs, fmtWeight, isFiltered, modelNumber, styleLabel,
} from "./catalogData";

const PAGE = 100;
const TOTAL = SORTED_CONFIGS.length;
const TOGGLE_OPTS = [["any", "Any"], ["on", "On"], ["off", "Off"]];
const SLEEVE_COLORS = Object.fromEntries(SLEEVES.map((s) => [s.label, s.color]));
const COLS = 3 + SLEEVES.length + 1; // model, style, FI vehicle, sleeves, chevron

const card = { background: C.white, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: `1px solid ${C.borderLight}` };
const cell = { padding: "10px 12px", fontSize: 13, color: C.text, whiteSpace: "nowrap", fontFamily: "'Lato',sans-serif" };
const th = { padding: "9px 12px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textMuted, fontWeight: 700, whiteSpace: "nowrap" };
const srOnly = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };
const SLEEVE_IDX = Object.fromEntries(SLEEVES.map((s) => [s.key, s.idx]));
const EQUITY_KEYS = ["cea", "lcy", "outsourced", "passive", "international"];
const swatch = (color) => ({ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: color, marginRight: 6, verticalAlign: "middle" });

function Seg({ options, value, onChange, disabled }) {
  return (
    <div role="group" style={{ display: "flex", borderRadius: 6, overflow: "hidden", border: `1.5px solid ${C.border}`, opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "auto", transition: "opacity 0.2s" }}>
      {options.map(([v, label], i) => (
        <button key={v} type="button" aria-pressed={value === v} disabled={disabled} onClick={() => onChange(v)}
          style={{ flex: 1, padding: "8px 10px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: value === v ? 700 : 400, fontFamily: "'Lato',sans-serif", background: value === v ? C.navy : C.white, color: value === v ? C.white : C.text, borderRight: i < options.length - 1 ? `1.5px solid ${C.border}` : "none", whiteSpace: "nowrap" }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, note, children }) {
  return (
    <div style={{ minWidth: 0 }}>
      <Lbl>{label}</Lbl>
      {children}
      {note && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 5, fontStyle: "italic" }}>{note}</div>}
    </div>
  );
}

function Detail({ c }) {
  const entries = SLEEVES.filter((s) => c.w[s.idx] > 0).map((s) => [s.label, c.w[s.idx] / 100]);
  const equity = EQUITY_KEYS.reduce((sum, k) => sum + c.w[SLEEVE_IDX[k]], 0);
  const fixedIncome = c.w[SLEEVE_IDX.fixedIncome], cash = c.w[SLEEVE_IDX.cash];
  const strategies = [
    [c.prop === 1, c.prop === 1 ? `Proprietary Active (${c.eq})` : "Proprietary Active"],
    [c.out === 1, "Outsourced Active"],
    [c.pas === 1, "Passive"],
    [c.intl === 1, "International"],
  ];
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center", padding: "18px 22px" }}>
      <Donut entries={entries} colors={SLEEVE_COLORS} tw={1} />
      <div style={{ display: "flex", flexDirection: "column", gap: 7, width: 230 }}>
        {entries.map(([label, w]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12.5 }}><span style={swatch(SLEEVE_COLORS[label])} />{label}</span>
            <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 700 }}>{fmtWeight(w * 100)}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", alignContent: "start", paddingLeft: 24, borderLeft: `1px solid ${C.borderLight}` }}>
        <div><Lbl>Style</Lbl><div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{styleLabel(c.style)}</div></div>
        <div><Lbl>Equity / Fixed Income / Cash</Lbl><div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{fmtWeight(equity)} / {fmtWeight(fixedIncome)} / {fmtWeight(cash)}</div></div>
        <div>
          <Lbl>Strategies</Lbl>
          {strategies.map(([on, label]) => (
            <div key={label} style={{ fontSize: 12.5, color: on ? C.text : C.textMuted, marginBottom: 3 }}>
              <span style={{ display: "inline-block", width: 16, color: on ? C.success : C.textMuted, fontWeight: 700 }}>{on ? "✓" : "–"}</span>{label}
            </div>
          ))}
        </div>
        <div>
          <Lbl>Fixed Income Vehicle</Lbl>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{c.fi === "N/A" ? "Not applicable (Equity Only)" : c.fi}</div>
          {c.alt && (
            <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>
              The source spreadsheet also numbers this identical allocation as <strong style={{ color: C.text }}>{c.alt.join(", ")}</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogView() {
  const [f, setF] = useState(EMPTY_FILTERS);
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState(null); // name of the expanded model row
  const set = (k) => (v) => { setF((p) => ({ ...p, [k]: v })); setLimit(PAGE); };
  const reset = () => { setF(EMPTY_FILTERS); setLimit(PAGE); };
  const toggleRow = (name) => setOpen((o) => (o === name ? null : name));

  const rows = useMemo(() => filterConfigs(SORTED_CONFIGS, f), [f]);
  const shown = rows.slice(0, limit);
  const eqOn = eqFilterActive(f), fiOn = fiFilterActive(f);

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`.cp-cat-row{cursor:pointer}.cp-cat-row:hover td{background:rgba(0,68,101,0.05)}.cp-cat-btn:focus-visible,.cp-cat-row:focus-visible{outline:2px solid ${C.gold};outline-offset:-2px}`}</style>

      <div style={{ ...card, padding: "18px 20px" }}>
        <SecLbl>Browse Models</SecLbl>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) auto", gap: 16, alignItems: "start", marginBottom: 16 }}>
          <Field label="Search Model Name">
            <input value={f.q} onChange={(e) => set("q")(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") set("q")(""); }}
              placeholder='e.g. "Moderate 42" or "15/85"' aria-label="Search model name" style={inp} />
          </Field>
          <Field label="Investment Style">
            <select value={f.style} onChange={(e) => set("style")(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              <option value="">All styles</option>
              {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{styleLabel(s)}</option>)}
            </select>
          </Field>
          <Field label="Fixed Income" note={!fiOn ? "Not applicable for Equity Only" : null}>
            <select value={f.fi} onChange={(e) => set("fi")(e.target.value)} disabled={!fiOn} style={{ ...inp, cursor: fiOn ? "pointer" : "default", opacity: fiOn ? 1 : 0.4 }}>
              <option value="">All vehicles</option>
              {FI_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
          <div style={{ paddingTop: 22 }}>
            <button type="button" className="cp-cat-btn" onClick={reset} disabled={!isFiltered(f)}
              style={{ padding: "9px 14px", borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.white, color: isFiltered(f) ? C.navy : C.textMuted, fontSize: 12, fontWeight: 700, fontFamily: "'Lato',sans-serif", cursor: isFiltered(f) ? "pointer" : "default", whiteSpace: "nowrap" }}>
              Reset filters
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr", gap: 16, alignItems: "start" }}>
          <Field label="Proprietary Active"><Seg options={TOGGLE_OPTS} value={f.prop} onChange={set("prop")} /></Field>
          <Field label="Equity Strategy" note={!eqOn ? "Proprietary Active is off" : null}>
            <Seg options={[["", "Any"], ...EQ_OPTIONS.map((v) => [v, v])]} value={f.eq} onChange={set("eq")} disabled={!eqOn} />
          </Field>
          <Field label="Outsourced Active"><Seg options={TOGGLE_OPTS} value={f.out} onChange={set("out")} /></Field>
          <Field label="Passive"><Seg options={TOGGLE_OPTS} value={f.pas} onChange={set("pas")} /></Field>
          <Field label="International"><Seg options={TOGGLE_OPTS} value={f.intl} onChange={set("intl")} /></Field>
        </div>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <SecLbl>Model Catalog</SecLbl>
          <span style={{ fontSize: 12, color: C.textMuted }} aria-live="polite">
            <strong style={{ color: C.navy }}>{rows.length.toLocaleString("en-US")}</strong> of {TOTAL.toLocaleString("en-US")} models
          </span>
        </div>
        <div style={{ overflowX: "auto", position: "relative" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.gold}` }}>
                <th scope="col" style={{ ...th, textAlign: "left" }}>Model</th>
                <th scope="col" style={{ ...th, textAlign: "left" }}>Style</th>
                <th scope="col" style={{ ...th, textAlign: "left" }}>FI Vehicle</th>
                {SLEEVES.map((s) => (
                  <th key={s.key} scope="col" title={s.label} style={{ ...th, textAlign: "right" }}><span style={swatch(s.color)} />{s.short || s.label}</th>
                ))}
                <th scope="col" style={{ ...th, width: 20 }}><span style={srOnly}>Details</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c, i) => {
                const isOpen = open === c.name;
                const bg = isOpen ? "rgba(0,68,101,0.06)" : i % 2 === 0 ? C.offWhite : C.white;
                return (
                  <Fragment key={c.name}>
                    <tr className="cp-cat-row" onClick={() => toggleRow(c.name)} style={{ borderBottom: isOpen ? "none" : `1px solid ${C.borderLight}` }}>
                      <td style={{ ...cell, background: bg }}>
                        <div style={{ fontWeight: 700, color: C.navy }}>{c.name}</div>
                        {c.alt && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }} title={`Identical allocation to ${c.alt.join(", ")}`}>Also listed as {c.alt.map((n) => `#${modelNumber(n)}`).join(", ")}</div>}
                      </td>
                      <td style={{ ...cell, background: bg }}>{styleLabel(c.style)}</td>
                      <td style={{ ...cell, background: bg, color: c.fi === "N/A" ? C.textMuted : C.text }}>{c.fi === "N/A" ? "—" : c.fi}</td>
                      {SLEEVES.map((s) => {
                        const w = c.w[s.idx];
                        return <td key={s.key} style={{ ...cell, background: bg, textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: w > 0 ? 700 : 400, color: w > 0 ? C.text : "#b3bdc8" }}>{w > 0 ? fmtWeight(w) : "—"}</td>;
                      })}
                      <td style={{ ...cell, background: bg, padding: "10px 12px 10px 0" }}>
                        <button type="button" className="cp-cat-btn" aria-expanded={isOpen} aria-label={`${isOpen ? "Hide" : "Show"} details for ${c.name}`}
                          onClick={(e) => { e.stopPropagation(); toggleRow(c.name); }}
                          style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, display: "flex", color: C.textMuted }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr style={{ borderBottom: `1px solid ${C.borderLight}`, background: "rgba(0,68,101,0.03)", boxShadow: `inset 3px 0 0 ${C.gold}` }}>
                        <td colSpan={COLS} style={{ padding: 0 }}><Detail c={c} /></td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={COLS} style={{ padding: "36px 22px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                    No models match these filters.{" "}
                    <button type="button" className="cp-cat-btn" onClick={reset} style={{ border: "none", background: "none", padding: 0, color: C.navy, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "'Lato',sans-serif", textDecoration: "underline" }}>Reset filters</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {rows.length > limit && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 22px", borderTop: `1px solid ${C.borderLight}`, fontSize: 12, color: C.textMuted }}>
            <span>Showing {limit.toLocaleString("en-US")} of {rows.length.toLocaleString("en-US")}</span>
            <button type="button" className="cp-cat-btn" onClick={() => setLimit((l) => l + PAGE)} style={pageBtn}>Show {Math.min(PAGE, rows.length - limit)} more</button>
            <button type="button" className="cp-cat-btn" onClick={() => setLimit(rows.length)} style={pageBtn}>Show all</button>
          </div>
        )}
      </div>
    </div>
  );
}

const pageBtn = { padding: "7px 14px", borderRadius: 6, border: `1.5px solid ${C.border}`, background: C.white, color: C.navy, fontSize: 12, fontWeight: 700, fontFamily: "'Lato',sans-serif", cursor: "pointer" };

// No props: memo keeps builder interactions in App from re-rendering the catalog.
export default memo(CatalogView);
