import { useState, useMemo, useCallback } from "react";

const LOGO_SRC = "data:image/png;base64,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";

const CEA_MIN_VALUE=50000, BOND_MIN_VALUE=80000;
const STYLES=["Conservative","Moderate","Aggressive","Equity Only"];
const EQ_STRATS=["CEA","LCY","CEA/LCY"];
const FI_OPTS=["Sandhill Corporate Bond","AGG/IGSB","NYF"];
const C={navy:"#004465",navyLight:"#005a82",navyDark:"#003450",gold:"#d0ac2b",goldLight:"#e6cd6a",white:"#ffffff",offWhite:"#f7f8fa",bg:"#eef1f5",text:"#1a1a1a",textMuted:"#5a6a7a",border:"#d4dae2",borderLight:"#e6eaf0",success:"#2e7d52",danger:"#b5342b"};
const fmt=n=>n.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const fmtPct=n=>(n*100).toFixed(1)+"%";

// ═══ WEIGHT ENGINE ══════════════════════════════════════════════════════════
function getFullPropWeight(style,prop,pas,intl,out){
  if(!prop)return 0;
  const W={Conservative:[10,5,10,7.5,15],Moderate:[25,12.5,25,15,30],Aggressive:[35,17.5,35,20,40],"Equity Only":[45,22.5,45,25,50]};
  const w=W[style];if(!w)return 0;
  if(pas&&intl&&!out)return w[0];if(pas&&intl&&out)return w[1];if(!pas&&intl&&out)return w[2];if(pas&&!intl&&out)return w[3];if(pas&&!intl&&!out)return w[4];return 0;
}
function getPassiveWt(style,anyP,pas,intl,out){
  if(!pas)return 0;
  const W={Conservative:[10,10,15,15,20,10,15],Moderate:[25,25,30,30,50,25,30],Aggressive:[35,35,40,40,70,35,40],"Equity Only":[45,44,49,50,88,45,50]};
  const w=W[style];if(!w)return 0;
  if(anyP&&intl&&out)return w[0];if(!anyP&&intl&&out)return w[1];if(!anyP&&!intl&&out)return w[2];if(anyP&&!intl&&out)return w[3];if(!anyP&&intl&&!out)return w[4];if(anyP&&intl&&!out)return w[5];if(anyP&&!intl&&!out)return w[6];return 0;
}
function getOutWt(style,anyP,pas,intl,out){
  if(!out)return 0;
  const W={Conservative:[10,5,10,7.5,15],Moderate:[25,12.5,25,15,30],Aggressive:[35,17.5,35,20,40],"Equity Only":[44,22.5,45,25,49]};
  const w=W[style];if(!w)return 0;
  if(!anyP&&pas&&intl)return w[0];if(anyP&&pas&&intl)return w[1];if(anyP&&!pas&&intl)return w[2];if(anyP&&pas&&!intl)return w[3];if(!anyP&&pas&&!intl)return w[4];return 0;
}
function getFixedWt(s){return s==="Conservative"?68:s==="Moderate"?38:s==="Aggressive"?18:0;}
function getPasSplits(style,pct){
  if(!pct)return[];
  if(style==="Conservative")return[{t:"IVV",l:"Passive Large Blend",c:"Large Cap Core",w:pct*0.5},{t:"IUSV",l:"Passive Large Value",c:"Large Cap Growth",w:pct*0.5}];
  const r=style==="Moderate"?0.6:0.7,m=style==="Moderate"?0.2:0.1;
  return[{t:"IVV",l:"Passive Large Blend",c:"Large Cap Core",w:pct*r},{t:"IVW",l:"Passive Large Growth",c:"Large Cap Growth",w:pct*0.2},{t:"IJH",l:"Passive Mid Blend",c:"Mid Cap",w:pct*m}];
}

const CEA_MINS={Conservative:{2.5:2000000,3.75:1333333,5:1000000,7.5:666667,10:500000,15:333333},Moderate:{6.25:800000,7.5:666667,12.5:400000,15:333333,25:200000,30:166667},Aggressive:{8.75:571429,10:500000,17.5:285714,20:250000,35:142857},"Equity Only":{11.25:444444,12.5:400000,22.5:222222,25:200000,45:111111,50:100000}};
const MIN_ACCT={Conservative:333333,Moderate:166667,Aggressive:142857,"Equity Only":100000};

function isCEABad(style,pct,mv){const m=CEA_MINS[style];if(!m)return false;for(const[p,v]of Object.entries(m))if(Math.abs(pct-Number(p))<0.01&&mv<v)return true;return false;}

// ═══ MODEL NAMING ═══════════════════════════════════════════════════════════
const MT=[];// non-Equity Only: 54 models
[[1,1,1,1],[0,1,1,1],[0,1,1,0],[0,0,1,1],[1,0,1,1],[1,0,1,0],[1,1,1,0],[1,1,0,1]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:!!c[0],o:!!c[1],p:!!c[2],i:!!c[3],f,y:false,n:g*3+f+1})));
[[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,0,1]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:false,o:!!c[0],p:!!c[1],i:!!c[2],f,y:true,n:24+g*3+f+1})));
[[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,0,1]].forEach((c,g)=>[0,1,2].forEach(f=>MT.push({a:true,o:!!c[0],p:!!c[1],i:!!c[2],f,y:true,n:39+g*3+f+1})));

const EM=[
  {a:1,o:1,p:1,i:1,y:0,n:1},{a:0,o:1,p:1,i:1,y:0,n:2},{a:0,o:1,p:1,i:0,y:0,n:3},{a:0,o:0,p:1,i:1,y:0,n:4},
  {a:1,o:0,p:1,i:1,y:0,n:5},{a:1,o:0,p:1,i:0,y:0,n:6},{a:1,o:1,p:1,i:0,y:0,n:7},{a:1,o:1,p:0,i:1,y:0,n:8},
  {a:0,o:1,p:1,i:1,y:1,n:9},{a:0,o:0,p:1,i:1,y:1,n:10},{a:0,o:0,p:1,i:0,y:1,n:11},{a:0,o:1,p:1,i:0,y:1,n:12},{a:0,o:1,p:0,i:1,y:1,n:13},
  {a:1,o:1,p:1,i:1,y:1,n:14},{a:1,o:0,p:1,i:1,y:1,n:15},{a:1,o:0,p:1,i:0,y:1,n:16},{a:1,o:1,p:1,i:0,y:1,n:17},{a:1,o:1,p:0,i:1,y:1,n:18},
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
    const hasCEA=propActive&&(eqStrat==="CEA"||eqStrat==="CEA/LCY"),hasLCY=propActive&&(eqStrat==="LCY"||eqStrat==="CEA/LCY"),anyP=hasCEA||hasLCY,both=eqStrat==="CEA/LCY"&&propActive;
    const fp=getFullPropWeight(style,propActive,passive,intl,outsourced);
    const ceaPct=hasCEA?(both?fp/2:fp):0,lcyPct=hasLCY?(both?fp/2:fp):0;
    const pasPct=getPassiveWt(style,anyP,passive,intl,outsourced),outPct=getOutWt(style,anyP,passive,intl,outsourced);
    const intlPct=intl?10:0,fixPct=isEQ?0:getFixedWt(style),cashPct=isEQ?(anyP?0:2):2;
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
          <button
            onClick={handlePDF}
            style={{
              background: C.gold,
              color: C.white,
              border: "none",
              borderRadius: 6,
              padding: "10px 16px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Lato',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#b8951e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.gold)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Export PDF
          </button>
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
      <div style={{textAlign:"center",padding:"20px 0 28px",color:C.textMuted,fontSize:11}}>Sandhill Investment Management · CorePlus Architect</div>
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