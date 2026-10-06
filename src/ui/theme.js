// Shared visual tokens + formatters (Sandhill navy/gold brand), used by the
// builder (App.js) and the catalog view.

export const C={navy:"#004465",navyLight:"#005a82",navyDark:"#003450",gold:"#d0ac2b",goldLight:"#e6cd6a",white:"#ffffff",offWhite:"#f7f8fa",bg:"#eef1f5",text:"#1a1a1a",textMuted:"#5a6a7a",border:"#d4dae2",borderLight:"#e6eaf0",success:"#2e7d52",danger:"#b5342b"};
export const fmt=n=>n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
export const fmtPct=n=>(n*100).toFixed(1)+"%";

export const inp={width:"100%",padding:"9px 12px",borderRadius:6,border:`1.5px solid ${C.border}`,fontSize:14,fontFamily:"'Lato',sans-serif",outline:"none",boxSizing:"border-box",background:C.offWhite,color:C.text};
export const td={padding:"10px 18px",fontSize:13,color:C.text,whiteSpace:"nowrap",fontFamily:"'Lato',sans-serif"};
