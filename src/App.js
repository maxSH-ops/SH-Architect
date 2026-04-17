// CorePlus Architect v4
// - v1: Initial build from Excel (4 styles, strategy toggles, donut chart, password gate)
// - v2: Sandhill brand guidelines applied (navy/gold, Lato, logo)
// - v3: Equity Only style, LCY/CEA/LCY equity strategy, PDF export, updated weight tables, CEA min $50K
// - v4: Residual-fill logic for 72 previously broken toggle combos, expanded model naming (90 non-EQ + 30 EQ = 300 models), under-allocation warning banner
import { useState, useMemo, useCallback } from "react";

const LOGO_SRC = "data:image/jpeg;base64,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";

const CEA_MIN_VALUE=50000, BOND_MIN_VALUE=80000;
const STYLES=["Conservative","Moderate","Aggressive","Equity Only"];
const EQ_STRATS=["CEA","LCY","CEA/LCY"];
const FI_OPTS=["Sandhill Corporate Bond","AGG/IGSB","NYF"];
const C={navy:"#004465",navyLight:"#005a82",navyDark:"#003450",gold:"#d0ac2b",goldLight:"#e6cd6a",white:"#ffffff",offWhite:"#f7f8fa",bg:"#eef1f5",text:"#1a1a1a",textMuted:"#5a6a7a",border:"#d4dae2",borderLight:"#e6eaf0",success:"#2e7d52",danger:"#b5342b"};
const fmt=n=>n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const fmtPct=n=>(n*100).toFixed(1)+"%";

// ═══ WEIGHT ENGINE (with residual-fill for gaps) ══════════════════════════
function _propTbl(style,pas,intl,out){
  const W={Conservative:[10,5,10,7.5,15],Moderate:[25,12.5,25,15,30],Aggressive:[35,17.5,35,20,40],"Equity Only":[45,22.5,45,25,50]};
  const w=W[style];if(!w)return null;
  if(pas&&intl&&!out)return w[0];if(pas&&intl&&out)return w[1];if(!pas&&intl&&out)return w[2];if(pas&&!intl&&out)return w[3];if(pas&&!intl&&!out)return w[4];return null;
}
function _pasTbl(style,anyP,intl,out){
  const W={Conservative:[10,10,15,15,20,10,15],Moderate:[25,25,30,30,50,25,30],Aggressive:[35,35,40,40,70,35,40],"Equity Only":[45,44,49,50,88,45,50]};
  const w=W[style];if(!w)return null;
  if(anyP&&intl&&out)return w[0];if(!anyP&&intl&&out)return w[1];if(!anyP&&!intl&&out)return w[2];if(anyP&&!intl&&out)return w[3];if(!anyP&&intl&&!out)return w[4];if(anyP&&intl&&!out)return w[5];if(anyP&&!intl&&!out)return w[6];return null;
}
function _outTbl(style,anyP,pas,intl){
  const W={Conservative:[10,5,10,7.5,15],Moderate:[25,12.5,25,15,30],Aggressive:[35,17.5,35,20,40],"Equity Only":[44,22.5,45,25,49]};
  const w=W[style];if(!w)return null;
  if(!anyP&&pas&&intl)return w[0];if(anyP&&pas&&intl)return w[1];if(anyP&&!pas&&intl)return w[2];if(anyP&&pas&&!intl)return w[3];if(!anyP&&pas&&!intl)return w[4];return null;
}
function getFixedWt(s){return s==="Conservative"?68:s==="Moderate"?38:s==="Aggressive"?18:0;}

function computeWeights(style,hasCEA,hasLCY,outOn,pasOn,intlOn){
  const isEQ=style==="Equity Only",anyP=hasCEA||hasLCY,both=hasCEA&&hasLCY;
  const fixPct=isEQ?0:getFixedWt(style),cashPct=isEQ?(anyP?0:2):2,intlPct=intlOn?10:0;
  const fpRaw=anyP?_propTbl(style,pasOn,intlOn,outOn):null;
  const pasRaw=pasOn?_pasTbl(style,anyP,intlOn,outOn):null;
  const outRaw=outOn?_outTbl(style,anyP,pasOn,intlOn):null;
  const fp=fpRaw!==null?fpRaw:0,ps=pasRaw!==null?pasRaw:0,ot=outRaw!==null?outRaw:0;
  let ceaPct=hasCEA?(both?fp/2:fp):0,lcyPct=hasLCY?(both?fp/2:fp):0;
  let pasPct=ps,outPct=ot;
  const raw=ceaPct+lcyPct+pasPct+outPct+intlPct+fixPct+cashPct;
  if(Math.abs(raw-100)<0.1) return {ceaPct,lcyPct,outPct,pasPct,intlPct,fixPct,cashPct};
  // Residual fill
  const residual=100-fixPct-cashPct-intlPct;
  if(anyP){
    if(outOn&&outRaw===null){outPct=residual/2;const pr=residual/2;if(both){ceaPct=pr/2;lcyPct=pr/2;}else if(hasCEA){ceaPct=pr;lcyPct=0;}else{ceaPct=0;lcyPct=pr;}}
    else{const pr=residual-outPct;if(both){ceaPct=pr/2;lcyPct=pr/2;}else if(hasCEA){ceaPct=pr;lcyPct=0;}else{ceaPct=0;lcyPct=pr;}}
  } else if(outOn){
    if(pasOn&&pasRaw===null){pasPct=residual/2;outPct=residual/2;}else{outPct=residual-pasPct;}
  } else if(pasOn){pasPct=residual;}
  return {ceaPct,lcyPct,outPct,pasPct,intlPct,fixPct,cashPct};
}
function getPasSplits(style,pct){
  if(!pct)return[];
  if(style==="Conservative")return[{t:"IVV",l:"Passive Large Blend",c:"Large Cap Core",w:pct*0.5},{t:"IUSV",l:"Passive Large Value",c:"Large Cap Growth",w:pct*0.5}];
  const r=style==="Moderate"?0.6:0.7,m=style==="Moderate"?0.2:0.1;
  return[{t:"IVV",l:"Passive Large Blend",c:"Large Cap Core",w:pct*r},{t:"IVW",l:"Passive Large Growth",c:"Large Cap Growth",w:pct*0.2},{t:"IJH",l:"Passive Mid Blend",c:"Mid Cap",w:pct*m}];
}

const CEA_MINS={Conservative:{2.5:2000000,3.75:1333333,5:1000000,7.5:666667,10:500000,15:333333},Moderate:{6.25:800000,7.5:666667,12.5:400000,15:333333,25:200000,30:166667},Aggressive:{8.75:571429,10:500000,17.5:285714,20:250000,35:142857},"Equity Only":{11.25:444444,12.5:400000,22.5:222222,25:200000,45:111111,50:100000}};
const MIN_ACCT={Conservative:333333,Moderate:166667,Aggressive:142857,"Equity Only":100000};

function isCEABad(style,pct,mv){const m=CEA_MINS[style];if(!m)return false;for(const[p,v]of Object.entries(m))if(Math.abs(pct-Number(p))<0.01&&mv<v)return true;return false;}

// ═══ MODEL NAMING (90 non-EQ models, 30 EQ models) ═══════════════════════
const MT=[];// non-Equity Only: 90 models (54 original + 36 new)
// CEA-only 1-24
[[1,1,1,1],[0,1,1,1],[0,1,1,0],[0,0,1,1],[1,0,1,1],[1,0,1,0],[1,1,1,0],[1,1,0,1]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:!!c[0],o:!!c[1],p:!!c[2],i:!!c[3],f,y:false,n:g*3+f+1})));
// LCY-only 25-39
[[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,0,1]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:false,o:!!c[0],p:!!c[1],i:!!c[2],f,y:true,n:24+g*3+f+1})));
// CEA+LCY 40-54
[[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,0,1]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:true,o:!!c[0],p:!!c[1],i:!!c[2],f,y:true,n:39+g*3+f+1})));
// NEW residual-fill models 55-90
// CEA-only no-passive: [out,intl]
[[1,0],[0,1],[0,0]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:true,o:!!c[0],p:false,i:!!c[1],f,y:false,n:54+g*3+f+1})));
// LCY-only no-passive: [out,intl]
[[1,0],[0,1],[0,0]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:false,o:!!c[0],p:false,i:!!c[1],f,y:true,n:63+g*3+f+1})));
// CEA+LCY no-passive: [out,intl]
[[1,0],[0,1],[0,0]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:true,o:!!c[0],p:false,i:!!c[1],f,y:true,n:72+g*3+f+1})));
// No-prop residual: out+no-pas+intl, out+no-pas+no-intl, pas-only+no-intl
[0,1,2].forEach(f=>{MT.push({a:false,o:true,p:false,i:true,f,y:false,n:81+f});MT.push({a:false,o:true,p:false,i:false,f,y:false,n:84+f});MT.push({a:false,o:false,p:true,i:false,f,y:false,n:87+f});});

const EM=[
  // Original 18
  {a:1,o:1,p:1,i:1,y:0,n:1},{a:0,o:1,p:1,i:1,y:0,n:2},{a:0,o:1,p:1,i:0,y:0,n:3},{a:0,o:0,p:1,i:1,y:0,n:4},
  {a:1,o:0,p:1,i:1,y:0,n:5},{a:1,o:0,p:1,i:0,y:0,n:6},{a:1,o:1,p:1,i:0,y:0,n:7},{a:1,o:1,p:0,i:1,y:0,n:8},
  {a:0,o:1,p:1,i:1,y:1,n:9},{a:0,o:0,p:1,i:1,y:1,n:10},{a:0,o:0,p:1,i:0,y:1,n:11},{a:0,o:1,p:1,i:0,y:1,n:12},{a:0,o:1,p:0,i:1,y:1,n:13},
  {a:1,o:1,p:1,i:1,y:1,n:14},{a:1,o:0,p:1,i:1,y:1,n:15},{a:1,o:0,p:1,i:0,y:1,n:16},{a:1,o:1,p:1,i:0,y:1,n:17},{a:1,o:1,p:0,i:1,y:1,n:18},
  // NEW 12 residual-fill models (19-30)
  {a:1,o:1,p:0,i:0,y:0,n:19},{a:0,o:1,p:0,i:0,y:1,n:20},{a:1,o:1,p:0,i:0,y:1,n:21},
  {a:1,o:0,p:0,i:1,y:0,n:22},{a:0,o:0,p:0,i:1,y:1,n:23},{a:1,o:0,p:0,i:1,y:1,n:24},
  {a:1,o:0,p:0,i:0,y:0,n:25},{a:0,o:0,p:0,i:0,y:1,n:26},{a:1,o:0,p:0,i:0,y:1,n:27},
  {a:0,o:1,p:0,i:1,y:0,n:28},{a:0,o:1,p:0,i:0,y:0,n:29},{a:0,o:0,p:1,i:0,y:0,n:30},
];

function modelName(style,cea,lcy,out,pas,intl,fi){
  if(style==="Equity Only"){const m=EM.find(r=>!!r.a===cea&&!!r.y===lcy&&!!r.o===out&&!!r.p===pas&&!!r.i===intl);return m?`CorePlus Equity Only ${m.n}`:"—";}
  const f=fi==="Sandhill Corporate Bond"?0:fi==="AGG/IGSB"?1:2;
  const m=MT.find(r=>r.a===cea&&r.y===lcy&&r.o===out&&r.p===pas&&r.i===intl&&r.f===f);
  return m?`CorePlus ${style} ${m.n}`:"—";
}

// ═══ MAIN ═══════════════════════════════════════════════════════════════════
export default function App(){
  const[unlocked,setUnlocked]=useState(false);const[pw,setPw]=useState("");const[shake,setShake]=useState(false);
  const handlePw=()=>{if(pw==="Sandhill")setUnlocked(true);else{setShake(true);setPw("");setTimeout(()=>setShake(false),500);}};
  const[accountName,setAccountName]=useState("");const[totalMV,setTotalMV]=useState(620000);const[mvInput,setMvInput]=useState("620,000");
  const[style,setStyle]=useState("Moderate");const[eqStrat,setEqStrat]=useState("CEA");
  const[propActive,setPropActive]=useState(true);const[outsourced,setOutsourced]=useState(true);const[passive,setPassive]=useState(true);const[intl,setIntl]=useState(true);
  const[fi,setFi]=useState("Sandhill Corporate Bond");
  const handleMV=useCallback(r=>{setMvInput(r);const p=parseFloat(r.replace(/[^0-9.]/g,""));if(!isNaN(p))setTotalMV(p);},[]);
  const handleMVB=useCallback(()=>setMvInput(totalMV.toLocaleString("en-US")),[totalMV]);
  const isEQ=style==="Equity Only";

  const model=useMemo(()=>{
    const hasCEA=propActive&&(eqStrat==="CEA"||eqStrat==="CEA/LCY"),hasLCY=propActive&&(eqStrat==="LCY"||eqStrat==="CEA/LCY"),anyP=hasCEA||hasLCY;
    const wts=computeWeights(style,hasCEA,hasLCY,outsourced,passive,intl);
    const {ceaPct,lcyPct,outPct,pasPct,intlPct,fixPct,cashPct}=wts;
    const checkPct=ceaPct||lcyPct;
    const ceaBad=propActive&&isCEABad(style,checkPct,totalMV);
    const ss={};
    if(propActive){if(!ceaBad)ss.prop={ok:true,msg:"OK!"};else if(totalMV<(MIN_ACCT[style]||999999))ss.prop={ok:false,msg:"Account market value is too low for CEA/LCY"};else ss.prop={ok:false,msg:"CEA/LCY sleeve size too small; disable one or more strategies"};}else ss.prop={ok:null,msg:""};
    ss.out=outsourced?{ok:true,msg:"OK!"}:{ok:null,msg:""};ss.pas=passive?{ok:true,msg:"OK!"}:{ok:null,msg:""};ss.intl=intl?{ok:true,msg:"OK!"}:{ok:null,msg:""};

    const rows=[];
    if(ceaPct>0)rows.push({cls:"All Cap Core",cat:"All Cap Core",ticker:"CEA",w:ceaPct/100});
    if(lcyPct>0)rows.push({cls:"Large Cap Core",cat:"Large Cap Core",ticker:"LCY",w:lcyPct/100});
    if(outPct>0){rows.push({cls:"Active Large Value",cat:"Large Cap Value",ticker:"PVAL",w:outPct/200});rows.push({cls:"Active US Core",cat:"Large Cap Core",ticker:"FFLC",w:outPct/200});}
    for(const s of getPasSplits(style,pasPct))if(s.w>0)rows.push({cls:s.l,cat:s.c,ticker:s.t,w:s.w/100});
    if(intlPct>0)rows.push({cls:"International",cat:"International",ticker:"VEU",w:intlPct/100});
    if(!isEQ){
      if(fi==="Sandhill Corporate Bond")rows.push({cls:"Fixed Income",cat:"Fixed Income",ticker:"Sandhill Corporate Bond",w:fixPct/100});
      else if(fi==="AGG/IGSB"){rows.push({cls:"Fixed Income",cat:"Fixed Income",ticker:"AGG",w:fixPct*0.6/100});rows.push({cls:"Fixed Income",cat:"Fixed Income",ticker:"IGSB",w:fixPct*0.4/100});}
      else rows.push({cls:"Fixed Income",cat:"Fixed Income",ticker:"NYF",w:fixPct/100});
    }
    if(cashPct>0)rows.push({cls:"Cash Equivalent",cat:"Cash & Equiv",ticker:"Cash/Equiv - TBIL",w:cashPct/100});
    const enriched=rows.map(r=>({...r,dv:r.w*totalMV}));
    const tw=enriched.reduce((s,r)=>s+r.w,0),td=enriched.reduce((s,r)=>s+r.dv,0);
    const bw=enriched.find(r=>r.ticker==="Sandhill Corporate Bond");
    const mn=modelName(style,hasCEA,hasLCY,outsourced,passive,intl,fi);
    const cm={};for(const r of enriched)if(r.w>0){cm[r.cat]=(cm[r.cat]||0)+r.w;}
    return{rows:enriched,tw,td,ss,bw:bw&&bw.dv<BOND_MIN_VALUE?"Account market value is too low for Corporate Bond":null,mn,cm};
  },[style,eqStrat,propActive,outsourced,passive,intl,fi,totalMV,isEQ]);

  const cc={"All Cap Core":C.navy,"Large Cap Value":"#005f8a","Large Cap Core":"#0080ab","Large Cap Growth":"#4da8c4","Mid Cap":"#7ec4d8",International:C.gold,"Fixed Income":C.navyDark,"Cash & Equiv":"#9eacb8"};
  const ce=Object.entries(model.cm).filter(([,v])=>v>0);

  const handlePDF=useCallback(()=>{
    const trs=model.rows.filter(r=>r.w>0).map(r=>`<tr><td style="p:6px 12px;padding:6px 12px;border-bottom:1px solid #e0e0e0">${r.cls}</td><td style="padding:6px 12px;border-bottom:1px solid #e0e0e0;color:#5a6a7a">${r.cat}</td><td style="padding:6px 12px;border-bottom:1px solid #e0e0e0;font-weight:700;color:#004465">${r.ticker}</td><td style="padding:6px 12px;border-bottom:1px solid #e0e0e0;text-align:right;font-weight:700">${fmtPct(r.w)}</td><td style="padding:6px 12px;border-bottom:1px solid #e0e0e0;text-align:right">${fmt(r.dv)}</td></tr>`).join("");
    const leg=ce.map(([c,w])=>`<div style="display:flex;justify-content:space-between;margin:2px 0"><span>${c}</span><span style="font-weight:700;color:#004465">${(w*100).toFixed(1)}%</span></div>`).join("");
    const strats=[propActive?`Proprietary Active (${eqStrat})`:null,outsourced?"Outsourced Active":null,passive?"Passive":null,intl?"International":null].filter(Boolean).join(" · ");
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CorePlus Portfolio Summary</title><style>@page{size:letter;margin:0.75in}body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;margin:0;padding:0;font-size:12px}table{width:100%;border-collapse:collapse}th{padding:6px 12px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:#5a6a7a;border-bottom:2px solid #d0ac2b}</style></head><body>
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #d0ac2b;padding-bottom:16px;margin-bottom:20px"><div style="display:flex;align-items:center;gap:16px"><img src="${LOGO_SRC}" style="height:36px"/><div style="font-size:18px;color:#004465;font-weight:300">CorePlus Portfolio Summary</div></div><div style="text-align:right"><div style="font-size:10px;color:#5a6a7a;text-transform:uppercase;letter-spacing:0.1em">Model</div><div style="font-size:15px;font-weight:700;color:#004465">${model.mn}</div></div></div>
    <div style="display:flex;gap:32px;margin-bottom:20px"><div style="flex:1"><div style="font-size:9px;color:#d0ac2b;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:6px">Account Details</div><div style="margin-bottom:4px"><span style="color:#5a6a7a">Account:</span> <strong>${accountName||"—"}</strong></div><div style="margin-bottom:4px"><span style="color:#5a6a7a">Market Value:</span> <strong>${fmt(totalMV)}</strong></div><div style="margin-bottom:4px"><span style="color:#5a6a7a">Style:</span> <strong>${style}</strong></div><div><span style="color:#5a6a7a">Strategies:</span> ${strats}</div></div><div style="width:220px"><div style="font-size:9px;color:#d0ac2b;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:6px">Category Breakdown</div>${leg}</div></div>
    <div style="font-size:9px;color:#d0ac2b;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:8px">Allocation Summary</div>
    <table><thead><tr><th>Class</th><th>Category</th><th>Ticker</th><th style="text-align:right">Weight</th><th style="text-align:right">Dollar Value</th></tr></thead><tbody>${trs}</tbody><tfoot><tr style="border-top:2px solid #004465;font-weight:900"><td colspan="3" style="padding:8px 12px">Total</td><td style="padding:8px 12px;text-align:right;color:${model.tw>=0.999&&model.tw<=1.001?"#004465":"#b5342b"}">${fmtPct(model.tw)}</td><td style="padding:8px 12px;text-align:right;color:#004465">${fmt(model.td)}</td></tr></tfoot></table>
    <div style="position:fixed;bottom:0.75in;left:0.75in;right:0.75in;border-top:1px solid #d4dae2;padding-top:8px;font-size:9px;color:#5a6a7a;display:flex;justify-content:space-between"><span>Sandhill Investment Management · 40 Fountain Plaza Suite 1300, Buffalo, NY 14202</span><span>Generated ${new Date().toLocaleDateString()}</span></div>
    <div style="position:fixed;bottom:0.4in;left:0.75in;right:0.75in;font-size:7.5px;color:#9eacb8">This document is for informational purposes only and does not constitute investment advice. Past performance is not indicative of future results. Sandhill Investment Management is a registered investment advisor.</div></body></html>`;
    const w=window.open("","_blank");if(w){w.document.write(html);w.document.close();setTimeout(()=>w.print(),300);}
  },[model,accountName,totalMV,style,eqStrat,propActive,outsourced,passive,intl,ce]);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Lato',sans-serif",color:C.text,position:"relative"}}>
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
      {!unlocked&&(<div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,20,35,0.35)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)"}}>
        <div style={{background:C.white,borderRadius:12,padding:"40px 44px",boxShadow:"0 20px 60px rgba(0,0,0,0.25)",textAlign:"center",maxWidth:380,width:"100%",border:`1px solid ${C.borderLight}`}}>
          <img src={LOGO_SRC} alt="Sandhill" style={{height:44,marginBottom:20}}/><div style={{fontFamily:"'Libre Baskerville',serif",fontSize:18,color:C.navy,marginBottom:4}}>CorePlus Architect</div><div style={{fontSize:12,color:C.textMuted,marginBottom:24}}>Enter password to continue</div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handlePw();}} placeholder="Password" autoFocus style={{...inp,textAlign:"center",fontSize:15,padding:"11px 16px",marginBottom:14,animation:shake?"shake 0.4s ease":"none"}}/>
          <button onClick={handlePw} style={{width:"100%",padding:"11px 0",borderRadius:6,border:"none",background:C.navy,color:C.white,fontSize:14,fontWeight:700,fontFamily:"'Lato',sans-serif",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.navyLight} onMouseLeave={e=>e.currentTarget.style.background=C.navy}>Unlock</button></div>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      </div>)}
      <div style={{filter:unlocked?"none":"blur(8px)",transition:"filter 0.4s",pointerEvents:unlocked?"auto":"none"}}>
      <header style={{background:C.white,padding:"0 40px",height:72,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`3px solid ${C.gold}`,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}><img src={LOGO_SRC} alt="Sandhill" style={{height:40}}/><div style={{height:30,width:1,background:C.border}}/><h1 style={{margin:0,fontFamily:"'Libre Baskerville',serif",fontSize:19,color:C.navy,fontWeight:400}}>CorePlus Architect</h1></div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {model.mn!=="—"&&<div style={{background:C.navy,borderRadius:6,padding:"8px 18px",display:"flex",alignItems:"center",gap:10}}><span style={{color:C.goldLight,fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700}}>Model</span><span style={{color:C.white,fontSize:14,fontWeight:700}}>{model.mn}</span></div>}
          <button onClick={handlePDF} style={{background:C.gold,color:C.white,border:"none",borderRadius:6,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Lato',sans-serif",display:"flex",alignItems:"center",gap:6}} onMouseEnter={e=>e.currentTarget.style.background="#b8951e"} onMouseLeave={e=>e.currentTarget.style.background=C.gold}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Export PDF</button>
        </div>
      </header>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"28px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:24,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Panel title="Account Details"><div style={{marginBottom:12}}><Lbl>Account Name / Number</Lbl><input value={accountName} onChange={e=>setAccountName(e.target.value)} placeholder="e.g. Smith Family Trust" style={inp}/></div><div><Lbl>Total Market Value</Lbl><div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.textMuted,fontSize:14,fontWeight:700}}>$</span><input value={mvInput} onChange={e=>handleMV(e.target.value)} onBlur={handleMVB} onFocus={()=>setMvInput(totalMV.toString())} style={{...inp,paddingLeft:24,fontWeight:700}}/></div></div></Panel>
            <Panel title="Investment Style"><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderRadius:6,overflow:"hidden",border:`1.5px solid ${C.border}`}}>{STYLES.map((s,i)=><button key={s} onClick={()=>setStyle(s)} style={{padding:"10px 4px",border:"none",cursor:"pointer",fontSize:11.5,fontWeight:style===s?700:400,fontFamily:"'Lato',sans-serif",background:style===s?C.navy:C.white,color:style===s?C.white:C.text,borderRight:i<3?`1.5px solid ${C.border}`:"none",transition:"all 0.15s"}}>{s}</button>)}</div></Panel>
            <Panel title="Strategies"><div style={{display:"flex",flexDirection:"column",gap:7}}>
              <Tog label="Proprietary Active" checked={propActive} onChange={setPropActive} status={model.ss.prop}/>
              <Tog label="Outsourced Active" checked={outsourced} onChange={setOutsourced} status={model.ss.out}/>
              <Tog label="Passive" checked={passive} onChange={setPassive} status={model.ss.pas}/>
              <Tog label="International" checked={intl} onChange={setIntl} status={model.ss.intl}/>
            </div></Panel>
            <Panel title="Equity Strategy"><div style={{display:"flex",borderRadius:6,overflow:"hidden",border:`1.5px solid ${propActive?C.border:C.borderLight}`,opacity:propActive?1:0.4,pointerEvents:propActive?"auto":"none",transition:"opacity 0.2s"}}>{EQ_STRATS.map((s,i)=><button key={s} onClick={()=>setEqStrat(s)} style={{flex:1,padding:"10px 6px",border:"none",cursor:"pointer",fontSize:12,fontWeight:eqStrat===s?700:400,fontFamily:"'Lato',sans-serif",background:eqStrat===s?C.navy:C.white,color:eqStrat===s?C.white:C.text,borderRight:i<2?`1.5px solid ${C.border}`:"none"}}>{s}</button>)}</div>{!propActive&&<div style={{fontSize:11,color:C.textMuted,marginTop:6,fontStyle:"italic"}}>Enable Proprietary Active to select</div>}</Panel>
            <Panel title="Fixed Income"><div style={{opacity:isEQ?0.4:1,pointerEvents:isEQ?"none":"auto"}}><div style={{display:"flex",flexDirection:"column",gap:5}}>{FI_OPTS.map(f=><label key={f} onClick={()=>!isEQ&&setFi(f)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:6,cursor:isEQ?"default":"pointer",background:fi===f&&!isEQ?"rgba(0,68,101,0.04)":"transparent",border:`1.5px solid ${fi===f&&!isEQ?C.navy:"transparent"}`}}><div style={{width:16,height:16,borderRadius:8,boxSizing:"border-box",border:fi===f&&!isEQ?`5px solid ${C.navy}`:`2px solid ${C.border}`,background:C.white}}/><span style={{fontSize:13,fontWeight:fi===f&&!isEQ?600:400}}>{f}</span></label>)}</div></div>{isEQ&&<div style={{fontSize:11,color:C.textMuted,marginTop:6,fontStyle:"italic"}}>Not applicable for Equity Only</div>}{model.bw&&!isEQ&&<div style={{marginTop:10,padding:"9px 12px",borderRadius:6,background:"#fef2f2",border:"1px solid #fecaca",color:C.danger,fontSize:12,fontWeight:600}}>⚠ {model.bw}</div>}</Panel>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:C.white,borderRadius:8,padding:"22px 26px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",border:`1px solid ${C.borderLight}`}}>
              <SecLbl>Allocation Overview</SecLbl>
              <div style={{display:"flex",gap:32,alignItems:"center"}}>
                <Donut entries={ce} colors={cc} tw={model.tw}/>
                <div style={{display:"flex",flexDirection:"column",gap:7,flex:1}}>{ce.map(([cat,w])=><div key={cat} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:cc[cat]||"#6C757D"}}/><span style={{fontSize:12.5}}>{cat}</span></div><span style={{fontSize:12.5,color:C.navy,fontWeight:700}}>{(w*100).toFixed(1)}%</span></div>)}</div>
              </div>
              <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${C.borderLight}`,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
                <Stat label="Total Value" value={fmt(model.td)}/><Stat label="Positions" value={model.rows.filter(r=>r.w>0).length}/><Stat label={isEQ?"Equity":"Equity / FI"} value={isEQ?`${(model.tw*100).toFixed(0)}%`:`${(100-getFixedWt(style)-2)} / ${getFixedWt(style)}`}/>
              </div>
            </div>
            {model.tw<0.999&&(<div style={{background:"#fef2f2",border:`1.5px solid ${C.danger}`,borderRadius:8,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:18,background:C.danger,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:C.white,fontSize:18,fontWeight:900}}>!</span></div>
              <div><div style={{fontSize:14,fontWeight:700,color:C.danger,marginBottom:2}}>Model allocation is {fmtPct(model.tw)} — does not sum to 100%</div><div style={{fontSize:12.5,color:"#7a3a36"}}>Please enable additional strategies to complete the portfolio allocation.</div></div>
            </div>)}
            <div style={{background:C.white,borderRadius:8,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",border:`1px solid ${C.borderLight}`,overflow:"hidden"}}>
              <div style={{padding:"16px 22px 0"}}><SecLbl>Allocation Summary</SecLbl></div>
              <table style={{width:"100%",borderCollapse:"collapse",marginTop:10}}>
                <thead><tr style={{borderBottom:`2px solid ${C.gold}`}}>{["Class","Category","Ticker","Weight","Dollar Value"].map(h=><th key={h} style={{padding:"9px 18px",textAlign:h==="Weight"||h==="Dollar Value"?"right":"left",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:C.textMuted,fontWeight:700}}>{h}</th>)}</tr></thead>
                <tbody>{model.rows.filter(r=>r.w>0).map((r,i)=><tr key={i} style={{borderBottom:`1px solid ${C.borderLight}`,background:i%2===0?C.offWhite:C.white}}><td style={{...td,fontWeight:600}}>{r.cls}</td><td style={{...td,color:C.textMuted}}>{r.cat}</td><td style={td}><span style={{fontSize:12,fontWeight:700,background:"rgba(0,68,101,0.06)",padding:"3px 8px",borderRadius:4,color:C.navy}}>{r.ticker}</span></td><td style={{...td,textAlign:"right",fontWeight:700}}>{fmtPct(r.w)}</td><td style={{...td,textAlign:"right"}}>{fmt(r.dv)}</td></tr>)}</tbody>
                <tfoot><tr style={{borderTop:`2px solid ${C.navy}`,background:"rgba(0,68,101,0.03)"}}><td colSpan={3} style={{...td,fontWeight:900,fontSize:13}}>Total</td><td style={{...td,textAlign:"right",fontWeight:900,fontSize:13,color:model.tw>=0.999&&model.tw<=1.001?C.navy:C.danger}}>{fmtPct(model.tw)}</td><td style={{...td,textAlign:"right",fontWeight:900,fontSize:13,color:C.navy}}>{fmt(model.td)}</td></tr></tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"20px 0 28px",color:C.textMuted,fontSize:11}}>Sandhill Investment Management · CorePlus Architect v4</div>
      </div>
    </div>
  );
}

function Panel({title,children}){return (<div style={{background:C.white,borderRadius:8,padding:"18px 20px",boxShadow:"0 1px 3px rgba(0,0,0,0.05)",border:`1px solid ${C.borderLight}`}}><SecLbl>{title}</SecLbl>{children}</div>);}
function SecLbl({children}){return (<div style={{fontSize:10.5,textTransform:"uppercase",letterSpacing:"0.12em",color:C.gold,fontWeight:700,marginBottom:12}}>{children}</div>);}
function Lbl({children}){return (<div style={{fontSize:12,fontWeight:600,color:C.textMuted,marginBottom:5}}>{children}</div>);}
function Stat({label,value}){return (<div><div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:700,marginBottom:3}}>{label}</div><div style={{fontSize:20,fontWeight:900,color:C.navy}}>{value}</div></div>);}
function Tog({label,checked,onChange,status}){return (<div onClick={()=>onChange(!checked)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:6,cursor:"pointer",background:checked?"rgba(0,68,101,0.04)":C.white,border:`1.5px solid ${checked?C.navy:C.border}`}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:20,borderRadius:10,background:checked?C.navy:"#c4cdd6",position:"relative"}}><div style={{width:16,height:16,borderRadius:8,background:C.white,position:"absolute",top:2,left:checked?20:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.18)"}}/></div><span style={{fontSize:13.5,fontWeight:500}}>{label}</span></div>{status&&status.msg&&<span style={{fontSize:11,fontWeight:600,color:status.ok?C.success:C.danger}}>{status.ok?"✓":"⚠"} {status.msg}</span>}</div>);}
function Donut({entries,colors,tw}){let cum=0;return (<div style={{position:"relative",width:180,height:180,flexShrink:0}}><svg viewBox="0 0 200 200" width="180" height="180">{entries.map(([cat,w])=>{const pct=w/tw,ang=pct*360,sa=cum;cum+=ang;const sr=(sa-90)*Math.PI/180,er=(sa+ang-90)*Math.PI/180,la=ang>180?1:0,r=82,cx=100,cy=100;if(ang<0.5)return null;const d=ang>=359.9?`M ${cx+r} ${cy} A ${r} ${r} 0 1 1 ${cx-r} ${cy} A ${r} ${r} 0 1 1 ${cx+r} ${cy}`:`M ${cx} ${cy} L ${cx+r*Math.cos(sr)} ${cy+r*Math.sin(sr)} A ${r} ${r} 0 ${la} 1 ${cx+r*Math.cos(er)} ${cy+r*Math.sin(er)} Z`;return (<path key={cat} d={d} fill={colors[cat]||"#6C757D"} stroke={C.white} strokeWidth="2.5"/>);})}<circle cx="100" cy="100" r="50" fill={C.white}/><text x="100" y="95" textAnchor="middle" style={{fontSize:24,fontWeight:900,fontFamily:"'Lato',sans-serif",fill:tw>=0.999&&tw<=1.001?C.navy:C.danger}}>{(tw*100).toFixed(0)}%</text><text x="100" y="113" textAnchor="middle" style={{fontSize:9.5,fill:C.textMuted,letterSpacing:"0.12em",fontWeight:700}}>ALLOCATED</text></svg></div>);}

const inp={width:"100%",padding:"9px 12px",borderRadius:6,border:`1.5px solid ${C.border}`,fontSize:14,fontFamily:"'Lato',sans-serif",outline:"none",boxSizing:"border-box",background:C.offWhite,color:C.text};
const td={padding:"10px 18px",fontSize:13,color:C.text,whiteSpace:"nowrap",fontFamily:"'Lato',sans-serif"};
