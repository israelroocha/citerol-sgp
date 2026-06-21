import { useState, useEffect, useRef, Component } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── VERSÃO ───────────────────────────────────────────────────────────────────
const SGP_VERSION = "v2.5.1";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
// ─── WORKER CONFIG ────────────────────────────────────────────────────────────
const WORKER_URL = "https://citerol-sgp.israel-caetano-lima.workers.dev";
const SGP_TOKEN  = "sgp_citerol_2024_xK9mP";

async function apiFetch(path, method = "GET", body = null) {
  const res = await fetch(`${WORKER_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-SGP-Token": SGP_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Worker ${method} ${path} → ${res.status}`);
  return res.json();
}


const C = {
  red:"#9E0B0F", redHover:"#7a0809", green:"#4B5528",
  black:"#111", gray800:"#2d2d2d", gray700:"#444",
  gray600:"#666", gray500:"#888", gray400:"#aaa",
  gray300:"#ccc", gray200:"#e2e2e2", gray100:"#f2f2f2",
  gray50:"#fafafa", white:"#fff",
  amber:"#b45309", blue:"#1e40af", teal:"#0f766e", purple:"#6d28d9",
};
const STAGE_COLOR = {
  "Programação":C.amber,"Amostra Digital":C.purple,"Amostra Física":"#be185d",
  "Separação":C.blue,"Direcionamento":"#0369a1",
  "Bordado Interno":C.green,"Bordado Externo":C.purple,
  "Expedição":C.teal,"Faturamento":C.green,
};

// ─── ÍCONES SVG ───────────────────────────────────────────────────────────────
// Cada ícone é um path SVG 24x24, traçado monocromático
const ICONS = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  pin:       "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  grid:      "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  funnel:    "M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z",
  chart:     "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  history:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  trophy:    "M8 21h8m-4-4v4M5 3h14M6 3v8a6 6 0 0012 0V3",
  list:      "M4 6h16M4 10h16M4 14h16M4 18h16",
  needle:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  monitor:   "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  scissors:  "M6 9a3 3 0 100-6 3 3 0 000 6zm12 6a3 3 0 100-6 3 3 0 000 6zM6 9l12-6M6 15l12 6",
  arrow:     "M13 7l5 5m0 0l-5 5m5-5H6",
  box:       "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  dollar:    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  users:     "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  gear:      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  bell:      "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  check:     "M5 13l4 4L19 7",
  warn:      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  clock:     "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  chevR:     "M9 5l7 7-7 7",
  chevL:     "M15 19l-7-7 7-7",
  send:      "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  download:  "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  refresh:   "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  close:     "M6 18L18 6M6 6l12 12",
  up:        "M5 15l7-7 7 7",
  inbox:     "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
};

function Ic({ n, s = 16, c = "currentColor", style = {} }) {
  const paths = (ICONS[n] || ICONS.check).split("M").filter(Boolean);
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: "block", ...style }}>
      {paths.map((p, i) => <path key={i} d={"M" + p} />)}
    </svg>
  );
}

// ─── SLA ─────────────────────────────────────────────────────────────────────
const SLA_DEF = {
  "Programação":8,"Amostra Digital":16,"Amostra Física":24,
  "Separação":48,"Direcionamento":4,"Bordado Interno":72,
  "Bordado Externo":120,"Expedição":8,"Faturamento":4,
};

// ─── MÓDULOS DO SISTEMA ───────────────────────────────────────────────────────
// Cada módulo é uma permissão individual atribuível a um usuário.
const NAV_ITEMS = [
  // Principal
  {id:"demandas",    label:"Minhas Demandas",    icon:"pin",     grupo:"Principal"},
  {id:"dashboard",   label:"Dashboard",          icon:"grid",    grupo:"Principal"},
  {id:"funil",       label:"Funil em Tempo Real",icon:"funnel",  grupo:"Principal"},
  // Análise
  {id:"gerencial",   label:"Gerencial",          icon:"chart",   grupo:"Análise"},
  {id:"historico",   label:"Histórico",          icon:"history", grupo:"Análise"},
  {id:"alteracoes_form", label:"Alterações de Formulário", icon:"warn", grupo:"Análise"},
  {id:"ranking",     label:"Ranking / Premiação",icon:"trophy",  grupo:"Análise"},
  // Operações
  {id:"pedidos",                 label:"Todos os Pedidos",         icon:"list",    grupo:"Operações"},
  {id:"direcionamento",          label:"Direcionamento",           icon:"arrow",   grupo:"Operações"},
  {id:"programacao",             label:"Programação",              icon:"needle",  grupo:"Operações"},
  {id:"amostra_digital",         label:"Amostra Digital",          icon:"monitor", grupo:"Operações"},
  {id:"aprovacao_amostra_digital",label:"Aprovação Amostra Digital",icon:"check",  grupo:"Operações"},
  {id:"amostra_fisica",          label:"Amostra Física",           icon:"scissors",grupo:"Operações"},
  {id:"aprovacao_amostra_fisica",label:"Aprovação Amostra Física", icon:"check",   grupo:"Operações"},
  {id:"bordado_interno",         label:"Bordado Interno",          icon:"needle",  grupo:"Operações"},
  {id:"bordado_externo",         label:"Bordado Externo",          icon:"box",     grupo:"Operações"},
  {id:"expedicao",               label:"Expedição",                icon:"box",     grupo:"Operações"},
  {id:"faturamento",             label:"Faturamento",              icon:"dollar",  grupo:"Operações"},
  {id:"finalizados",             label:"Finalizados",              icon:"check",   grupo:"Operações"},
  // Sistema
  {id:"sla",         label:"Configurar SLA",     icon:"gear",    grupo:"Sistema"},
  {id:"usuarios",    label:"Usuários",           icon:"users",   grupo:"Sistema"},
];

// Mapeia módulo de operação -> etapa do funil (para "Minhas Demandas")
const MODULO_ETAPA = {
  direcionamento:           "Direcionamento",
  programacao:              "Programação",
  amostra_digital:          "Amostra Digital",
  aprovacao_amostra_digital:"Aprovação de Amostra Digital",
  amostra_fisica:           "Amostra Física",
  aprovacao_amostra_fisica: "Aprovação de Amostra Física",
  bordado_interno:          "Bordado Interno",
  bordado_externo:          "Bordado Externo",
  expedicao:                "Expedição",
  faturamento:              "Faturamento",
};

// Mapa de etapa -> propriedade de arquivo no HubSpot
const ETAPA_PROPRIEDADE = {
  "Programação":     "programacao_de_bordado",
  "Amostra Digital": "amostra_digital",
  "Amostra Física":  "amostra_fisica",
};

// Propriedade do motivo de rejeição por etapa que volta
const ETAPA_PROP_MOTIVO = {
  "Amostra Digital": "motivo_da_rejeicao_da_amostra_digital",
  "Amostra Física":  "motivo_da_rejeicao_do_bordado",
};

// Mapa nome da etapa -> ID da etapa no HubSpot (funil Bordado)
const ETAPA_STAGE_ID = {
  "Programação":                "1377887836",
  "Amostra Digital":            "1377887837",
  "Aprovação de Amostra Digital":"1377887838",
  "Amostra Física":             "1377887839",
  "Aprovação de Amostra Física":"1377887840",
  "Liberado para bordar":       "1377887841",
  "Bordado Externo":            "1377887842",
  "Bordado Interno":            "1377706615",
  "Bordado Interno e Externo":  "1383604282",
  "Bordado Finalizado":         "1377706616",
};

// Helper: usuário tem acesso a um módulo?
function temAcesso(user, moduloId) {
  if (!user) return false;
  if (user.admin) return true; // admin vê tudo
  return (user.modulos || []).includes(moduloId);
}

// Lista de usuários para menções no chat — populada via Worker em runtime.
// Mantida vazia por padrão para não quebrar referências; o chat resolve nomes
// pelos dados do pedido quando disponível.
let USERS = [];


// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const NOW = Date.now();
const h = n => n*3600000, d = n => n*86400000;
function mkTL(stages){
  return stages.map(s=>({
    stage:s.stage,user:s.user,
    enteredAt:new Date(NOW-s.ago).toISOString(),
    exitedAt:s.ex!=null?new Date(NOW-s.ex).toISOString():null,
    dH:s.ex!=null?(s.ago-s.ex)/3600000:null,
  }));
}
const ORDERS_INIT = [];

const HIST = [];

const GER_DATA = {
  etapas:[],
  tempo:[],
  semanal:[],
  dist:[{n:"Bordado Interno",v:0},{n:"Bordado Externo",v:0},{n:"DTF",v:0}],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useIsMobile(){
  const[m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  useEffect(()=>{const f=()=>setM(window.innerWidth<768);window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);
  return m;
}
const fmtD=(iso)=>!iso?"—":new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"});
const fmtDS=(iso)=>!iso?"—":new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
const fmtR=(v)=>"R$ "+Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2});
// Formata duração em minutos -> "2h 15min" / "45min" / "3d 4h"
const fmtDur=(min)=>{
  if(min==null)return null;
  if(min<1)return "menos de 1min";
  const d=Math.floor(min/1440),h=Math.floor((min%1440)/60),m=min%60;
  const p=[];if(d)p.push(d+"d");if(h)p.push(h+"h");if(m&&!d)p.push(m+"min");
  return p.join(" ")||"0min";
};

// ─── PRIORIDADE: ordena pela DATA DE VENCIMENTO do pedido ─────────────────────
// Quanto mais próxima a data de vencimento, maior a prioridade (vem primeiro).
// Por enquanto usamos prazoFinal como vencimento; quando a regra definitiva da
// data de vencimento for criada, basta trocar dataVencimento() abaixo.
const dataVencimento=(o)=>o.dataVencimento||o.prazoFinal||null;
const ordenarPorPrioridade=(arr)=>[...arr].sort((a,b)=>{
  const da=dataVencimento(a), db=dataVencimento(b);
  if(!da&&!db)return 0;
  if(!da)return 1;          // sem data vai para o fim
  if(!db)return -1;
  return new Date(da)-new Date(db); // mais cedo primeiro
});

// Normaliza um card cru do Worker para o formato que o modal/cards esperam
const normalizarCard=(o,etapa)=>({
  id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
  client:o.client||"",vendedor:o.vendedor,valor:o.valor||0,
  cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",tel:o.telefone||"",email:o.email||"",
  obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
  condicaoPagamento:o.condicaoPagamento||"",arquivoDtfsilk:o.arquivoDtfsilk||[],
  arqProgramacao:o.arqProgramacao||"",arqAmostraDigital:o.arqAmostraDigital||"",arqAmostraFisica:o.arqAmostraFisica||"",
  motivoRejAmDigital:o.motivoRejAmDigital||"",motivoRejAmFisica:o.motivoRejAmFisica||"",
  reprogramacao:o.reprogramacao||false,
  historico:o.historico||[],
  houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
  temBordado:o.temBordado!==false,dataVencimento:o.dataVencimento||null,
  prazoFinal:o.prazoFinal||null,
  etapa:o.etapa||etapa,amOk:false,sepOk:true,
  entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
  alertas:o.alertas||[],concluido:false,
  bordado:{pts:0,cores:[],arq:"",arqOk:false,amDig:[],amDigObs:"",amFis:[],amFisObs:""},
  items:(o.items||[]).map(it=>({
    id:it.id,sku:it.sku||it.nome,desc:it.nome,cor:it.tamanho,
    qty:it.quantidade,dest:it.direcionamento?it.direcionamento.toLowerCase():null,
    status:"separado",
  })),
  timeline:[{stage:o.etapa||etapa,user:"Sistema",enteredAt:o.etapaAt||o.dataEntrada,exitedAt:null,dH:null}],
  chat:[],bordadosJson:o.bordadosJson||[],arquivoBordado:o.arquivoBordado||[],
});
const hrsIn=(at)=>(Date.now()-new Date(at).getTime())/3600000;
function getSLA(o,cfg){
  const sla=cfg[o.etapa]||0;
  const hrs=hrsIn(o.etapaAt);
  const pct=sla?hrs/sla:0;
  const htd=(new Date(o.prazoFinal).getTime()-Date.now())/3600000;
  return{sla,hrs,pct,htd,st:pct>=1?"late":pct>=0.8?"risk":"ok",ft:htd<0?"late":htd<24?"risk":"ok"};
}

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
const F = {
  title: { fontFamily:"'Oswald',sans-serif", textTransform:"uppercase", letterSpacing:"0.04em" },
  body:  { fontFamily:"'Montserrat',sans-serif" },
};

// ─── EXIBIÇÃO DE ARQUIVOS (resolve fileIds do HubSpot) ────────────────────────
function ArquivosBox({fileIds,titulo,emptyText}){
  const [arquivos,setArquivos]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    if(!fileIds||!fileIds.length){setArquivos([]);return;}
    setLoading(true);
    apiFetch(`/arquivos?ids=${fileIds.join(";")}`)
      .then(r=>{if(r.success)setArquivos(r.arquivos);else setArquivos([]);})
      .catch(()=>setArquivos([]))
      .finally(()=>setLoading(false));
  },[JSON.stringify(fileIds)]);

  if(loading)return <div style={{...F.body,fontSize:12,color:C.gray400,padding:"8px 0"}}>Carregando arquivos...</div>;
  if(!arquivos||arquivos.length===0)return <div style={{...F.body,fontSize:13,color:C.gray400}}>{emptyText||"Nenhum arquivo anexado."}</div>;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {arquivos.map((a,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:C.gray50,borderRadius:7,padding:"10px 14px",border:`1px solid ${C.gray200}`}}>
          <div style={{width:32,height:32,borderRadius:6,background:C.red+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic n="download" s={16} c={C.red}/>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{...F.body,fontSize:13,fontWeight:600,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.nome}</div>
            {a.tamanho>0&&<div style={{...F.body,fontSize:11,color:C.gray400,marginTop:1}}>{(a.tamanho/1024).toFixed(0)} KB</div>}
          </div>
          {a.url
            ?<a href={a.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:5,background:C.red,color:C.white,borderRadius:6,padding:"7px 14px",...F.body,fontSize:12,fontWeight:700,cursor:"pointer"}}>
                <Ic n="download" s={13} c={C.white}/> Baixar
              </span>
            </a>
            :<span style={{...F.body,fontSize:11,color:C.gray400}}>indisponível</span>
          }
        </div>
      ))}
    </div>
  );
}

function Av({ini,size=32,bg=C.red}){
  return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,...F.title,flexShrink:0}}>{ini}</div>;
}

function Tag({label,color=C.gray600}){
  return <span style={{background:color+"18",color,border:`1px solid ${color}30`,borderRadius:3,padding:"2px 8px",fontSize:11,fontWeight:600,...F.body,display:"inline-block"}}>{label}</span>;
}

function Card({children,style={},onClick}){
  return <div onClick={onClick} style={{background:C.white,borderRadius:8,padding:18,border:`1px solid ${C.gray200}`,cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}

function SecH({children,style={}}){
  return <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:12,...style}}>{children}</div>;
}

function PageH({title,sub,bc,onRefresh,refreshing}){
  return (
    <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
      <div>
        {bc&&<div style={{...F.body,fontSize:12,color:C.gray400,marginBottom:4,display:"flex",gap:6,alignItems:"center"}}>
          SGP <Ic n="chevR" s={11} c={C.gray400}/> <span style={{color:C.gray600}}>{bc}</span>
        </div>}
        <h1 style={{...F.title,fontSize:24,fontWeight:700,color:C.black,lineHeight:1.1}}>{title}</h1>
        {sub&&<p style={{...F.body,fontSize:13,color:C.gray500,marginTop:4}}>{sub}</p>}
      </div>
      {onRefresh&&<button onClick={onRefresh} disabled={refreshing}
        style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:8,border:`1.5px solid ${C.gray200}`,background:C.white,cursor:refreshing?"wait":"pointer",...F.body,fontSize:13,fontWeight:600,color:refreshing?C.gray400:C.gray700,whiteSpace:"nowrap",flexShrink:0}}
        onMouseEnter={e=>{if(!refreshing)e.currentTarget.style.borderColor=C.red;}}
        onMouseLeave={e=>e.currentTarget.style.borderColor=C.gray200}>
        <span style={{display:"inline-block",transition:"transform 0.5s",transform:refreshing?"rotate(360deg)":"none"}}>
          <Ic n="refresh" s={15} c={refreshing?C.gray400:C.red}/>
        </span>
        {refreshing?"Atualizando...":"Atualizar"}
      </button>}
    </div>
  );
}

function SLABar({pct,st}){
  const c=st==="late"?C.red:st==="risk"?C.amber:C.green;
  return <div style={{background:C.gray200,borderRadius:2,height:4,overflow:"hidden",flex:1}}><div style={{height:"100%",width:`${Math.min(pct*100,100)}%`,background:c,borderRadius:2}}/></div>;
}

function Stat({label,value,sub,color=C.black,icon}){
  return(
    <Card style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{...F.body,fontSize:11,color:C.gray500,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
        <Ic n={icon} s={15} c={C.gray300}/>
      </div>
      <div style={{...F.title,fontSize:30,fontWeight:700,color,lineHeight:1}}>{value}</div>
      {sub&&<div style={{...F.body,fontSize:11,color:C.gray400}}>{sub}</div>}
    </Card>
  );
}

function ETag({etapa}){
  const c=STAGE_COLOR[etapa]||C.gray600;
  return <span style={{background:c+"14",color:c,borderRadius:3,padding:"3px 9px",fontSize:11,fontWeight:700,...F.body,whiteSpace:"nowrap"}}>{etapa}</span>;
}

function Btn({label,onClick,variant="primary",size="md",icon,style={}}){
  const bg={primary:C.red,secondary:C.white,success:C.green,ghost:"transparent",danger:C.red+"14"}[variant];
  const fg={primary:C.white,secondary:C.gray700,success:C.white,ghost:C.gray600,danger:C.red}[variant];
  const br={primary:"none",secondary:`1px solid ${C.gray200}`,success:"none",ghost:"none",danger:`1px solid ${C.red}30`}[variant];
  const pd={sm:"5px 12px",md:"8px 16px",lg:"11px 22px"}[size];
  const fs={sm:12,md:13,lg:14}[size];
  return(
    <button onClick={onClick}
      style={{display:"inline-flex",alignItems:"center",gap:6,background:bg,color:fg,border:br,borderRadius:6,padding:pd,fontSize:fs,fontWeight:600,cursor:"pointer",...F.body,...style}}
      onMouseEnter={e=>e.currentTarget.style.opacity="0.82"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      {icon&&<Ic n={icon} s={13} c={fg}/>}{label}
    </button>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({user,active,onNav,collapsed,onToggle}){
  const items=NAV_ITEMS.filter(n=>temAcesso(user,n.id));
  const GRUPOS=["Principal","Análise","Operações","Sistema"];
  const groups=GRUPOS.map(label=>({label,items:items.filter(n=>n.grupo===label)}));
  // Injeta o CSS da scrollbar sutil uma única vez
  useEffect(()=>{
    if(document.getElementById("sgp-scroll-style"))return;
    const st=document.createElement("style");
    st.id="sgp-scroll-style";
    st.textContent=`
      .sgp-scroll{scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .25s;}
      .sgp-scroll:hover{scrollbar-color:rgba(158,11,15,0.28) transparent;}
      .sgp-scroll::-webkit-scrollbar{width:6px;height:6px;}
      .sgp-scroll::-webkit-scrollbar-track{background:transparent;}
      .sgp-scroll::-webkit-scrollbar-thumb{background-color:transparent;border-radius:8px;border:1px solid transparent;background-clip:content-box;transition:background-color .25s;}
      .sgp-scroll:hover::-webkit-scrollbar-thumb{background-color:rgba(158,11,15,0.22);}
      .sgp-scroll::-webkit-scrollbar-thumb:hover{background-color:rgba(158,11,15,0.5);}
    `;
    document.head.appendChild(st);
  },[]);
  return(
    <div style={{width:collapsed?56:240,background:C.white,borderRight:`1px solid ${C.gray200}`,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",flexShrink:0}}>
      <div style={{padding:collapsed?"14px":"16px 20px",borderBottom:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",minHeight:56,gap:8}}>
        {!collapsed&&<div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:6,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Ic n="needle" s={14} c={C.white}/>
          </div>
          <div>
            <div style={{...F.title,fontSize:13,fontWeight:700,color:C.black,letterSpacing:"0.12em"}}>CITEROL</div>
            <div style={{...F.body,fontSize:9,color:C.gray400,letterSpacing:"0.04em",marginTop:1}}>PERSONALIZADOS</div>
          </div>
        </div>}
        <button onClick={onToggle} style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:5,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
          <Ic n={collapsed?"chevR":"chevL"} s={12} c={C.gray500}/>
        </button>
      </div>
      <div className="sgp-scroll" style={{flex:1,overflowY:"auto",padding:"6px 0"}}>
        {groups.map(g=>{
          const gi=g.items;
          if(!gi.length)return null;
          return(
            <div key={g.label} style={{marginBottom:2}}>
              {!collapsed&&<div style={{...F.body,fontSize:9,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.1em",padding:"10px 20px 4px"}}>{g.label}</div>}
              {gi.map(n=>{
                const on=active===n.id;
                return(
                  <div key={n.id} onClick={()=>onNav(n.id)}
                    style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px 0":"8px 20px",cursor:"pointer",background:on?C.red+"0e":"transparent",borderLeft:on?`2px solid ${C.red}`:"2px solid transparent",color:on?C.red:C.gray600,justifyContent:collapsed?"center":"flex-start"}}
                    onMouseEnter={e=>{if(!on)e.currentTarget.style.background=C.gray50;}}
                    onMouseLeave={e=>{if(!on)e.currentTarget.style.background="transparent";}}>
                    <Ic n={n.icon} s={15} c={on?C.red:C.gray500}/>
                    {!collapsed&&<span style={{...F.body,fontSize:13,fontWeight:on?600:400,whiteSpace:"nowrap"}}>{n.label}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {!collapsed&&<div style={{padding:"12px 16px",borderTop:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",gap:10}}>
        <Av ini={user.ini} size={30}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{...F.body,fontSize:12,fontWeight:700,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(user.nome||user.name||"").split(" ")[0]}</div>
          <div style={{...F.body,fontSize:10,color:C.gray500}}>{user.admin?"Administrador":"Operador"} · {SGP_VERSION}</div>
        </div>
      </div>}
    </div>
  );
}

function BottomNav({user,active,onNav}){
  const allItems=NAV_ITEMS.filter(n=>temAcesso(user,n.id));
  const mainItems=allItems.slice(0,4);
  const [showDrawer,setShowDrawer]=useState(false);

  const GRUPOS=["Principal","Análise","Operações","Sistema"];
  const groups=GRUPOS.map(label=>({label,items:items.filter(n=>n.grupo===label)}));

  return(
    <>
      {/* Drawer de menu completo */}
      {showDrawer&&(
        <div style={{position:"fixed",inset:0,zIndex:200}} onClick={()=>setShowDrawer(false)}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.white,borderRadius:"16px 16px 0 0",boxShadow:"0 -4px 24px rgba(0,0,0,0.15)",maxHeight:"80vh",overflow:"auto"}}
            onClick={e=>e.stopPropagation()}>
            {/* Handle */}
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}>
              <div style={{width:36,height:4,borderRadius:2,background:C.gray300}}/>
            </div>
            <div style={{padding:"4px 0 16px"}}>
              {groups.map(g=>{
                const gi=g.items;
                if(!gi.length)return null;
                return(
                  <div key={g.label}>
                    <div style={{...F.body,fontSize:10,fontWeight:700,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.1em",padding:"10px 20px 6px"}}>{g.label}</div>
                    {gi.map(n=>(
                      <div key={n.id} onClick={()=>{onNav(n.id);setShowDrawer(false);}}
                        style={{display:"flex",alignItems:"center",gap:14,padding:"11px 20px",cursor:"pointer",background:active===n.id?C.red+"0e":"transparent",borderLeft:active===n.id?`3px solid ${C.red}`:"3px solid transparent"}}
                        onMouseEnter={e=>{if(active!==n.id)e.currentTarget.style.background=C.gray50;}}
                        onMouseLeave={e=>{if(active!==n.id)e.currentTarget.style.background="transparent";}}>
                        <Ic n={n.icon} s={18} c={active===n.id?C.red:C.gray500}/>
                        <span style={{...F.body,fontSize:14,fontWeight:active===n.id?700:400,color:active===n.id?C.red:C.black}}>{n.label}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.gray200}`,display:"flex",zIndex:100}}>
        {mainItems.map(n=>(
          <div key={n.id} onClick={()=>onNav(n.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"9px 4px 8px",cursor:"pointer",color:active===n.id?C.red:C.gray500}}>
            <Ic n={n.icon} s={20} c={active===n.id?C.red:C.gray400}/>
            <span style={{...F.body,fontSize:9,marginTop:3,fontWeight:active===n.id?700:400,textAlign:"center",lineHeight:1.1}}>{n.label.split(" ")[0]}</span>
          </div>
        ))}
        {/* Botão Menu */}
        <div onClick={()=>setShowDrawer(true)}
          style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"9px 4px 8px",cursor:"pointer",color:showDrawer?C.red:C.gray500}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={showDrawer?C.red:C.gray400} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
          <span style={{...F.body,fontSize:9,marginTop:3,fontWeight:showDrawer?700:400,textAlign:"center",lineHeight:1.1}}>Menu</span>
        </div>
      </div>
    </>
  );
}

function Topbar({user,title,notifs,onBell,onLogout,isMobile}){
  const unread=notifs.filter(n=>!n.read&&n.toUid===user.id).length;
  return(
    <div style={{height:56,background:C.white,borderBottom:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0}}>
      <div style={{...F.title,fontSize:isMobile?13:15,fontWeight:600,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title.toUpperCase()}</div>
      <div style={{display:"flex",alignItems:"center",gap:16,flexShrink:0}}>
        <div onClick={onBell} style={{position:"relative",cursor:"pointer",display:"flex",alignItems:"center"}}>
          <Ic n="bell" s={19} c={C.gray500}/>
          {unread>0&&<span style={{position:"absolute",top:-5,right:-5,background:C.red,color:C.white,borderRadius:"50%",width:14,height:14,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",...F.body}}>{unread}</span>}
        </div>
        <Av ini={user.ini} size={30}/>
        {!isMobile&&<button onClick={onLogout} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center"}}><Ic n="logout" s={16} c={C.gray400}/></button>}
      </div>
    </div>
  );
}

// ─── CHAT ────────────────────────────────────────────────────────────────────
function Chat({order,me,onSend}){
  const[msg,setMsg]=useState("");const[showM,setShowM]=useState(false);const[mq,setMq]=useState("");const eRef=useRef(null);
  useEffect(()=>eRef.current?.scrollIntoView({behavior:"smooth"}),[order.chat]);
  const hc=v=>{setMsg(v);const at=v.lastIndexOf("@");if(at!==-1&&v.slice(at+1).match(/^\w*$/)){setShowM(true);setMq(v.slice(at+1).toLowerCase());}else setShowM(false);};
  const ins=u=>{const at=msg.lastIndexOf("@");setMsg(msg.slice(0,at)+"@"+u.name.split(" ")[0]+" ");setShowM(false);};
  const fu=USERS.filter(u=>u.id!==me.id&&(mq===""||u.name.toLowerCase().includes(mq)));
  const send=()=>{if(!msg.trim())return;const mn=USERS.filter(u=>msg.includes("@"+u.name.split(" ")[0])).map(u=>u.id);onSend(order.id,msg,mn);setMsg("");};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {order.chat.length===0&&<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",marginTop:20}}>Nenhuma mensagem ainda.</div>}
        {order.chat.map((m,i)=>{const u=USERS.find(x=>x.id===m.uid);const isMe=u?.id===me.id;return(
          <div key={i} style={{display:"flex",gap:8}}>
            <Av ini={u?.ini||"?"} size={28} bg={isMe?C.red:C.gray700}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"baseline",flexWrap:"wrap"}}>
                <span style={{...F.body,fontSize:12,fontWeight:700,color:C.black}}>{u?.name}</span>
                <span style={{...F.body,fontSize:10,color:C.gray400}}>{m.time}</span>
              </div>
              <div style={{...F.body,fontSize:13,color:C.gray700,marginTop:4,lineHeight:1.6,background:C.gray50,borderRadius:6,padding:"8px 12px",border:`1px solid ${C.gray200}`}}>
                {m.text.split(/(@\w+)/).map((p,j)=>p.startsWith("@")?<span key={j} style={{color:C.red,fontWeight:700}}>{p}</span>:p)}
              </div>
            </div>
          </div>
        );})}
        <div ref={eRef}/>
      </div>
      <div style={{padding:"10px 16px",borderTop:`1px solid ${C.gray200}`,position:"relative"}}>
        {showM&&fu.length>0&&<div style={{position:"absolute",bottom:70,left:16,right:16,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",zIndex:10}}>
          {fu.slice(0,5).map(u=>(
            <div key={u.id} onClick={()=>ins(u)} style={{padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}
              onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
              onMouseLeave={e=>e.currentTarget.style.background=C.white}>
              <Av ini={u.ini} size={22}/><span style={{...F.body,fontSize:13,fontWeight:600}}>{u.name}</span><span style={{...F.body,fontSize:11,color:C.gray400}}>{u.email||""}</span>
            </div>
          ))}
        </div>}
        <div style={{display:"flex",gap:8}}>
          <input value={msg} onChange={e=>hc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Mensagem... @ para mencionar"
            style={{flex:1,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",fontSize:13,outline:"none",...F.body}}/>
          <button onClick={send} style={{background:C.red,color:C.white,border:"none",borderRadius:6,padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center"}}>
            <Ic n="send" s={15} c={C.white}/>
          </button>
        </div>
        <div style={{...F.body,fontSize:10,color:C.gray400,marginTop:5}}>Use @ para mencionar um usuário — Enter para enviar</div>
      </div>
    </div>
  );
}

// ─── ABA ALTERAÇÃO DE FORMULÁRIO ─────────────────────────────────────────────
function AlteracaoFormTab({order,onAction,me}){
  const [novaEtapa,setNovaEtapa]=useState("");
  const [motivo,setMotivo]=useState("");
  const [enviando,setEnviando]=useState(false);
  const [ok,setOk]=useState(false);

  // Bloqueio: não pode alterar se já está em produção de bordado
  const bloqueado=order.etapa==="Bordado Interno"||order.etapa==="Bordado Externo"||order.etapa==="Bordado Interno e Externo";

  // Etapas para as quais o pedido pode voltar
  const etapasDestino=[
    "Programação","Amostra Digital","Aprovação de Amostra Digital",
    "Amostra Física","Aprovação de Amostra Física","Liberado para bordar",
  ];

  const enviar=async()=>{
    if(!novaEtapa){alert("Selecione para qual etapa o pedido deve voltar.");return;}
    if(!motivo.trim()){alert("Informe o motivo da alteração.");return;}
    setEnviando(true);
    try{
      await onAction(order.id,"alteracao_formulario",{novaEtapa,motivo:motivo.trim()});
      setOk(true);
    }catch(e){
      alert("Erro ao registrar alteração: "+e.message);
    }finally{setEnviando(false);}
  };

  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      {/* Histórico de alteração (se já houve) */}
      {order.houveAlteracaoForm&&(
        <div style={{background:"#f97316"+"12",border:`1.5px solid #f97316`,borderRadius:8,padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <Ic n="warn" s={16} c="#f97316"/>
            <span style={{...F.title,fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:"0.06em"}}>JÁ HOUVE ALTERAÇÃO DE FORMULÁRIO</span>
          </div>
          <div style={{...F.body,fontSize:10,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo registrado</div>
          <div style={{...F.body,fontSize:13,color:"#7c2d12"}}>{order.motivoAlteracaoForm||"—"}</div>
        </div>
      )}

      {ok?(
        <div style={{padding:30,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:C.green+"14",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="check" s={24} c={C.green}/></div>
          <div style={{...F.title,fontSize:16,fontWeight:700,color:C.green}}>ALTERAÇÃO REGISTRADA</div>
          <div style={{...F.body,fontSize:13,color:C.gray500,textAlign:"center",maxWidth:380}}>O pedido foi retornado para a etapa solicitada e a alteração ficou registrada na timeline.</div>
        </div>
      ):bloqueado?(
        <div style={{background:C.red+"0e",border:`1px solid ${C.red}30`,borderRadius:8,padding:"16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <Ic n="close" s={16} c={C.red}/>
            <span style={{...F.title,fontSize:13,fontWeight:700,color:C.red}}>ALTERAÇÃO NÃO PERMITIDA</span>
          </div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>Este pedido já está em produção de bordado ({order.etapa}). Não é possível solicitar alteração de formulário nesta fase.</div>
        </div>
      ):(
        <>
          <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
            <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>SOLICITAR ALTERAÇÃO DE FORMULÁRIO</div>
            <div style={{...F.body,fontSize:13,color:C.gray600}}>Use quando o cliente solicitar mudança no pedido. Isso retorna o pedido para a etapa escolhida e gera registro (causa atraso no processo).</div>
          </div>

          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Voltar o pedido para a etapa</label>
            <select value={novaEtapa} onChange={e=>setNovaEtapa(e.target.value)}
              style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:C.white,cursor:"pointer"}}>
              <option value="">Selecione a etapa...</option>
              {etapasDestino.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>

          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Motivo da alteração <span style={{color:C.red}}>*</span></label>
            <textarea value={motivo} onChange={e=>setMotivo(e.target.value)} rows={4} placeholder="Descreva o que o cliente solicitou alterar..."
              style={{width:"100%",...F.body,fontSize:13,border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
          </div>

          <button onClick={enviar} disabled={enviando}
            style={{background:enviando?"#ccc":"#f97316",color:C.white,border:"none",borderRadius:8,padding:"12px 24px",cursor:enviando?"wait":"pointer",...F.body,fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
            <Ic n="warn" s={15} c={C.white}/> {enviando?"Registrando...":"Registrar alteração e voltar etapa"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── ABA ALTERAÇÃO DE FORMULÁRIO (fim) ───────────────────────────────────────
function Timeline({order}){
  // Usa o histórico real vindo do HubSpot (registra todas as mudanças,
  // inclusive reversões manuais). Fallback para o timeline local antigo.
  const hist=(order.historico&&order.historico.length>0)
    ? order.historico
    : (order.timeline||[]).map(t=>({stage:t.stage,who:t.user,enteredAt:t.enteredAt,exitedAt:t.exitedAt,durMin:t.dH!=null?Math.round(t.dH*60):null,origem:""}));

  if(hist.length===0)return <div style={{padding:40,textAlign:"center",...F.body,color:C.gray400,fontSize:13}}>Nenhum histórico de etapas registrado.</div>;

  return(
    <div style={{padding:20}}>
      {hist.map((t,i)=>{
        const act=i===hist.length-1; // última = etapa atual (em andamento)
        return(
        <div key={i} style={{display:"flex",gap:14,marginBottom:22,position:"relative"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:act?C.red:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,zIndex:1}}>
              <Ic n={act?"up":"check"} s={12} c={C.white}/>
            </div>
            {i<hist.length-1&&<div style={{width:1,flex:1,background:C.gray200,marginTop:4,minHeight:16}}/>}
          </div>
          <div style={{flex:1,paddingTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,alignItems:"center"}}>
              <span style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{t.stage}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {t.origem&&<Tag label={t.origem} color={t.origem==="Bordado"?C.purple:C.teal}/>}
                {act&&<Tag label="Em andamento" color={C.red}/>}
              </div>
            </div>
            <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>Por: {t.who||"Sistema"}</div>
            <div style={{...F.body,fontSize:11,color:C.gray600,marginTop:3}}>
              Entrada: {fmtD(t.enteredAt)}{t.exitedAt&&<> · Saída: {fmtD(t.exitedAt)}</>}
            </div>
            {t.durMin!=null&&<div style={{...F.body,fontSize:11,marginTop:2}}>Permaneceu: <strong style={{color:t.durMin>1440?C.red:C.green}}>{fmtDur(t.durMin)}</strong></div>}
            {t.durMin==null&&act&&<div style={{...F.body,fontSize:11,marginTop:2,color:C.amber,fontWeight:600}}>Em andamento</div>}
          </div>
        </div>
      );})}
    </div>
  );
}


// ─── ABA DE EXECUÇÃO POR PERFIL ──────────────────────────────────────────────
function AcaoTab({order,me,uploadFile,setUploadFile,uploadName,setUploadName,obsText,setObsText,actionDone,setActionDone,actionMsg,setActionMsg,itemSel,itemDest,nSel,allDestDefined,skus,toggleItemSel,selAllItems,setDestSel,setDestAll,setDestOne,onAction,isMobile}){
  const etapa=order.etapa;
  const[uploading,setUploading]=useState(false);

  // Pedido já concluído — apenas consulta, sem ação
  if(etapa==="Finalizado"){
    return(
      <div style={{padding:40,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:C.green+"14",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic n="check" s={26} c={C.green}/>
        </div>
        <div style={{...F.title,fontSize:18,fontWeight:700,color:C.green,textAlign:"center"}}>PEDIDO FINALIZADO</div>
        <div style={{...F.body,fontSize:13,color:C.gray500,textAlign:"center",maxWidth:380}}>Este pedido já foi concluído. Consulte o histórico completo nas abas SLA / Prazo e Timeline.</div>
      </div>
    );
  }

  // Ação já confirmada
  if(actionDone){
    const aguardando=actionMsg&&actionMsg.includes("Aguardando");
    return(
      <div style={{padding:40,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:(aguardando?C.amber:C.green)+"14",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Ic n={aguardando?"clock":"check"} s={26} c={aguardando?C.amber:C.green}/>
        </div>
        <div style={{...F.title,fontSize:18,fontWeight:700,color:aguardando?C.amber:C.green,textAlign:"center"}}>{aguardando?"LADO CONCLUÍDO":"AÇÃO CONFIRMADA"}</div>
        <div style={{...F.body,fontSize:13,color:C.gray500,textAlign:"center",maxWidth:380}}>{actionMsg||"O pedido foi movimentado com sucesso."}</div>
      </div>
    );
  }

  // ── DIRECIONADOR ────────────────────────────────────────────────────────────
  if(etapa==="Direcionamento"){
    const internos=order.items.filter(it=>itemDest[it.sku]==="interno").length;
    const externos=order.items.filter(it=>itemDest[it.sku]==="externo").length;
    const pendentes=order.items.filter(it=>!itemDest[it.sku]).length;
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:8}}>DIRECIONAR ITENS PARA BORDADO</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>Defina para cada SKU se o bordado será executado internamente ou por fornecedor externo.</div>
        </div>

        {/* Barra de atalhos */}
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <input type="checkbox" checked={nSel===skus.length&&skus.length>0} onChange={selAllItems}
              style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
            <span style={{...F.body,fontSize:12,color:C.gray600,fontWeight:600}}>
              {nSel===0?"Selecionar todos":nSel===skus.length?"Todos selecionados":`${nSel} selecionado${nSel>1?"s":""}`}
            </span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setDestSel("interno")} style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
              <Ic n="arrow" s={12} c={C.white}/> Selecionados → Interno
            </button>
            <button onClick={()=>setDestSel("externo")} style={{background:C.purple,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
              <Ic n="box" s={12} c={C.white}/> Selecionados → Externo
            </button>
            <button onClick={()=>setDestAll("interno")} style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer"}}>Todos → Interno</button>
            <button onClick={()=>setDestAll("externo")} style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",...F.body,fontSize:12,cursor:"pointer"}}>Todos → Externo</button>
          </div>
        </div>

        {/* Tabela de itens */}
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:420}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["","SKU","Descrição","TAM","Qtd","Destino"].map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",...F.body,fontSize:11,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{hd}</th>)}
            </tr></thead>
            <tbody>{order.items.map((it,i)=>{
              const dest=itemDest[it.id||i];
              const sel=itemSel[it.id||i]||false;
              return(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`,background:sel?C.red+"06":"transparent"}}>
                  <td style={{padding:"9px 10px"}}>
                    <input type="checkbox" checked={sel} onChange={()=>toggleItemSel(it.id||i)}
                      style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
                  </td>
                  <td style={{padding:"9px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700}}>{it.sku}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray700}}>{it.desc}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray500,fontSize:12}}>{it.cor}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body}}>{it.qty}</td>
                  <td style={{padding:"9px 10px"}}>
                    <div style={{display:"flex",gap:5}}>
                      <button onClick={()=>setDestOne(it.id||i,"interno")}
                        style={{background:dest==="interno"?C.green:C.white,color:dest==="interno"?C.white:C.gray700,border:`1.5px solid ${dest==="interno"?C.green:C.gray300}`,borderRadius:5,padding:"4px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:600}}>
                        Interno
                      </button>
                      <button onClick={()=>setDestOne(it.id||i,"externo")}
                        style={{background:dest==="externo"?C.purple:C.white,color:dest==="externo"?C.white:C.gray700,border:`1.5px solid ${dest==="externo"?C.purple:C.gray300}`,borderRadius:5,padding:"4px 12px",...F.body,fontSize:12,cursor:"pointer",fontWeight:600}}>
                        Externo
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>

        {/* Resumo + confirmar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,paddingTop:8,borderTop:`1px solid ${C.gray200}`}}>
          <div style={{display:"flex",gap:16,...F.body,fontSize:13}}>
            <span>Interno: <strong style={{color:C.green}}>{internos}</strong></span>
            <span>Externo: <strong style={{color:C.purple}}>{externos}</strong></span>
            {pendentes>0&&<span style={{color:C.amber}}>Pendente: <strong>{pendentes}</strong></span>}
          </div>
          <button onClick={()=>{if(!allDestDefined){alert("Defina o destino de todos os itens.");return;}onAction(order.id,"direcionamento",{
              destinos: Object.fromEntries(
                order.items.map((it,i)=>[it.id||it.sku,(itemDest[it.id||i]||"")])
              )
            });setActionDone(true);}}
            disabled={!allDestDefined}
            style={{background:allDestDefined?C.green:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"10px 22px",cursor:allDestDefined?"pointer":"not-allowed",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:7}}>
            <Ic n="check" s={14} c={C.white}/> Confirmar direcionamento
          </button>
        </div>
        {!allDestDefined&&<div style={{...F.body,fontSize:11,color:C.amber,display:"flex",alignItems:"center",gap:4}}>
          <Ic n="warn" s={11} c={C.amber}/> Defina o destino de todos os itens antes de confirmar.
        </div>}
      </div>
    );
  }

  // ── UPLOAD DE ARQUIVO (Programador, Amostra Digital, Amostra Física) ────────
  const UPLOAD_ETAPAS={
    "Programação":    {title:"Programação de Bordado",  btn:"Confirmar programação",   hint:"Anexe o arquivo .EMB ou similar com a programação de pontos.",  accept:".emb,.dst,.pes,.jef"},
    "Amostra Digital":{title:"Enviar Amostra Digital",  btn:"Enviar amostra digital",   hint:"Anexe a imagem da amostra digital para aprovação do pós-venda.", accept:"image/*"},
    "Amostra Física": {title:"Confirmar Amostra Física",btn:"Confirmar amostra pronta", hint:"Anexe a foto da amostra física. O pós-venda será notificado.",    accept:"image/*"},
  };
  if(UPLOAD_ETAPAS[etapa]){
    const config=UPLOAD_ETAPAS[etapa];
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        {order.reprogramacao&&(()=>{
          const motivo=etapa==="Amostra Digital"?order.motivoRejAmDigital:etapa==="Amostra Física"?order.motivoRejAmFisica:"";
          return <div style={{background:"#f97316"+"12",border:`1.5px solid #f97316`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:30,height:30,borderRadius:7,background:"#f97316",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,...F.title,fontSize:16,color:C.white}}>↻</div>
            <div style={{flex:1}}>
              <div style={{...F.title,fontSize:12,fontWeight:700,color:"#c2410c",letterSpacing:"0.06em"}}>REPROGRAMAÇÃO</div>
              <div style={{...F.body,fontSize:12,color:"#9a3412",marginTop:1}}>Este item foi reprovado e voltou para esta etapa. Anexe o novo arquivo — o anterior foi removido.</div>
              {motivo&&<div style={{marginTop:8,padding:"8px 10px",background:C.white,borderRadius:6,border:"1px solid #fed7aa"}}>
                <div style={{...F.body,fontSize:10,fontWeight:700,color:"#c2410c",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo da reprovação</div>
                <div style={{...F.body,fontSize:13,color:"#7c2d12"}}>{motivo}</div>
              </div>}
            </div>
          </div>;
        })()}
        <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"12px 16px"}}>
          <div style={{...F.title,fontSize:11,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>{config.title.toUpperCase()}</div>
          <div style={{...F.body,fontSize:13,color:C.gray600}}>{config.hint}</div>
        </div>
        {/* Arquivos anexados pelo vendedor — referência para a execução */}
        {(order.arquivoBordado&&order.arquivoBordado.length>0)?<div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Arquivos do vendedor (referência)</label>
          <ArquivosBox fileIds={order.arquivoBordado}/>
        </div>:null}
        {/* Upload */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Arquivo</label>
          <div style={{border:`2px dashed ${uploadFile?C.green:C.gray200}`,borderRadius:8,padding:"28px 20px",textAlign:"center",background:uploadFile?C.green+"06":C.gray50,cursor:"pointer",transition:"all 0.2s"}}
            onClick={()=>document.getElementById("upload-input").click()}
            onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=C.red;}}
            onDragLeave={e=>e.currentTarget.style.borderColor=uploadFile?C.green:C.gray200}
            onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){setUploadFile(f);setUploadName(f.name);}e.currentTarget.style.borderColor=C.green;}}>
            <input id="upload-input" type="file" accept={config.accept} style={{display:"none"}}
              onChange={e=>{const f=e.target.files[0];if(f){setUploadFile(f);setUploadName(f.name);}}}/>
            {uploadFile
              ?<div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <Ic n="check" s={20} c={C.green}/>
                  <div style={{textAlign:"left"}}>
                    <div style={{...F.body,fontWeight:700,fontSize:14,color:C.green}}>{uploadName}</div>
                    <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:2}}>Arquivo selecionado · clique para trocar</div>
                  </div>
                </div>
              :<div>
                  <Ic n="download" s={28} c={C.gray300} style={{margin:"0 auto 8px",display:"block"}}/>
                  <div style={{...F.body,fontSize:13,color:C.gray500}}>Clique ou arraste o arquivo aqui</div>
                  <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>Formatos aceitos: {config.accept}</div>
                </div>
            }
          </div>
        </div>
        {/* Observação */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações (opcional)</label>
          <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={3} placeholder="Informações relevantes sobre este arquivo..."
            style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        <button onClick={async()=>{
            if(!uploadFile){alert("Anexe um arquivo antes de confirmar.");return;}
            setUploading(true);
            try{
              // Converte o arquivo em base64
              const base64=await new Promise((res,rej)=>{
                const r=new FileReader();
                r.onload=()=>res(r.result.split(",")[1]);
                r.onerror=rej;
                r.readAsDataURL(uploadFile);
              });
              const m=await onAction(order.id,"upload",{
                arquivo:uploadName,obs:obsText,
                fileBase64:base64,fileName:uploadName,
                propriedade:ETAPA_PROPRIEDADE[etapa],
              });
              setActionMsg(m||"");setActionDone(true);
            }catch(e){alert("Erro no upload: "+e.message);}
            finally{setUploading(false);}
          }}
          disabled={uploading}
          style={{background:uploading?"#ccc":uploadFile?C.red:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"11px 24px",cursor:uploadFile&&!uploading?"pointer":"not-allowed",...F.body,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
          <Ic n="send" s={15} c={C.white}/> {uploading?"Enviando...":config.btn}
        </button>
      </div>
    );
  }

  // ── PÓS-VENDA / CS — Aprovação de amostra ─────────────────────────────────
  if(etapa==="Aprovação de Amostra Digital"||etapa==="Aprovação de Amostra Física"){
    const ehDigital=etapa==="Aprovação de Amostra Digital";
    const tituloEtapa=ehDigital?"APROVAÇÃO DE AMOSTRA DIGITAL":"APROVAÇÃO DE AMOSTRA FÍSICA";
    const voltaPara=ehDigital?"Amostra Digital":"Amostra Física";
    // Arquivo anexado pelo analista (fileId guardado na propriedade da etapa)
    const fileIdArquivo=ehDigital?order.arqAmostraDigital:order.arqAmostraFisica;
    const fileIds=fileIdArquivo?[fileIdArquivo]:[];
    return(
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:C.amber+"0e",border:`1px solid ${C.amber}40`,borderRadius:8,padding:"14px 16px"}}>
          <div style={{...F.title,fontSize:12,fontWeight:700,color:C.amber,letterSpacing:"0.1em",marginBottom:4}}>{tituloEtapa}</div>
          <div style={{...F.body,fontSize:13,color:C.gray700}}>{ehDigital
            ?"O analista anexou a amostra digital. Veja o arquivo abaixo e, após contato com o cliente, registre a decisão."
            :"A amostra física está pronta. Veja o arquivo abaixo e, após contato com o cliente, registre a decisão."}</div>
        </div>
        {/* Arquivo da amostra anexado pelo analista */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>{ehDigital?"Amostra digital anexada":"Amostra física anexada"}</label>
          <ArquivosBox fileIds={fileIds} emptyText="Nenhum arquivo de amostra anexado ainda."/>
        </div>
        {/* Observação */}
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações do cliente (opcional)</label>
          <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={3} placeholder="Ex: cliente aprovou com ajuste no tamanho da fonte..."
            style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
        </div>
        {/* Botões de decisão */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button onClick={async()=>{try{const m=await onAction(order.id,"aprovar_amostra",{obs:obsText});setActionMsg(m||"");setActionDone(true);}catch(e){alert("Erro: "+e.message);}}}
            style={{flex:1,minWidth:140,background:C.green,color:C.white,border:"none",borderRadius:8,padding:"14px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic n="check" s={16} c={C.white}/> Amostra Aprovada
          </button>
          <button onClick={async()=>{try{const m=await onAction(order.id,"reprovar_amostra",{obs:obsText});setActionMsg(m||"");setActionDone(true);}catch(e){alert("Erro: "+e.message);}}}
            style={{flex:1,minWidth:140,background:C.white,color:C.red,border:`2px solid ${C.red}`,borderRadius:8,padding:"14px",...F.body,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic n="close" s={16} c={C.red}/> Reprovar — Refazer
          </button>
        </div>
        <div style={{...F.body,fontSize:11,color:C.gray400,display:"flex",alignItems:"center",gap:4}}>
          <Ic n="warn" s={11} c={C.gray300}/> Reprovar retorna o pedido para a etapa de {voltaPara} (reprogramação) e remove o arquivo anterior.
        </div>
      </div>
    );
  }

  // ── MOVIMENTAÇÃO SIMPLES (Bordado Interno, Externo, Expedição, Faturamento) ─
  const moveConfig={
    "Bordado Interno":          {title:"BORDADO CONCLUÍDO",  sub:"Confirme que o bordado interno foi executado e as peças estão prontas.",        btn:"Confirmar bordado concluído", icon:"check",  color:C.green,  next:"Expedição"},
    "Bordado Externo":          {title:"RETORNO DO EXTERNO", sub:"Confirme o recebimento das peças bordadas pelo fornecedor externo.",            btn:"Confirmar retorno das peças", icon:"inbox",  color:C.purple, next:"Expedição"},
    "Bordado Interno e Externo":{title:"BORDADO CONCLUÍDO",  sub:"Confirme a execução do bordado interno e o retorno do externo.",                btn:"Confirmar bordado concluído", icon:"check",  color:C.green,  next:"Expedição"},
    "Expedição":                {title:"PEDIDO EMBALADO",    sub:"Confirme que o pedido foi embalado e está pronto para faturamento.",            btn:"Enviar para faturamento",     icon:"box",    color:C.teal,   next:"Faturamento"},
    "Faturamento":              {title:"FATURAR PEDIDO",     sub:"Confirme que o pedido foi faturado e o processo de pós-venda está encerrado.",  btn:"Confirmar faturamento",       icon:"dollar", color:C.green,  next:"Concluído"},
  }[etapa]||{title:"MOVIMENTAR PEDIDO",sub:"Confirme a execução desta etapa para avançar o pedido.",btn:"Confirmar e avançar",icon:"arrow",color:C.red,next:""};

  return(
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"14px 16px"}}>
        <div style={{...F.title,fontSize:12,fontWeight:700,color:C.gray500,letterSpacing:"0.1em",marginBottom:4}}>{moveConfig.title}</div>
        <div style={{...F.body,fontSize:13,color:C.gray600}}>{moveConfig.sub}</div>
      </div>
      {/* Info do pedido */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        {[["Pedido",order.id],["Cliente",order.client],["Total de peças",String(order.items.reduce((s,i)=>s+i.qty,0))],["Valor",fmtR(order.valor)]].map(([k,v])=>(
          <div key={k} style={{background:C.gray50,borderRadius:6,padding:"10px 12px",border:`1px solid ${C.gray200}`}}>
            <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
            <div style={{...F.body,fontSize:13,fontWeight:600,color:C.black}}>{v}</div>
          </div>
        ))}
      </div>
      {/* Itens a executar nesta etapa */}
      {order.items&&order.items.length>0&&(
        <div>
          <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Itens para {etapa==="Bordado Externo"?"bordado externo":"bordado"} ({order.items.length})</label>
          <div style={{overflowX:"auto",border:`1px solid ${C.gray200}`,borderRadius:8}}>
            <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:380}}>
              <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
                {["SKU","Descrição","TAM","Qtd",etapa.includes("e Externo")||etapa==="Bordado Interno e Externo"?"Destino":null].filter(Boolean).map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",fontSize:11,color:C.gray500,fontWeight:700,...F.body,textTransform:"uppercase"}}>{hd}</th>)}
              </tr></thead>
              <tbody>{order.items.map((it,i)=>(
                <tr key={it.id||i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                  <td style={{padding:"8px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700}}>{it.sku}</td>
                  <td style={{padding:"8px 10px",...F.body,color:C.gray700}}>{it.desc}</td>
                  <td style={{padding:"8px 10px",...F.body,color:C.gray500,fontSize:12}}>{it.cor}</td>
                  <td style={{padding:"8px 10px",fontWeight:700,...F.body}}>{it.qty}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
      {/* Observação */}
      <div>
        <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Observações (opcional)</label>
        <textarea value={obsText} onChange={e=>setObsText(e.target.value)} rows={2} placeholder="Alguma observação relevante..."
          style={{width:"100%",...F.body,fontSize:13,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
      </div>
      {moveConfig.next&&<div style={{...F.body,fontSize:12,color:C.gray400,display:"flex",alignItems:"center",gap:4}}>
        <Ic n="arrow" s={12} c={C.gray300}/> Próxima etapa: <strong style={{color:C.gray600,marginLeft:2}}>{moveConfig.next}</strong>
      </div>}
      <button onClick={async()=>{
          try{ const msg=await onAction(order.id,"mover",{obs:obsText}); setActionMsg(msg||""); setActionDone(true); }
          catch(e){ alert("Erro ao processar: "+e.message); }
        }}
        style={{background:moveConfig.color,color:C.white,border:"none",borderRadius:8,padding:"12px 28px",cursor:"pointer",...F.body,fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start"}}>
        <Ic n={moveConfig.icon} s={16} c={C.white}/> {moveConfig.btn}
      </button>
    </div>
  );
}

// ─── ORDER MODAL ─────────────────────────────────────────────────────────────
function OrderModal({order,me,onClose,onSendChat,onAction,isMobile,slaCfg}){
  const ETAPAS_COM_ACAO=["Direcionamento","Programação","Amostra Digital","Amostra Física","Aprovação de Amostra Digital","Aprovação de Amostra Física","Bordado Interno","Bordado Externo","Bordado Interno e Externo","Expedição","Faturamento"];
  const defaultTab=ETAPAS_COM_ACAO.includes(order.etapa)?"acao":"info";
  const[tab,setTab]=useState(defaultTab);
  const[uploadFile,setUploadFile]=useState(null);
  const[uploadName,setUploadName]=useState("");
  const[obsText,setObsText]=useState("");
  const[actionDone,setActionDone]=useState(false);
  const[actionMsg,setActionMsg]=useState("");
  // Direcionamento local state
  const skus=order.items.map(it=>it.sku);
  const itemKeys=order.items.map((it,i)=>it.id||i);
  const[itemSel,setItemSel]=useState({});
  const[itemDest,setItemDest]=useState(()=>{const m={};order.items.forEach((it,i)=>{if(it.dest)m[it.id||i]=it.dest;});return m;});
  const nSel=skus.filter(s=>itemSel[s]).length;
  const allDestDefined=order.items.every((it,i)=>itemDest[it.id||i]);
  const toggleItemSel=(key)=>setItemSel(p=>({...p,[key]:!p[key]}));
  const selAllItems=()=>{const allOn=itemKeys.every(k=>itemSel[k]);const n={};itemKeys.forEach(k=>n[k]=!allOn);setItemSel(n);};
  const setDestSel=(dest)=>{const selKeys=itemKeys.filter(k=>itemSel[k]);if(!selKeys.length){alert("Selecione ao menos um item.");return;}setItemDest(p=>{const n={...p};selKeys.forEach(k=>n[k]=dest);return n;});};
  const setDestAll=(dest)=>{const n={};itemKeys.forEach(k=>n[k]=dest);setItemDest(n);};
  const setDestOne=(key,dest)=>setItemDest(p=>({...p,[key]:dest}));
  const total=order.items.reduce((s,i)=>s+i.qty,0);
  const sla=getSLA(order,slaCfg);
  // A aba Executar aparece quando a etapa atual do pedido tem uma ação possível
  const hasAction=ETAPAS_COM_ACAO.includes(order.etapa);
  const TABS=[
    {id:"info",l:"Negócio"},
    {id:"sla",l:"SLA / Prazo"},
    {id:"bordado",l:"Bordado"},
    {id:"itens",l:"Peças"},
    {id:"tl",l:"Timeline"},
    {id:"alteracao",l:order.houveAlteracaoForm?"⚠ Alteração de Formulário":"Alteração de Formulário"},
    {id:"chat",l:"Conversa"},
    ...(hasAction?[{id:"acao",l:"▶ Executar"}]:[]),
  ];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?0:16}}>
      <div style={{background:C.white,borderRadius:isMobile?0:10,width:"100%",maxWidth:900,maxHeight:isMobile?"100dvh":"92vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        {/* Header */}
        <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexShrink:0}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{...F.title,fontSize:17,fontWeight:700,color:C.black}}>{order.id}</span>
              <ETag etapa={order.etapa}/>
              {order.houveAlteracaoForm&&<Tag label="⚠ Já houve alteração de formulário" color="#b45309"/>}
              {order.temBordado===false&&<Tag label="Sem bordado" color={C.gray600}/>}
              {(sla.st!=="ok"||sla.ft!=="ok")&&<Tag label={sla.st==="late"||sla.ft==="late"?"Prazo vencido":"Em risco"} color={sla.st==="late"||sla.ft==="late"?C.red:C.amber}/>}
            </div>
            <div style={{...F.body,fontSize:13,color:C.gray600,marginTop:3,fontWeight:600}}>{order.client}</div>
            <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:2}}>{order.vendedor} · {total} peças · {fmtR(order.valor)}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic n="close" s={18} c={C.gray400}/></button>
        </div>
        {order.alertas.length>0&&<div style={{padding:"8px 20px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:`1px solid ${C.gray200}`,background:"#fffbeb",flexShrink:0}}>
          {order.alertas.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,...F.body,fontSize:12,color:"#92400e",fontWeight:600}}><Ic n="warn" s={13} c={C.amber}/>{a}</div>)}
        </div>}
        {/* Tabs */}
        <div className="sgp-scroll" style={{display:"flex",borderBottom:`1px solid ${C.gray200}`,padding:"0 20px",overflowX:"auto",gap:2,flexShrink:0}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{background:"none",border:"none",padding:"11px 12px",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?C.red:C.gray500,borderBottom:tab===t.id?`2px solid ${C.red}`:"2px solid transparent",whiteSpace:"nowrap",...F.body}}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="sgp-scroll" style={{flex:1,overflow:"auto",minHeight:0}}>
          {/* NEGÓCIO */}
          {tab==="info"&&<div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
              {[["Cliente",order.client],["CNPJ",order.cnpj],["Razão Social",order.razaoSocial],["Vendedor",order.vendedor],["Telefone",order.tel],["E-mail",order.email],["Valor",fmtR(order.valor)],["Condição de Pgto",order.condicaoPagamento],["Prazo Final",fmtD(order.prazoFinal)],["Entrada",fmtD(order.entradaAt)]].map(([k,v])=>(
                <div key={k} style={{background:C.gray50,borderRadius:6,padding:"10px 12px",border:`1px solid ${C.gray200}`}}>
                  <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
                  <div style={{...F.body,fontSize:13,fontWeight:600,color:C.black,wordBreak:"break-word"}}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Observações</div>
              <div style={{background:C.gray50,borderRadius:6,padding:"12px 14px",...F.body,fontSize:13,color:C.gray700,lineHeight:1.6,border:`1px solid ${C.gray200}`}}>{order.obs||"—"}</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[["AMOSTRA",order.amOk,"Aprovada","Pendente"],["SEPARAÇÃO",order.sepOk,"Completa","Pendente"]].map(([lbl,ok,y,n])=>(
                <div key={lbl} style={{flex:1,minWidth:140,background:ok?C.green+"12":C.amber+"12",border:`1px solid ${ok?C.green:C.amber}30`,borderRadius:6,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <Ic n={ok?"check":"clock"} s={16} c={ok?C.green:C.amber}/>
                  <div>
                    <div style={{...F.body,fontSize:10,fontWeight:700,color:ok?C.green:C.amber,textTransform:"uppercase",letterSpacing:"0.06em"}}>{lbl}</div>
                    <div style={{...F.body,fontSize:12,color:C.gray600,marginTop:1}}>{ok?y:n}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>}
          {/* SLA */}
          {tab==="sla"&&<div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
              {[["SLA desta Etapa",sla.st,[`${sla.hrs.toFixed(0)}h`,`/ ${sla.sla}h`],sla.st==="late"?"Etapa ultrapassou o SLA":sla.st==="risk"?"Próximo do limite":"Dentro do SLA"],
                ["Prazo Final",sla.ft,[sla.ft==="late"?`${Math.abs(sla.htd).toFixed(0)}h atraso`:`${sla.htd.toFixed(0)}h restantes`,""],sla.ft==="late"?"Pedido fora do prazo":sla.ft==="risk"?"Prazo muito próximo":"Dentro do prazo"]
              ].map(([title,st,vals,msg])=>{
                const c=st==="late"?C.red:st==="risk"?C.amber:C.green;
                return(
                  <Card key={title} style={{borderLeft:`3px solid ${c}`}}>
                    <SecH>{title}</SecH>
                    <div style={{...F.title,fontSize:26,fontWeight:700,color:c,lineHeight:1}}>{vals[0]} <span style={{fontSize:14,fontWeight:400,color:C.gray400}}>{vals[1]}</span></div>
                    {title==="SLA desta Etapa"&&<div style={{marginTop:8}}><SLABar pct={sla.pct} st={sla.st}/></div>}
                    <div style={{...F.body,fontSize:11,color:C.gray500,marginTop:6}}>{msg}</div>
                  </Card>
                );
              })}
            </div>
            <Card>
              <SecH>Tempo por etapa</SecH>
              {(()=>{
                const hist=(order.historico&&order.historico.length>0)
                  ? order.historico
                  : (order.timeline||[]).map(t=>({stage:t.stage,who:t.user,enteredAt:t.enteredAt,exitedAt:t.exitedAt,durMin:t.dH!=null?Math.round(t.dH*60):null}));
                if(hist.length===0)return <div style={{...F.body,color:C.gray400,fontSize:13,padding:"8px 0"}}>Nenhum histórico registrado.</div>;
                return(
                <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",fontSize:12,borderCollapse:"collapse",minWidth:560}}>
                  <thead><tr style={{borderBottom:`1px solid ${C.gray200}`}}>{["Etapa","Responsável","Entrada","Saída","Permaneceu","Status"].map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body,whiteSpace:"nowrap"}}>{hd}</th>)}</tr></thead>
                  <tbody>{hist.map((t,i)=>{
                    const act=i===hist.length-1;
                    const sl=slaCfg[t.stage];
                    const durH=t.durMin!=null?t.durMin/60:null;
                    const st=durH==null?"andamento":sl&&durH>sl?"atrasado":sl&&durH>sl*.8?"risco":"ok";
                    return(<tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                      <td style={{padding:"8px 10px",fontWeight:600,...F.body,whiteSpace:"nowrap"}}>{t.stage}</td>
                      <td style={{padding:"8px 10px",color:C.gray500,...F.body,whiteSpace:"nowrap"}}>{t.who||"Sistema"}</td>
                      <td style={{padding:"8px 10px",color:C.gray600,...F.body,fontSize:11,whiteSpace:"nowrap"}}>{fmtD(t.enteredAt)}</td>
                      <td style={{padding:"8px 10px",color:C.gray600,...F.body,fontSize:11,whiteSpace:"nowrap"}}>{t.exitedAt?fmtD(t.exitedAt):"—"}</td>
                      <td style={{padding:"8px 10px",fontWeight:700,color:st==="atrasado"?C.red:st==="risco"?C.amber:C.green,...F.body,whiteSpace:"nowrap"}}>{durH!=null?fmtDur(t.durMin):<em>Em andamento</em>}</td>
                      <td style={{padding:"8px 10px"}}><Tag label={st==="andamento"?"Andamento":st==="atrasado"?"Atrasado":st==="risco"?"Em risco":"OK"} color={st==="atrasado"?C.red:st==="risco"?C.amber:st==="andamento"?C.blue:C.green}/></td>
                    </tr>);
                  })}</tbody>
                </table>
                </div>
                );
              })()}
            </Card>
          </div>}
          {/* BORDADO */}
          {tab==="bordado"&&<div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            {/* Arquivos de bordado anexados pelo vendedor */}
            <div>
              <SecH>Arquivos de Bordado</SecH>
              <ArquivosBox fileIds={order.arquivoBordado} emptyText="Nenhum arquivo de bordado anexado ao negócio."/>
            </div>
            {(order.arquivoDtfsilk&&order.arquivoDtfsilk.length>0)?<div>
              <SecH>Arquivos DTF / Silk</SecH>
              <ArquivosBox fileIds={order.arquivoDtfsilk} emptyText="Nenhum arquivo DTF/Silk."/>
            </div>:null}
            {/* Amostra digital aprovada */}
            <div>
              <SecH>Amostra Digital Aprovada</SecH>
              <ArquivosBox fileIds={order.arqAmostraDigital?[order.arqAmostraDigital]:[]} emptyText="Nenhuma amostra digital anexada ainda."/>
            </div>
            {/* Amostra física aprovada */}
            <div>
              <SecH>Amostra Física Aprovada</SecH>
              <ArquivosBox fileIds={order.arqAmostraFisica?[order.arqAmostraFisica]:[]} emptyText="Nenhuma amostra física anexada ainda."/>
            </div>
          </div>}
          {/* PEÇAS */}
          {tab==="itens"&&<div style={{padding:20,overflowX:"auto"}}>
            {(order.etapa==="Direcionamento")&&(
              <div style={{background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:7,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                <Ic n="arrow" s={14} c={C.blue}/>
                <span style={{...F.body,fontSize:12,color:C.blue,fontWeight:600}}>Para definir Interno/Externo, use a aba <strong>▶ Executar</strong></span>
              </div>
            )}
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:460}}>
              <thead><tr style={{borderBottom:`2px solid ${C.gray200}`}}>
                {["SKU","Descrição","TAM","Qtd","Destino","Status"].map(hd=><th key={hd} style={{padding:"9px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body,textTransform:"uppercase",letterSpacing:"0.05em"}}>{hd}</th>)}
              </tr></thead>
              <tbody>{order.items.map((it,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                  <td style={{padding:"9px 10px",fontWeight:700,fontFamily:"monospace",fontSize:12,color:C.gray700}}>{it.sku}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray700}}>{it.desc}</td>
                  <td style={{padding:"9px 10px",...F.body,color:C.gray500}}>{it.cor}</td>
                  <td style={{padding:"9px 10px",fontWeight:700,...F.body}}>{it.qty}</td>
                  <td style={{padding:"9px 10px"}}>{it.dest?<Tag label={it.dest==="interno"?"Interno":"Externo"} color={it.dest==="interno"?C.green:C.purple}/>:<span style={{color:C.gray400}}>—</span>}</td>
                  <td style={{padding:"9px 10px"}}><Tag label={it.status==="faltante"?"Faltante":it.status==="bordando"?"Bordando":it.status==="pronto"?"Pronto":"Separado"} color={it.status==="faltante"?C.red:it.status==="pronto"?C.green:C.gray500}/></td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{borderTop:`2px solid ${C.gray200}`,background:C.gray50}}>
                <td colSpan={3} style={{padding:"9px 10px",fontWeight:700,fontSize:11,...F.body,color:C.gray500,textTransform:"uppercase"}}>Total</td>
                <td style={{padding:"9px 10px",fontWeight:800,fontSize:15,...F.body}}>{total}</td>
                <td colSpan={2}/>
              </tr></tfoot>
            </table>
          </div>}
          {tab==="tl"&&<Timeline order={order}/>}
          {tab==="alteracao"&&<AlteracaoFormTab order={order} onAction={onAction} me={me}/>}
          {tab==="chat"&&<div style={{height:isMobile?380:420}}><Chat order={order} me={me} onSend={onSendChat}/></div>}
          {tab==="acao"&&<AcaoTab
            order={order} me={me}
            uploadFile={uploadFile} setUploadFile={setUploadFile}
            uploadName={uploadName} setUploadName={setUploadName}
            obsText={obsText} setObsText={setObsText}
            actionDone={actionDone} setActionDone={setActionDone}
            actionMsg={actionMsg} setActionMsg={setActionMsg}
            itemSel={itemSel} itemDest={itemDest} nSel={nSel}
            allDestDefined={allDestDefined} skus={skus}
            toggleItemSel={toggleItemSel} selAllItems={selAllItems}
            setDestSel={setDestSel} setDestAll={setDestAll} setDestOne={setDestOne}
            onAction={onAction} isMobile={isMobile}
          />}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
function OCard({order,onClick,slaCfg}){
  const total=order.items.reduce((s,i)=>s+i.qty,0);
  const falt=order.items.filter(i=>i.status==="faltante").reduce((s,i)=>s+i.qty,0);
  const sla=getSLA(order,slaCfg);
  const accent=sla.st==="late"||sla.ft==="late"?C.red:sla.st==="risk"||sla.ft==="risk"?C.amber:STAGE_COLOR[order.etapa]||C.gray300;
  return(
    <div onClick={onClick} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:14,cursor:"pointer",borderLeft:`3px solid ${accent}`}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,gap:8}}>
        <div style={{minWidth:0}}>
          <div style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{order.id}</div>
          <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{order.client}</div>
        </div>
        <ETag etapa={order.etapa}/>
      </div>
      <div style={{display:"flex",gap:12,...F.body,fontSize:12,color:C.gray500,flexWrap:"wrap",marginBottom:8}}>
        <span style={{fontWeight:700,color:C.green}}>{fmtR(order.valor)}</span>
        <span>{total} peças</span>
        {falt>0&&<span style={{color:C.red,fontWeight:600}}>{falt} faltantes</span>}
        {!order.amOk&&<span style={{color:C.amber,fontWeight:600}}>Sem amostra</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <SLABar pct={sla.pct} st={sla.st}/>
        <span style={{...F.body,fontSize:10,color:sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.green,fontWeight:700,flexShrink:0}}>{sla.hrs.toFixed(0)}h/{sla.sla}h</span>
      </div>
    </div>
  );
}

// ─── MINHAS DEMANDAS ─────────────────────────────────────────────────────────
function MinhasDemandas({user,orders,onOpen,slaCfg}){
  // Junta as etapas dos módulos de operação que o usuário tem acesso
  const etapas=user.admin
    ? Object.values(MODULO_ETAPA).filter(Boolean)
    : (user.modulos||[]).map(m=>MODULO_ETAPA[m]).filter(Boolean);
  const mine=ordenarPorPrioridade(orders.filter(o=>etapas.includes(o.etapa)&&!o.concluido));
  const grouped={};etapas.forEach(e=>{grouped[e]=ordenarPorPrioridade(mine.filter(o=>o.etapa===e));});
  const active=etapas.filter(e=>grouped[e].length>0);
  const semAm=mine.filter(o=>!o.amOk);
  const atrasados=mine.filter(o=>getSLA(o,slaCfg).st==="late");
  const showAmBox=temAcesso(user,"direcionamento")||user.admin;
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Minhas Demandas" sub={`${mine.length} pedido${mine.length!==1?"s":""} sob sua responsabilidade`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="Em andamento" value={mine.length} icon="list"/>
        {atrasados.length>0&&<Stat label="Atrasados" value={atrasados.length} color={C.red} icon="warn"/>}
        {semAm.length>0&&<Stat label="Sem Amostra" value={semAm.length} color={C.amber} icon="clock"/>}
      </div>
      {showAmBox&&semAm.length>0&&(
        <div>
          <div style={{background:C.red+"0c",border:`1px solid ${C.red}28`,borderRadius:8,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <Ic n="warn" s={15} c={C.red}/>
            <span style={{...F.title,fontSize:12,fontWeight:700,color:C.red,letterSpacing:"0.08em"}}>AGUARDANDO APROVAÇÃO DE AMOSTRA — {semAm.length} PEDIDO{semAm.length>1?"S":""}</span>
          </div>
          {semAm.map(o=>(
            <div key={o.id} onClick={()=>onOpen(o)} style={{background:"#fffbeb",border:`1px solid ${C.amber}40`,borderLeft:`3px solid ${C.amber}`,borderRadius:8,padding:"12px 14px",cursor:"pointer",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div><span style={{...F.body,fontWeight:700,fontSize:13}}>{o.id}</span><span style={{...F.body,color:C.gray500,fontSize:12,marginLeft:8}}>{o.client}</span></div>
              <Tag label="Amostra pendente" color={C.amber}/>
            </div>
          ))}
        </div>
      )}
      {active.length===0&&(
        <div style={{textAlign:"center",padding:60,...F.body,color:C.gray400,fontSize:14,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          <Ic n="check" s={36} c={C.gray300} style={{margin:"0 auto 12px",display:"block"}}/>
          Nenhuma demanda pendente no momento.
        </div>
      )}
      {active.map(etapa=>(
        <div key={etapa}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLOR[etapa]||C.gray400,flexShrink:0}}/>
            <span style={{...F.title,fontSize:12,fontWeight:700,letterSpacing:"0.08em"}}>{etapa.toUpperCase()}</span>
            <span style={{...F.body,fontSize:12,color:C.gray400}}>({grouped[etapa].length})</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {grouped[etapa].map(o=><OCard key={o.id} order={o} onClick={()=>onOpen(o)} slaCfg={slaCfg}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── DIRECIONAMENTO (COMPLETO) ────────────────────────────────────────────────
function Direcionamento({orders,setOrders,onOpen,slaCfg,user}){
  const [loading,setLoading]=useState(false);
  const [loadError,setLoadError]=useState(null);
  const [hsOrders,setHsOrders]=useState(null); // null = não carregado ainda

  const carregarDir=()=>{
    setLoading(true);
    setLoadError(null);
    setConfirmed({});
    setDestMap({});
    setSel({});
    apiFetch("/direcionamento")
      .then(res=>{
        if(res.success){
          const converted=res.data.map(o=>({
            id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
            client:o.client,cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",
            tel:o.telefone||"",email:o.email||"",
            obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
            condicaoPagamento:o.condicaoPagamento||"",vendedor:o.vendedor,valor:o.valor,
            prazoFinal:o.prazoFinal||new Date(Date.now()+7*86400000).toISOString(),
            etapa:"Direcionamento",amOk:o.amostrasAprovada,sepOk:o.separacaoCompleta,
            entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
            alertas:o.alertas||[],concluido:false,
            bordado:{pts:0,cores:[],arq:"",arqOk:false,amDig:[],amDigObs:"",amFis:[],amFisObs:""},
            arquivoBordado:o.arquivoBordado||[],arquivoDtfsilk:o.arquivoDtfsilk||[],
            historico:o.historico||[],
            houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
            temBordado:o.temBordado!==false,dataVencimento:o.dataVencimento||null,
            items:(o.items||[]).map(it=>({
              id:it.id,sku:it.sku||it.nome,desc:it.nome,cor:it.tamanho,qty:it.quantidade,
              dest:it.direcionamento?it.direcionamento.toLowerCase():null,
              status:it.status==="faltante"?"faltante":"separado",
            })),
            timeline:[{stage:"Direcionamento",user:"Sistema",enteredAt:o.etapaAt||o.dataEntrada,exitedAt:null,dH:null}],
            chat:[],
          }));
          setHsOrders(converted);
        }
      })
      .catch(e=>setLoadError(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregarDir,[]);
  useEffect(()=>{
    _refreshListeners.push(carregarDir);
    return ()=>{_refreshListeners=_refreshListeners.filter(f=>f!==carregarDir);};
  },[]);

  // Usa dados reais se carregados, senão usa mock
  const activeOrders = hsOrders !== null ? hsOrders : orders;
  const pendentes=activeOrders.filter(o=>!o.amOk&&!o.concluido);
  const prontos=activeOrders.filter(o=>o.amOk&&o.etapa==="Direcionamento"&&!o.concluido);
  // Estado local de seleção por pedido: {orderId: {sku: true/false}}
  const[sel,setSel]=useState({});
  const[destMap,setDestMap]=useState({});// {orderId: {sku: "interno"|"externo"}}
  const[confirmed,setConfirmed]=useState({});// orderId: bool
  const[pendentesAberto,setPendentesAberto]=useState(false);// caixa recolhível

  const toggleSel=(oid,sku)=>{
    setSel(prev=>({...prev,[oid]:{...(prev[oid]||{}),[sku]:!(prev[oid]||{})[sku]}}));
  };
  const selAll=(oid,itemSkus)=>{
    const allOn=itemSkus.every(s=>(sel[oid]||{})[s]);
    const next={};itemSkus.forEach(s=>next[s]=!allOn);
    setSel(prev=>({...prev,[oid]:next}));
  };
  const setDest=(oid,sku,dest)=>{
    setDestMap(prev=>({...prev,[oid]:{...(prev[oid]||{}),[sku]:dest}}));
  };
  const setDestSelected=(oid,dest,itemSkus)=>{
    const selSkus=itemSkus.filter(s=>(sel[oid]||{})[s]);
    if(selSkus.length===0){alert("Selecione ao menos um item.");return;}
    const next={...(destMap[oid]||{})};
    selSkus.forEach(s=>next[s]=dest);
    setDestMap(prev=>({...prev,[oid]:next}));
  };
  const setDestAll=(oid,dest,itemSkus)=>{
    const next={};itemSkus.forEach(s=>next[s]=dest);
    setDestMap(prev=>({...prev,[oid]:next}));
  };
  const confirm=async(oid,items)=>{
    const dm=destMap[oid]||{};
    const allSet=items.every(it=>dm[it.id||it.sku]);
    if(!allSet){alert("Defina o destino (Interno/Externo) para todos os itens antes de confirmar.");return;}

    // Encontra o pedido para pegar bordadoId e posvendaId
    const ordem=(hsOrders||[]).find(o=>o.id===oid);
    if(!ordem||!ordem.bordadoId||!ordem.posvendaId){
      alert("Pedido sem negócio de Bordado/Pós-venda associado.");return;
    }

    // Monta destinos por ID do objeto: { "<objetoId>": "Interno"|"Externo" }
    const destinos={};
    items.forEach(it=>{
      const key=it.id||it.sku;
      const val=dm[key];
      if(val) destinos[it.id||it.sku]=val==="interno"?"Interno":"Externo";
    });

    try{
      const res=await apiFetch(`/direcionamento/${ordem.posvendaId}`,"PATCH",{
        bordadoId:ordem.bordadoId,
        destinos:destinos,
        ctx:{
          executor:user?.nome||user?.name||"Sistema",
          executorEmail:user?.email||"",
          vendasId:ordem.vendasId||null,
          posvendaId:ordem.posvendaId||null,
          bordadoId:ordem.bordadoId||null,
          cliente:ordem.client||"",
          etapa:"Direcionamento",
        },
      });
      if(res.error) throw new Error(res.error);
      setConfirmed(prev=>({...prev,[oid]:true}));
      // Recarrega após o HubSpot processar
      setTimeout(()=>carregarDir(),1000);
    }catch(e){
      alert("Erro ao confirmar direcionamento: "+e.message);
    }
  };

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Direcionamento" sub="Direcione cada item para bordado interno ou externo" onRefresh={carregarDir} refreshing={loading}/>
      {loading&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        Carregando pedidos do HubSpot...
      </div>}
      {loadError&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,display:"flex",alignItems:"center",gap:8}}>
        <Ic n="warn" s={14} c={C.red}/> Erro ao carregar: {loadError}
        <button onClick={()=>window.location.reload()} style={{marginLeft:"auto",background:C.red,color:C.white,border:"none",borderRadius:5,padding:"4px 10px",cursor:"pointer",...F.body,fontSize:12}}>Tentar novamente</button>
      </div>}
      {hsOrders!==null&&!loading&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:C.green+"0e",border:`1px solid ${C.green}28`,borderRadius:7,...F.body,fontSize:12,color:C.green}}>
        <Ic n="check" s={13} c={C.green}/> {hsOrders.length} pedido{hsOrders.length!==1?"s":""} carregado{hsOrders.length!==1?"s":""} do HubSpot
      </div>}
      {/* Pedidos aguardando amostra — caixa recolhível */}
      {pendentes.length>0&&(
        <div>
          <div onClick={()=>setPendentesAberto(v=>!v)}
            style={{background:C.amber+"10",border:`1px solid ${C.amber}38`,borderRadius:8,padding:"10px 16px",marginBottom:pendentesAberto?10:0,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
            <Ic n="warn" s={15} c={C.amber}/>
            <span style={{...F.title,fontSize:12,fontWeight:700,color:C.amber,letterSpacing:"0.08em"}}>AGUARDANDO APROVAÇÃO DE AMOSTRA — {pendentes.length}</span>
            <span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:5,...F.body,fontSize:11,color:C.amber,fontWeight:600}}>
              {pendentesAberto?"Recolher":"Ver"}
              <span style={{display:"inline-block",transition:"transform 0.2s",transform:pendentesAberto?"rotate(180deg)":"none"}}>
                <Ic n="chevDown" s={14} c={C.amber}/>
              </span>
            </span>
          </div>
          {pendentesAberto&&pendentes.map(o=>(
            <div key={o.id} onClick={()=>onOpen(o)} style={{background:"#fffbeb",border:`1px solid ${C.amber}40`,borderLeft:`3px solid ${C.amber}`,borderRadius:8,padding:"12px 14px",cursor:"pointer",marginBottom:8,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div><span style={{...F.body,fontWeight:700}}>{o.id}</span><span style={{...F.body,color:C.gray500,fontSize:12,marginLeft:8}}>{o.client}</span></div>
              <Tag label="Amostra pendente" color={C.amber}/>
            </div>
          ))}
        </div>
      )}
      {/* Pedidos prontos */}
      <SecH>Prontos para direcionar — {prontos.length} pedido{prontos.length!==1?"s":""}</SecH>
      {prontos.length===0&&<div style={{...F.body,color:C.gray400,textAlign:"center",padding:48,fontSize:13,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>Nenhum pedido aguardando direcionamento.</div>}
      {prontos.map(o=>{
        const skus=o.items.map(it=>it.id||it.sku);
        const dm=destMap[o.id]||{};
        const sm=sel[o.id]||{};
        const nSel=skus.filter(s=>sm[s]).length;
        const allDefined=o.items.every(it=>dm[it.id||it.sku]);
        const isConfirmed=confirmed[o.id];
        const sla=getSLA(o,slaCfg);
        return(
          <Card key={o.id} style={{marginBottom:14,borderLeft:`3px solid ${sla.st==="late"?C.red:sla.st==="risk"?C.amber:STAGE_COLOR[o.etapa]||C.gray300}`}}>
            {/* Cabeçalho do pedido */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8,alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{...F.body,fontWeight:700,fontSize:15}}>{o.id}</span>
                  <ETag etapa={o.etapa}/>
                  {sla.st!=="ok"&&<Tag label={sla.st==="late"?"Etapa atrasada":"Etapa em risco"} color={sla.st==="late"?C.red:C.amber}/>}
                  {sla.ft==="late"&&<Tag label="Prazo vencido" color={C.red}/>}
                </div>
                <div style={{...F.body,fontSize:12,color:C.gray500,marginTop:4}}>{o.client} · {fmtR(o.valor)} · {o.items.reduce((s,i)=>s+i.qty,0)} peças</div>
              </div>
              <Btn label="Ver detalhes" variant="secondary" size="sm" onClick={()=>onOpen(o)}/>
            </div>

            {/* Barra de ações em lote */}
            <div style={{background:C.gray50,borderRadius:6,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",border:`1px solid ${C.gray200}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginRight:4}}>
                <input type="checkbox"
                  checked={nSel===skus.length&&skus.length>0}
                  onChange={()=>selAll(o.id,skus)}
                  style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
                <span style={{...F.body,fontSize:12,color:C.gray600,fontWeight:600}}>
                  {nSel===0?"Selecionar todos":nSel===skus.length?"Todos selecionados":`${nSel} selecionado${nSel>1?"s":""}`}
                </span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <button onClick={()=>setDestSelected(o.id,"interno",skus)}
                  style={{background:C.green,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:700,...F.body,display:"flex",alignItems:"center",gap:5}}>
                  <Ic n="arrow" s={12} c={C.white}/> Selecionados → Interno
                </button>
                <button onClick={()=>setDestSelected(o.id,"externo",skus)}
                  style={{background:C.purple,color:C.white,border:"none",borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:700,...F.body,display:"flex",alignItems:"center",gap:5}}>
                  <Ic n="box" s={12} c={C.white}/> Selecionados → Externo
                </button>
                <button onClick={()=>setDestAll(o.id,"interno",skus)}
                  style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",...F.body}}>
                  Todos → Interno
                </button>
                <button onClick={()=>setDestAll(o.id,"externo",skus)}
                  style={{background:C.white,color:C.gray700,border:`1px solid ${C.gray300}`,borderRadius:5,padding:"5px 12px",fontSize:12,cursor:"pointer",...F.body}}>
                  Todos → Externo
                </button>
              </div>
            </div>

            {/* Tabela de itens */}
            <div style={{overflowX:"auto",marginBottom:12}}>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:420}}>
                <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
                  {["","SKU","Descrição","TAM","Qtd","Destino"].map(hd=><th key={hd} style={{padding:"8px 10px",textAlign:"left",fontSize:11,color:C.gray500,fontWeight:700,...F.body,textTransform:"uppercase"}}>{hd}</th>)}
                </tr></thead>
                <tbody>{o.items.map((it,idx)=>{
                  const k=it.id||it.sku;
                  const thisDest=(destMap[o.id]||{})[k]||it.dest;
                  const isSelected=(sel[o.id]||{})[k]||false;
                  return(
                    <tr key={idx} style={{borderBottom:`1px solid ${C.gray100}`,background:isSelected?C.red+"06":"transparent"}}>
                      <td style={{padding:"8px 10px"}}>
                        <input type="checkbox" checked={isSelected} onChange={()=>toggleSel(o.id,k)}
                          style={{width:15,height:15,cursor:"pointer",accentColor:C.red}}/>
                      </td>
                      <td style={{padding:"8px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12,color:C.gray700}}>{it.sku}</td>
                      <td style={{padding:"8px 10px",...F.body,color:C.gray700}}>{it.desc}</td>
                      <td style={{padding:"8px 10px",...F.body,color:C.gray500,fontSize:12}}>{it.cor}</td>
                      <td style={{padding:"8px 10px",fontWeight:700,...F.body}}>{it.qty}</td>
                      <td style={{padding:"8px 10px"}}>
                        <div style={{display:"flex",gap:5}}>
                          <button onClick={()=>setDest(o.id,k,"interno")}
                            style={{background:thisDest==="interno"?C.green:C.white,color:thisDest==="interno"?C.white:C.gray700,border:`1.5px solid ${thisDest==="interno"?C.green:C.gray300}`,borderRadius:5,padding:"4px 11px",fontSize:12,cursor:"pointer",fontWeight:600,...F.body,transition:"all 0.1s"}}>
                            Interno
                          </button>
                          <button onClick={()=>setDest(o.id,k,"externo")}
                            style={{background:thisDest==="externo"?C.purple:C.white,color:thisDest==="externo"?C.white:C.gray700,border:`1.5px solid ${thisDest==="externo"?C.purple:C.gray300}`,borderRadius:5,padding:"4px 11px",fontSize:12,cursor:"pointer",fontWeight:600,...F.body,transition:"all 0.1s"}}>
                            Externo
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>

            {/* Resumo + confirmar */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div style={{display:"flex",gap:12,...F.body,fontSize:12,color:C.gray600}}>
                <span>Interno: <strong style={{color:C.green}}>{o.items.filter(it=>dm[it.sku]==="interno").length} itens</strong></span>
                <span>Externo: <strong style={{color:C.purple}}>{o.items.filter(it=>dm[it.sku]==="externo").length} itens</strong></span>
                <span style={{color:C.gray400}}>Pendente: {o.items.filter(it=>!dm[it.sku]).length} itens</span>
              </div>
              {isConfirmed
                ?<div style={{display:"flex",alignItems:"center",gap:6,...F.body,fontSize:13,color:C.green,fontWeight:700}}><Ic n="check" s={16} c={C.green}/>Direcionamento confirmado!</div>
                :<button onClick={()=>confirm(o.id,o.items)}
                  disabled={!allDefined}
                  style={{background:allDefined?C.green:"#ccc",color:C.white,border:"none",borderRadius:7,padding:"9px 20px",cursor:allDefined?"pointer":"not-allowed",fontWeight:700,fontSize:13,...F.body,display:"flex",alignItems:"center",gap:7}}>
                  <Ic n="check" s={14} c={C.white}/> Confirmar direcionamento
                </button>
              }
            </div>
            {!allDefined&&!isConfirmed&&<div style={{...F.body,fontSize:11,color:C.amber,marginTop:6,display:"flex",alignItems:"center",gap:4}}>
              <Ic n="warn" s={11} c={C.amber}/> Defina o destino de todos os itens antes de confirmar.
            </div>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
// Opções de Centro de Custo (da propriedade do HubSpot)
const CENTRO_OPTIONS=[
  {value:"27",label:"27 - Corporativo"},
  {value:"10 - Concessionária",label:"10 - Concessionária"},
  {value:"31 - B2B",label:"31 - B2B"},
  {value:"03 - Licitação",label:"03 - Licitação"},
  {value:"29 - Comercial Diretoria",label:"29 - Comercial Diretoria"},
];
// Etapas em aberto, na ordem do funil, com endpoint
const ABERTO_ETAPAS=[
  {nome:"Direcionamento",endpoint:"/direcionamento"},
  {nome:"Programação",endpoint:"/programacao"},
  {nome:"Amostra Digital",endpoint:"/amostra-digital"},
  {nome:"Aprovação de Amostra Digital",endpoint:"/aprovacao-amostra-digital"},
  {nome:"Amostra Física",endpoint:"/amostra-fisica"},
  {nome:"Aprovação de Amostra Física",endpoint:"/aprovacao-amostra-fisica"},
  {nome:"Bordado Interno",endpoint:"/bordado-interno"},
  {nome:"Bordado Externo",endpoint:"/bordado-externo"},
  {nome:"Expedição",endpoint:"/expedicao"},
  {nome:"Faturamento",endpoint:"/faturamento"},
];

function Dashboard({onOpen,slaCfg}){
  const [grupo,setGrupo]=useState("aberto");   // aberto | finalizados
  const [centro,setCentro]=useState("");
  const [bordadoF,setBordadoF]=useState("");   // "" | com | sem
  const [busca,setBusca]=useState("");
  const [aberto,setAberto]=useState(null);     // array de pedidos em aberto
  const [rel,setRel]=useState(null);           // relatórios de finalizados
  const [loading,setLoading]=useState(true);
  const [erro,setErro]=useState("");

  const carregar=async()=>{
    setLoading(true);setErro("");
    try{
      // Em aberto: carrega todos os endpoints de etapa em paralelo
      const resultados=await Promise.all(
        ABERTO_ETAPAS.map(e=>apiFetch(e.endpoint).then(r=>(r.data||[]).map(o=>normalizarCard(o,e.nome))).catch(()=>[]))
      );
      setAberto(resultados.flat());
      // Finalizados: relatórios do Supabase
      const r=await apiFetch("/relatorios"+montarQuery()).catch(()=>null);
      setRel(r);
    }catch(e){setErro(e.message);}
    finally{setLoading(false);}
  };
  useEffect(()=>{carregar();},[]); // recarrega manualmente ou ao trocar centro (abaixo)
  const montarQuery=()=>{
    const p=[];
    if(centro)p.push("centro="+encodeURIComponent(centro));
    if(bordadoF)p.push("bordado="+bordadoF);
    return p.length?"?"+p.join("&"):"";
  };
  useEffect(()=>{ if(grupo==="finalizados"){ apiFetch("/relatorios"+montarQuery()).then(setRel).catch(()=>{}); } },[centro,bordadoF,grupo]);

  // Filtros aplicados ao "em aberto"
  const q=busca.trim().toLowerCase();
  const abertoFiltrado=(aberto||[]).filter(o=>{
    if(centro&&o.centroCusto!==centro)return false;
    if(bordadoF==="com"&&o.temBordado===false)return false;
    if(bordadoF==="sem"&&o.temBordado!==false)return false;
    if(q&&!((o.client||"").toLowerCase().includes(q)||String(o.id||"").toLowerCase().includes(q)))return false;
    return true;
  });
  const agora=Date.now();
  const isAtrasado=o=>o.prazoFinal&&new Date(o.prazoFinal).getTime()<agora;
  const totalAberto=abertoFiltrado.length;
  const totalAtrasado=abertoFiltrado.filter(isAtrasado).length;
  const totalNoPrazo=totalAberto-totalAtrasado;
  // Por etapa
  const porEtapa=ABERTO_ETAPAS.map(e=>{
    const ords=ordenarPorPrioridade(abertoFiltrado.filter(o=>o.etapa===e.nome));
    return {etapa:e.nome,total:ords.length,atrasados:ords.filter(isAtrasado).length,ords};
  }).filter(s=>s.total>0);

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <PageH title="Dashboard" sub="Visão geral de pedidos em aberto e finalizados" onRefresh={carregar} refreshing={loading}/>

      {/* Alternância de grupo */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["aberto","Pedidos em Aberto"],["finalizados","Pedidos Finalizados"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setGrupo(id)}
            style={{padding:"9px 18px",borderRadius:8,border:`1.5px solid ${grupo===id?C.red:C.gray200}`,background:grupo===id?C.red:C.white,color:grupo===id?C.white:C.gray600,cursor:"pointer",...F.body,fontSize:13,fontWeight:700}}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <select value={centro} onChange={e=>setCentro(e.target.value)}
          style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none",background:C.white,cursor:"pointer",minWidth:200}}>
          <option value="">Todos os centros de custo</option>
          {CENTRO_OPTIONS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={bordadoF} onChange={e=>setBordadoF(e.target.value)}
          style={{border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px",...F.body,fontSize:13,outline:"none",background:C.white,cursor:"pointer",minWidth:160}}>
          <option value="">Com e sem bordado</option>
          <option value="com">Somente com bordado</option>
          <option value="sem">Somente sem bordado</option>
        </select>
        {grupo==="aberto"&&<div style={{position:"relative",flex:1,minWidth:200,maxWidth:340}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={15} c={C.gray400}/></div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente ou código..."
            style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"9px 12px 9px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>}
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue}}>Carregando do HubSpot...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red}}>Erro: {erro}</div>}

      {/* ───── GRUPO: EM ABERTO ───── */}
      {grupo==="aberto"&&!loading&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          <Stat label="Pedidos em aberto" value={totalAberto} icon="list"/>
          <Stat label="No prazo" value={totalNoPrazo} color={C.green} icon="check"/>
          <Stat label="Atrasados" value={totalAtrasado} color={C.red} icon="warn"/>
        </div>
        <Card>
          <SecH>Pedidos por etapa</SecH>
          {porEtapa.length===0?<div style={{...F.body,color:C.gray400,fontSize:13}}>Nenhum pedido em aberto.</div>
          :<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {porEtapa.map(s=>{
              const c=STAGE_COLOR[s.etapa]||C.gray400;
              const pctAtraso=s.total?Math.round((s.atrasados/s.total)*100):0;
              return(
                <div key={s.etapa} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${C.gray100}`}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0,...F.body,fontSize:13,fontWeight:600,color:C.black}}>{s.etapa}</div>
                  {/* barra */}
                  <div style={{flex:2,minWidth:80,height:8,background:C.gray100,borderRadius:4,overflow:"hidden",display:"flex"}}>
                    <div style={{width:`${100-pctAtraso}%`,background:C.green,height:"100%"}}/>
                    <div style={{width:`${pctAtraso}%`,background:C.red,height:"100%"}}/>
                  </div>
                  <div style={{...F.body,fontSize:12,color:C.gray600,whiteSpace:"nowrap",minWidth:90,textAlign:"right"}}>
                    <strong style={{color:C.black}}>{s.total}</strong> total
                    {s.atrasados>0&&<span style={{color:C.red,fontWeight:700}}> · {s.atrasados} atrasado{s.atrasados>1?"s":""}</span>}
                  </div>
                </div>
              );
            })}
          </div>}
        </Card>
        {totalAtrasado>0&&<div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:C.red+"0c",border:`1px solid ${C.red}28`,borderRadius:8,padding:"10px 16px",marginBottom:12}}>
            <Ic n="warn" s={15} c={C.red}/><span style={{...F.title,fontSize:12,fontWeight:700,color:C.red,letterSpacing:"0.08em"}}>PEDIDOS ATRASADOS ({totalAtrasado})</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {ordenarPorPrioridade(abertoFiltrado.filter(isAtrasado)).map(o=><OCard key={(o.id||"")+o.etapa} order={o} onClick={()=>onOpen(o)} slaCfg={slaCfg}/>)}
          </div>
        </div>}
      </>}

      {/* ───── GRUPO: FINALIZADOS ───── */}
      {grupo==="finalizados"&&!loading&&<>
        {!rel?<div style={{...F.body,color:C.gray400,fontSize:13}}>Carregando relatórios...</div>:<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
            <Stat label="Total faturados" value={rel.totais?.faturados||0} icon="dollar"/>
            <Stat label="Faturados com atraso" value={rel.totais?.faturadosAtrasados||0} color={C.red} icon="warn"/>
            <Stat label="% em atraso" value={(rel.totais?.pctAtraso||0)+"%"} color={(rel.totais?.pctAtraso||0)>20?C.red:C.amber} icon="clock"/>
          </div>

          <Card>
            <SecH>SLA médio por etapa</SecH>
            {(!rel.slaPorEtapa||rel.slaPorEtapa.length===0)?<div style={{...F.body,color:C.gray400,fontSize:13}}>Sem dados suficientes ainda. As médias aparecem conforme os pedidos são executados.</div>
            :<table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${C.gray200}`}}>{["Etapa","Tempo médio","Execuções"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body}}>{h}</th>)}</tr></thead>
              <tbody>{rel.slaPorEtapa.map((s,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                  <td style={{padding:"8px 10px",fontWeight:600,...F.body}}>{s.etapa}</td>
                  <td style={{padding:"8px 10px",fontWeight:700,color:C.black,...F.body}}>{fmtDur(s.mediaMin)}</td>
                  <td style={{padding:"8px 10px",color:C.gray500,...F.body}}>{s.qtd}</td>
                </tr>
              ))}</tbody>
            </table>}
          </Card>

          <Card>
            <SecH>Faturados por mês</SecH>
            {(!rel.faturadosPorMes||rel.faturadosPorMes.length===0)?<div style={{...F.body,color:C.gray400,fontSize:13}}>Nenhum pedido faturado registrado ainda.</div>
            :<table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${C.gray200}`}}>{["Mês","Faturados","Em atraso","% atraso"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:C.gray500,fontSize:11,...F.body}}>{h}</th>)}</tr></thead>
              <tbody>{rel.faturadosPorMes.map((m,i)=>{
                const [y,mo]=m.mes.split("-");
                const label=mo?`${mo}/${y}`:m.mes;
                return(<tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                  <td style={{padding:"8px 10px",fontWeight:600,...F.body}}>{label}</td>
                  <td style={{padding:"8px 10px",fontWeight:700,...F.body}}>{m.total}</td>
                  <td style={{padding:"8px 10px",color:m.atrasados>0?C.red:C.gray500,fontWeight:m.atrasados>0?700:400,...F.body}}>{m.atrasados}</td>
                  <td style={{padding:"8px 10px",color:m.pctAtraso>20?C.red:C.gray600,...F.body}}>{m.pctAtraso}%</td>
                </tr>);
              })}</tbody>
            </table>}
          </Card>
        </>}
      </>}
    </div>
  );
}

// ─── FUNIL ───────────────────────────────────────────────────────────────────
function Funil({orders,onOpen,slaCfg}){
  const[sel,setSel]=useState(null);
  const stats=Object.keys(SLA_DEF).map(e=>{
    const ords=orders.filter(o=>o.etapa===e&&!o.concluido);
    return{etapa:e,count:ords.length,val:ords.reduce((s,o)=>s+o.valor,0),pecas:ords.reduce((s,o)=>s+o.items.reduce((ss,i)=>ss+i.qty,0),0),tMed:ords.length?ords.reduce((s,o)=>s+hrsIn(o.etapaAt),0)/ords.length:0,atrasados:ords.filter(o=>getSLA(o,slaCfg).st==="late").length,ords};
  }).filter(s=>s.count>0);
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Funil em Tempo Real" sub="Pedidos por etapa com valor, peças e tempo médio"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
        {stats.map(s=>{
          const c=STAGE_COLOR[s.etapa]||C.gray500;const isSel=sel===s.etapa;
          return(
            <div key={s.etapa} onClick={()=>setSel(isSel?null:s.etapa)}
              style={{background:C.white,border:`1.5px solid ${isSel?c:C.gray200}`,borderRadius:8,padding:16,cursor:"pointer"}}
              onMouseEnter={e=>{if(!isSel)e.currentTarget.style.borderColor=c+"80";}}
              onMouseLeave={e=>{if(!isSel)e.currentTarget.style.borderColor=C.gray200;}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c,marginBottom:6}}/>
                  <div style={{...F.title,fontSize:11,fontWeight:700,color:C.black,letterSpacing:"0.08em"}}>{s.etapa.toUpperCase()}</div>
                </div>
                <div style={{...F.title,fontSize:24,fontWeight:700,color:c}}>{s.count}</div>
              </div>
              <div style={{height:1,background:C.gray200,marginBottom:10}}/>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {[["Valor retido",fmtR(s.val),"dollar"],["Peças",String(s.pecas),"box"],["Tempo médio",`${s.tMed.toFixed(1)}h`,"clock"]].map(([k,v,ic])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",...F.body,fontSize:12}}>
                    <span style={{color:C.gray500,display:"flex",alignItems:"center",gap:4}}><Ic n={ic} s={11} c={C.gray400}/>{k}</span>
                    <span style={{fontWeight:700,color:k==="Valor retido"?C.green:k==="Tempo médio"&&s.tMed>slaCfg[s.etapa]?C.red:C.black}}>{v}</span>
                  </div>
                ))}
                {s.atrasados>0&&<div style={{display:"flex",alignItems:"center",gap:4,...F.body,fontSize:11,color:C.red,fontWeight:700,marginTop:2}}><Ic n="warn" s={11} c={C.red}/>{s.atrasados} atrasado{s.atrasados>1?"s":""}</div>}
              </div>
              <div style={{...F.body,fontSize:11,color:isSel?c:C.gray400,fontWeight:600,textAlign:"center",marginTop:10}}>{isSel?"▲ Fechar":"▼ Ver pedidos"}</div>
            </div>
          );
        })}
      </div>
      {sel&&<Card style={{border:`1px solid ${STAGE_COLOR[sel]||C.gray200}40`}}>
        <SecH>{sel} — pedidos em aberto</SecH>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
          {stats.find(s=>s.etapa===sel)?.ords.map(o=><OCard key={o.id} order={o} onClick={()=>onOpen(o)} slaCfg={slaCfg}/>)}
        </div>
      </Card>}
    </div>
  );
}

// ─── GERENCIAL ───────────────────────────────────────────────────────────────
function Gerencial({isMobile}){
  const[p,setP]=useState("semana");
  const PC=[C.red,C.green,C.amber];
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,alignItems:"flex-start"}}>
        <PageH title="Gerencial" sub="Indicadores de performance do setor"/>
        <div style={{display:"flex",gap:6}}>
          {["semana","mes","trimestre"].map(v=>(
            <button key={v} onClick={()=>setP(v)} style={{background:p===v?C.red:C.white,color:p===v?C.white:C.gray600,border:`1px solid ${p===v?C.red:C.gray200}`,borderRadius:6,padding:"7px 14px",...F.body,fontSize:12,fontWeight:600,cursor:"pointer"}}>
              {v==="semana"?"Semana":v==="mes"?"Mês":"Trimestre"}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="Entrados" value="42" icon="inbox"/>
        <Stat label="Concluídos" value="37" color={C.green} icon="check"/>
        <Stat label="Tempo Médio" value="4.2d" color={C.amber} icon="clock"/>
        <Stat label="Retrabalho" value="8%" color={C.red} icon="refresh"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        <Card>
          <SecH>Pedidos por Etapa</SecH>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GER_DATA.etapas} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/><XAxis dataKey="e" tick={{fontSize:9,fill:C.gray500}}/><YAxis tick={{fontSize:9,fill:C.gray500}}/><Tooltip contentStyle={{fontSize:12}}/><Bar dataKey="q" fill={C.red} radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SecH>Tempo Médio por Etapa (horas)</SecH>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={GER_DATA.tempo} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/><XAxis dataKey="e" tick={{fontSize:9,fill:C.gray500}}/><YAxis tick={{fontSize:9,fill:C.gray500}}/><Tooltip contentStyle={{fontSize:12}} formatter={v=>`${v}h`}/><Bar dataKey="h" fill={C.green} radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SecH>Volume Semanal — Entradas vs Saídas</SecH>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={GER_DATA.semanal}><CartesianGrid strokeDasharray="3 3" stroke={C.gray200}/><XAxis dataKey="d" tick={{fontSize:11,fill:C.gray500}}/><YAxis tick={{fontSize:11,fill:C.gray500}}/><Tooltip contentStyle={{fontSize:12}}/><Line type="monotone" dataKey="e" stroke={C.red} strokeWidth={2} dot={{r:3}} name="Entradas"/><Line type="monotone" dataKey="s" stroke={C.green} strokeWidth={2} dot={{r:3}} name="Saídas"/></LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SecH>Distribuição por Tipo</SecH>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart><Pie data={GER_DATA.dist} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="v">{GER_DATA.dist.map((_,i)=><Cell key={i} fill={PC[i]}/>)}</Pie><Tooltip contentStyle={{fontSize:12}}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {GER_DATA.dist.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,...F.body,fontSize:12}}><div style={{width:10,height:10,borderRadius:2,background:PC[i],flexShrink:0}}/><span style={{color:C.gray600}}>{d.n}</span><span style={{fontWeight:700}}>{d.v}%</span></div>)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── HISTÓRICO ───────────────────────────────────────────────────────────────
function Historico({hist,onOpen}){
  const[df,setDf]=useState("");const[dt,setDt]=useState("");const[vnd,setVnd]=useState("");
  const filtered=hist.filter(o=>{
    if(df&&new Date(o.dataConclusao)<new Date(df))return false;
    if(dt&&new Date(o.dataConclusao)>new Date(dt+"T23:59:59"))return false;
    if(vnd&&!o.vendedor.toLowerCase().includes(vnd.toLowerCase()))return false;
    return true;
  });
  const totalVal=filtered.reduce((s,o)=>s+o.valor,0);
  const cum=filtered.filter(o=>o.cumpriunSLA).length;
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Histórico" sub="Pedidos concluídos com filtro por período"/>
      <Card>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[["De",df,setDf,"date"],["Até",dt,setDt,"date"],["Vendedor",vnd,setVnd,"text"]].map(([lbl,val,set,type])=>(
            <div key={lbl}>
              <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>{lbl}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={type==="text"?"Filtrar...":undefined}
                style={{border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
            </div>
          ))}
          <Btn label="Limpar" variant="secondary" onClick={()=>{setDf("");setDt("");setVnd("");}}/>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <Stat label="Pedidos" value={filtered.length} icon="list" color={C.blue}/>
        <Stat label="Valor Total" value={"R$"+Math.round(totalVal/1000)+"k"} icon="dollar" color={C.green}/>
        <Stat label="SLA Cumprido" value={`${filtered.length?Math.round(cum/filtered.length*100):0}%`} icon="check" color={cum/filtered.length>=0.8?C.green:C.red}/>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:540}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["Pedido","Cliente","Vendedor","Valor","Conclusão","Prazo","SLA"].map(hd=><th key={hd} style={{padding:"11px 14px",textAlign:"left",...F.body,fontSize:11,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{hd}</th>)}
            </tr></thead>
            <tbody>{filtered.map(o=>(
              <tr key={o.id} onClick={()=>onOpen(o)} style={{borderBottom:`1px solid ${C.gray100}`,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.gray50}
                onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                <td style={{padding:"10px 14px",fontWeight:700,...F.body}}>{o.id}</td>
                <td style={{padding:"10px 14px",...F.body,color:C.gray700}}>{o.client}</td>
                <td style={{padding:"10px 14px",...F.body,color:C.gray500}}>{o.vendedor}</td>
                <td style={{padding:"10px 14px",fontWeight:700,...F.body,color:C.green}}>{fmtR(o.valor)}</td>
                <td style={{padding:"10px 14px",...F.body,color:C.gray500}}>{fmtDS(o.dataConclusao)}</td>
                <td style={{padding:"10px 14px",fontWeight:600,...F.body,color:new Date(o.prazoFinal)<new Date(o.dataConclusao)?C.red:C.green}}>{fmtDS(o.prazoFinal)}</td>
                <td style={{padding:"10px 14px"}}><Tag label={o.cumpriunSLA?"Cumprido":"Atrasado"} color={o.cumpriunSLA?C.green:C.red}/></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── RANKING ─────────────────────────────────────────────────────────────────
function Ranking({hist}){
  const[df,setDf]=useState("");const[dt,setDt]=useState("");
  const filtered=hist.filter(o=>{
    if(df&&new Date(o.dataConclusao)<new Date(df))return false;
    if(dt&&new Date(o.dataConclusao)>new Date(dt+"T23:59:59"))return false;
    return true;
  });
  const byV={},byR={};
  filtered.forEach(o=>{
    if(!byV[o.vendedor])byV[o.vendedor]={n:o.vendedor,p:0,v:0,c:0};
    byV[o.vendedor].p++;byV[o.vendedor].v+=o.valor;if(o.cumpriunSLA)byV[o.vendedor].c++;
    const r=o.resp||"—";
    if(!byR[r])byR[r]={n:r,p:0,v:0,c:0};
    byR[r].p++;byR[r].v+=o.valor;if(o.cumpriunSLA)byR[r].c++;
  });
  const vRank=Object.values(byV).sort((a,b)=>b.v-a.v);
  const rRank=Object.values(byR).sort((a,b)=>b.p-a.p);
  const medals=["1º","2º","3º"];const mc=[C.amber,C.gray500,"#cd7f32"];
  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
      <PageH title="Ranking / Premiação" sub="Performance por vendedor e executor no período"/>
      <Card>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[["De",df,setDf],["Até",dt,setDt]].map(([lbl,val,set])=>(
            <div key={lbl}>
              <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>{lbl}</label>
              <input type="date" value={val} onChange={e=>set(e.target.value)} style={{border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:13,outline:"none"}}/>
            </div>
          ))}
          <Btn label="Limpar" variant="secondary" onClick={()=>{setDf("");setDt("");}}/>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[["Vendedores — Faturamento",vRank,"v"],["Executores — Pedidos",rRank,"p"]].map(([title,rank,metric])=>(
          <Card key={title}>
            <SecH>{title}</SecH>
            {rank.length===0?<div style={{...F.body,color:C.gray400,fontSize:13}}>Sem dados no período.</div>
              :rank.map((v,i)=>(
                <div key={v.n} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<rank.length-1?`1px solid ${C.gray100}`:"none"}}>
                  <div style={{width:28,...F.title,fontSize:14,fontWeight:700,color:mc[i]||C.gray400,textAlign:"center",flexShrink:0}}>{medals[i]||`${i+1}º`}</div>
                  <div style={{flex:1}}>
                    <div style={{...F.body,fontWeight:700,fontSize:13,color:C.black}}>{v.n}</div>
                    <div style={{...F.body,fontSize:11,color:C.gray400}}>{v.p} pedidos · {Math.round(v.c/v.p*100)}% SLA</div>
                  </div>
                  <div style={{...F.title,fontWeight:700,fontSize:15,color:C.green}}>{metric==="v"?fmtR(v.v):`${v.p} ped.`}</div>
                </div>
              ))
            }
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SLA CONFIG ──────────────────────────────────────────────────────────────
function SLAConfig({slaCfg,onSave}){
  const[local,setLocal]=useState({...slaCfg});
  const[prazoCom,setPrazoCom]=useState(15);
  const[prazoSem,setPrazoSem]=useState(7);
  const[saved,setSaved]=useState(false);
  const[saving,setSaving]=useState(false);
  const[loading,setLoading]=useState(true);

  // Carrega a config persistida do Worker (KV)
  useEffect(()=>{
    apiFetch("/config-sla").then(r=>{
      if(r.success&&r.config){
        if(r.config.etapas)setLocal(prev=>({...prev,...r.config.etapas}));
        if(r.config.prazoComBordado!=null)setPrazoCom(r.config.prazoComBordado);
        if(r.config.prazoSemBordado!=null)setPrazoSem(r.config.prazoSemBordado);
      }
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const save=async()=>{
    setSaving(true);
    try{
      await apiFetch("/config-sla","PATCH",{etapas:local,prazoComBordado:Number(prazoCom),prazoSemBordado:Number(prazoSem)});
      onSave(local);
      setSaved(true);setTimeout(()=>setSaved(false),2000);
    }catch(e){alert("Erro ao salvar: "+e.message);}
    finally{setSaving(false);}
  };

  return(
    <div style={{padding:24,display:"flex",flexDirection:"column",gap:18}}>
      <PageH title="Configurar SLA" sub="Tempo máximo por etapa e prazos de vencimento dos pedidos"/>

      {/* Prazos de vencimento (data de vencimento do pedido) */}
      <Card>
        <SecH>Prazo de faturamento (data de vencimento)</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:16}}>
          Define a <strong>data de vencimento</strong> de cada pedido, usada para priorizar a ordem em todos os módulos. Para pedidos <strong>com bordado</strong>, o prazo é contado a partir da aprovação da amostra física. Para pedidos <strong>sem bordado</strong>, a partir da criação do pedido.
        </div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Pedido com bordado</label>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="number" value={prazoCom} onChange={e=>setPrazoCom(e.target.value)}
                style={{width:80,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
              <span style={{...F.body,fontSize:12,color:C.gray400}}>dias</span>
            </div>
          </div>
          <div>
            <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:8}}>Pedido sem bordado</label>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="number" value={prazoSem} onChange={e=>setPrazoSem(e.target.value)}
                style={{width:80,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
              <span style={{...F.body,fontSize:12,color:C.gray400}}>dias</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tempo por etapa */}
      <Card>
        <SecH>Tempo máximo por etapa</SecH>
        <div style={{...F.body,fontSize:13,color:C.gray500,marginBottom:20}}>Pedidos que ultrapassarem o tempo definido serão sinalizados como atrasados na etapa.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16}}>
          {Object.keys(SLA_DEF).map(e=>(
            <div key={e}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:STAGE_COLOR[e]||C.gray400}}/>
                <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{e}</label>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={local[e]||""} onChange={ev=>setLocal({...local,[e]:Number(ev.target.value)})}
                  style={{width:80,border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",...F.body,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
                <span style={{...F.body,fontSize:12,color:C.gray400}}>horas</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <Btn label={saving?"Salvando...":"Salvar configurações"} icon="check" onClick={save}/>
        {saved&&<span style={{...F.body,fontSize:13,color:C.green,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Ic n="check" s={14} c={C.green}/>Salvo!</span>}
        {loading&&<span style={{...F.body,fontSize:12,color:C.gray400}}>Carregando config...</span>}
      </div>
    </div>
  );
}

// ─── FILA GENÉRICA ────────────────────────────────────────────────────────────
function Fila({title,etapa,orders,onOpen,actionLabel,actionColor=C.green,slaCfg,endpoint,finalizado}){
  const [loading,setLoading]=useState(false);
  const [hsData,setHsData]=useState(null);
  const [loadError,setLoadError]=useState(null);
  const [busca,setBusca]=useState("");
  const [filtroSLA,setFiltroSLA]=useState("todos"); // todos | atrasados | risco | ok

  const carregar=()=>{
    if(!endpoint){setHsData(null);return;}
    setLoading(true);setLoadError(null);
    apiFetch(endpoint)
      .then(res=>{
        if(res.success){
          const conv=res.data.map(o=>({
            id:o.id,posvendaId:o.posvendaId,vendasId:o.vendasId,bordadoId:o.bordadoId,
            client:o.client||"",vendedor:o.vendedor,valor:o.valor||0,
            cnpj:o.cnpj||"",razaoSocial:o.razaoSocial||"",tel:o.telefone||"",email:o.email||"",
            obs:o.infoImportante||o.descricao||"",endereco:o.endereco||"",
            condicaoPagamento:o.condicaoPagamento||"",arquivoDtfsilk:o.arquivoDtfsilk||[],
            arqProgramacao:o.arqProgramacao||"",arqAmostraDigital:o.arqAmostraDigital||"",arqAmostraFisica:o.arqAmostraFisica||"",
            motivoRejAmDigital:o.motivoRejAmDigital||"",motivoRejAmFisica:o.motivoRejAmFisica||"",
            reprogramacao:o.reprogramacao||false,
            historico:o.historico||[],
            arqAmostraDigital:o.arqAmostraDigital||"",arqAmostraFisica:o.arqAmostraFisica||"",
            houveAlteracaoForm:o.houveAlteracaoForm||false,motivoAlteracaoForm:o.motivoAlteracaoForm||"",stageIdAtual:o.stageIdAtual||"",centroCusto:o.centroCusto||"",
            temBordado:o.temBordado!==false,dataVencimento:o.dataVencimento||null,
            prazoFinal:o.prazoFinal||new Date(Date.now()+7*86400000).toISOString(),
            etapa:o.etapa||etapa,amOk:false,sepOk:true,
            entradaAt:o.dataEntrada,etapaAt:o.etapaAt||o.dataEntrada,
            alertas:o.alertas||[],concluido:false,
            bordado:{pts:0,cores:[],arq:"",arqOk:false,amDig:[],amDigObs:"",amFis:[],amFisObs:""},
            items:(o.items||[]).map(it=>({
              id:it.id,sku:it.sku||it.nome,desc:it.nome,cor:it.tamanho,
              qty:it.quantidade,dest:it.direcionamento?it.direcionamento.toLowerCase():null,
              status:"separado",
            })),
            timeline:[{stage:o.etapa||etapa,user:"Sistema",enteredAt:o.etapaAt||o.dataEntrada,exitedAt:null,dH:null}],
            chat:[],bordadosJson:o.bordadosJson||[],arquivoBordado:o.arquivoBordado||[],
          }));
          setHsData(conv);
        }
      })
      .catch(e=>setLoadError(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[endpoint]);
  useEffect(()=>{
    _refreshListeners.push(carregar);
    return ()=>{_refreshListeners=_refreshListeners.filter(f=>f!==carregar);};
  },[endpoint]);

  const source=hsData!==null?hsData:orders;
  let mine=source.filter(o=>o.etapa===etapa&&!o.concluido);

  // Filtro de busca (código do produto/SKU ou nome do cliente)
  const q=busca.trim().toLowerCase();
  if(q){
    mine=mine.filter(o=>
      (o.client||"").toLowerCase().includes(q) ||
      (o.id||"").toLowerCase().includes(q) ||
      (o.items||[]).some(it=>(it.sku||"").toLowerCase().includes(q)||(it.desc||"").toLowerCase().includes(q))
    );
  }

  // Filtro de SLA
  if(filtroSLA!=="todos"){
    mine=mine.filter(o=>{
      const st=getSLA(o,slaCfg).st;
      return filtroSLA==="atrasados"?st==="late":filtroSLA==="risco"?st==="risk":st==="ok";
    });
  }

  // Ordena por PRIORIDADE (data de vencimento mais próxima primeiro)
  mine=ordenarPorPrioridade(mine);

  // Contadores para os chips de filtro
  const all=source.filter(o=>o.etapa===etapa&&!o.concluido);
  const nLate=all.filter(o=>getSLA(o,slaCfg).st==="late").length;
  const nRisk=all.filter(o=>getSLA(o,slaCfg).st==="risk").length;

  const FilterChip=({id,label,count,color})=>(
    <button onClick={()=>setFiltroSLA(id)}
      style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:7,border:`1.5px solid ${filtroSLA===id?(color||C.red):C.gray200}`,background:filtroSLA===id?(color||C.red)+"0e":C.white,cursor:"pointer",...F.body,fontSize:12,fontWeight:filtroSLA===id?700:500,color:filtroSLA===id?(color||C.red):C.gray600,whiteSpace:"nowrap"}}>
      {label}{count!==undefined&&<span style={{background:filtroSLA===id?(color||C.red):C.gray200,color:filtroSLA===id?C.white:C.gray600,borderRadius:10,padding:"1px 7px",fontSize:11,fontWeight:700}}>{count}</span>}
    </button>
  );

  return(
    <div style={{padding:24}}>
      <PageH title={title} sub={`${all.length} pedido${all.length!==1?"s":""} ${finalizado?"concluído"+(all.length!==1?"s":""):"nesta etapa"}`} onRefresh={carregar} refreshing={loading}/>

      {/* Barra de busca + filtros */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,minWidth:220}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
            <Ic n="search" s={15} c={C.gray400}/>
          </div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, SKU ou código..."
            style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px 10px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        </div>
        {!finalizado&&<div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <FilterChip id="todos" label="Todos" count={all.length} color={C.gray600}/>
          <FilterChip id="atrasados" label="Atrasados" count={nLate} color={C.red}/>
          <FilterChip id="risco" label="Em risco" count={nRisk} color={C.amber}/>
          <FilterChip id="ok" label="No prazo" color={C.green}/>
        </div>}
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue,marginBottom:12}}>Carregando do HubSpot...</div>}
      {loadError&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:12}}>Erro: {loadError}</div>}

      {mine.length===0
        ?<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",padding:60,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          <Ic n="check" s={32} c={C.gray300} style={{display:"block",margin:"0 auto 10px"}}/>
          {q||filtroSLA!=="todos"?"Nenhum pedido encontrado com esses filtros.":"Nenhum pedido nesta etapa."}
        </div>
        :mine.map(o=>{
          const sla=getSLA(o,slaCfg);
          const ac=finalizado?C.green:(sla.st==="late"?C.red:sla.st==="risk"?C.amber:STAGE_COLOR[etapa]||C.gray300);
          const slaLabel=sla.st==="late"?"ATRASADO":sla.st==="risk"?"EM RISCO":"NO PRAZO";
          const slaColor=sla.st==="late"?C.red:sla.st==="risk"?C.amber:C.green;
          const totalPecas=o.items.reduce((s,i)=>s+(i.qty||0),0);
          return(
            <Card key={o.id} onClick={()=>onOpen(o)}
              style={{marginBottom:10,borderLeft:`4px solid ${ac}`,cursor:"pointer",transition:"box-shadow 0.15s,transform 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="";e.currentTarget.style.transform="";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
                    <span style={{...F.body,fontWeight:700,fontSize:14}}>{o.id}</span>
                    {o.reprogramacao&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#f97316",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>↻ REPROGRAMAÇÃO</span>}
                    {o.houveAlteracaoForm&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#b45309",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>⚠ ALTERAÇÃO DE FORMULÁRIO</span>}
                    {o.temBordado===false&&<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.gray600,color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>SEM BORDADO</span>}
                    {/* Badge de status */}
                    {finalizado
                      ?<span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.green+"15",color:C.green,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>
                        <Ic n="check" s={10} c={C.green}/> CONCLUÍDO
                      </span>
                      :<span style={{display:"inline-flex",alignItems:"center",gap:4,background:slaColor+"15",color:slaColor,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:slaColor,display:"inline-block"}}/>
                        {slaLabel}
                      </span>}
                  </div>
                  <div style={{...F.body,fontSize:13,color:C.black,fontWeight:600,marginBottom:3}}>{o.client||"—"}</div>
                  <div style={{...F.body,fontSize:12,color:C.gray500,marginBottom:6}}>{fmtR(o.valor)} · {o.items.length} SKU{o.items.length!==1?"s":""} · {totalPecas} peça{totalPecas!==1?"s":""}</div>
                  {!finalizado&&<div style={{...F.body,fontSize:11,color:o.dataVencimento?(new Date(o.dataVencimento)<new Date()?C.red:C.gray600):C.gray400,marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                    <Ic n="clock" s={11} c={o.dataVencimento?(new Date(o.dataVencimento)<new Date()?C.red:C.gray500):C.gray300}/>
                    {o.dataVencimento?<>Vence em {fmtDS(o.dataVencimento)}</>:"Vencimento ainda não definido"}
                  </div>}
                  {!finalizado&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,maxWidth:340}}>
                    <SLABar pct={sla.pct} st={sla.st}/>
                    <span style={{...F.body,fontSize:10,color:slaColor,fontWeight:700,flexShrink:0}}>{sla.hrs.toFixed(0)}h/{sla.sla}h</span>
                  </div>}
                  {o.alertas.length>0&&<div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>{o.alertas.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,...F.body,fontSize:11,color:"#92400e",fontWeight:600}}><Ic n="warn" s={11} c={C.amber}/>{a}</div>)}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,color:C.gray400}}>
                  <span style={{...F.body,fontSize:12,color:C.gray400}}>Abrir</span>
                  <Ic n="chevR" s={16} c={C.gray400}/>
                </div>
              </div>
            </Card>
          );
        })
      }
    </div>
  );
}

// ─── USUÁRIOS (gestão dinâmica por módulo, via Worker + KV) ───────────────────
// ─── MÓDULO: REGISTROS DE ALTERAÇÃO DE FORMULÁRIO ────────────────────────────
function AlteracoesFormList(){
  const[regs,setRegs]=useState([]);
  const[loading,setLoading]=useState(true);
  const[erro,setErro]=useState("");
  const[busca,setBusca]=useState("");

  const carregar=async()=>{
    setLoading(true);setErro("");
    try{
      const r=await apiFetch("/alteracoes-formulario");
      setRegs(r.data||[]);
    }catch(e){setErro(e.message);}
    finally{setLoading(false);}
  };
  useEffect(()=>{carregar();},[]);

  const q=busca.trim().toLowerCase();
  const filtrados=q
    ?regs.filter(r=>(r.cliente||"").toLowerCase().includes(q)||String(r.pedido_id||"").includes(q)||(r.executor||"").toLowerCase().includes(q))
    :regs;

  return(
    <div style={{padding:24}}>
      <PageH title="Alterações de Formulário" sub={`${regs.length} registro${regs.length!==1?"s":""} de alteração`} onRefresh={carregar} refreshing={loading}/>

      <div style={{position:"relative",marginBottom:16,maxWidth:420}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><Ic n="search" s={15} c={C.gray400}/></div>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por cliente, pedido ou executor..."
          style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px 10px 36px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {loading&&<div style={{padding:"10px 14px",background:C.blue+"0e",border:`1px solid ${C.blue}28`,borderRadius:8,...F.body,fontSize:13,color:C.blue,marginBottom:12}}>Carregando registros...</div>}
      {erro&&<div style={{padding:"10px 14px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:12}}>Erro: {erro}</div>}

      {!loading&&filtrados.length===0
        ?<div style={{...F.body,color:C.gray400,fontSize:13,textAlign:"center",padding:60,background:C.white,borderRadius:8,border:`1px solid ${C.gray200}`}}>
          {q?"Nenhum registro encontrado.":"Nenhuma alteração de formulário registrada ainda."}
        </div>
        :filtrados.map((r,i)=>{
          const det=r.detalhes||{};
          return(
            <Card key={r.id||i} style={{marginBottom:10,borderLeft:`4px solid #b45309`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#b45309",color:C.white,borderRadius:6,padding:"2px 9px",...F.body,fontSize:10,fontWeight:700,letterSpacing:"0.04em"}}>⚠ ALTERAÇÃO DE FORMULÁRIO</span>
                    {r.pedido_id&&<span style={{...F.body,fontWeight:700,fontSize:14}}>PED-{r.pedido_id}</span>}
                  </div>
                  <div style={{...F.body,fontSize:13,color:C.black,fontWeight:600,marginBottom:3}}>{r.cliente||"—"}</div>
                  {(det.etapaOrigem||det.voltouPara)&&<div style={{...F.body,fontSize:12,color:C.gray600,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                    <span>{det.etapaOrigem||"—"}</span><Ic n="arrow" s={12} c={C.gray400}/><strong style={{color:"#b45309"}}>{det.voltouPara||"—"}</strong>
                  </div>}
                  <div style={{background:C.gray50,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",marginTop:4}}>
                    <div style={{...F.body,fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2}}>Motivo</div>
                    <div style={{...F.body,fontSize:13,color:C.gray700}}>{det.motivo||"—"}</div>
                  </div>
                </div>
                <div style={{textAlign:"right",...F.body,fontSize:11,color:C.gray500,flexShrink:0}}>
                  <div style={{fontWeight:600,color:C.gray700}}>{r.executor||"Sistema"}</div>
                  <div>{r.criado_em?fmtD(r.criado_em):""}</div>
                </div>
              </div>
            </Card>
          );
        })
      }
    </div>
  );
}

function Usuarios(){
  const[users,setUsers]=useState([]);
  const[loading,setLoading]=useState(true);
  const[err,setErr]=useState(null);
  const[show,setShow]=useState(false);
  const[editId,setEditId]=useState(null);
  const[form,setForm]=useState({nome:"",email:"",senha:"",modulos:[]});

  const carregar=()=>{
    setLoading(true);setErr(null);
    apiFetch("/usuarios")
      .then(r=>{if(r.success)setUsers(r.users);})
      .catch(e=>setErr(e.message))
      .finally(()=>setLoading(false));
  };
  useEffect(carregar,[]);

  const GRUPOS=["Principal","Análise","Operações","Sistema"];

  const toggleMod=(m)=>setForm(f=>({...f,modulos:f.modulos.includes(m)?f.modulos.filter(x=>x!==m):[...f.modulos,m]}));
  const toggleGrupo=(grupo)=>{
    const ids=NAV_ITEMS.filter(n=>n.grupo===grupo).map(n=>n.id);
    const allOn=ids.every(id=>form.modulos.includes(id));
    setForm(f=>({...f,modulos:allOn?f.modulos.filter(m=>!ids.includes(m)):[...new Set([...f.modulos,...ids])]}));
  };

  const abrirNovo=()=>{setEditId(null);setForm({nome:"",email:"",senha:"",modulos:[]});setShow(true);};
  const abrirEdit=(u)=>{setEditId(u.id);setForm({nome:u.nome,email:u.email,senha:"",modulos:u.modulos||[]});setShow(true);};

  const salvar=()=>{
    if(!form.nome||!form.email||(!editId&&!form.senha)){alert("Preencha nome, e-mail e senha.");return;}
    const req = editId
      ? apiFetch(`/usuarios/${encodeURIComponent(editId)}`,"PATCH",{nome:form.nome,modulos:form.modulos,...(form.senha?{senha:form.senha}:{})})
      : apiFetch("/usuarios","POST",{nome:form.nome,email:form.email,senha:form.senha,modulos:form.modulos});
    req.then(r=>{if(r.success){setShow(false);carregar();}else alert(r.error||"Erro");})
       .catch(e=>alert(e.message));
  };

  const excluir=(u)=>{
    if(!confirm(`Excluir o acesso de ${u.nome}?`))return;
    apiFetch(`/usuarios/${encodeURIComponent(u.id)}`,"DELETE")
      .then(()=>carregar()).catch(e=>alert(e.message));
  };

  const ini=(nome)=>(nome||"").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  return(
    <div style={{padding:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <PageH title="Usuários" sub="Crie acessos e defina quais módulos cada pessoa enxerga" onRefresh={carregar} refreshing={loading}/>
        <Btn label="Novo acesso" icon="users" onClick={abrirNovo}/>
      </div>

      {loading&&<div style={{...F.body,fontSize:13,color:C.gray500,padding:20}}>Carregando usuários...</div>}
      {err&&<div style={{padding:"12px 16px",background:C.red+"0e",border:`1px solid ${C.red}28`,borderRadius:8,...F.body,fontSize:13,color:C.red,marginBottom:16}}>Erro: {err}</div>}

      {show&&<Card style={{marginBottom:16}}>
        <SecH>{editId?"Editar acesso":"Novo acesso"}</SecH>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,marginBottom:16}}>
          <div>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>Nome do acesso</label>
            <input placeholder="Ex: Analista de Bordado" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>E-mail</label>
            <input placeholder="email@citerol.com.br" value={form.email} disabled={!!editId} onChange={e=>setForm({...form,email:e.target.value})}
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box",background:editId?C.gray100:C.white}}/>
          </div>
          <div>
            <label style={{...F.body,fontSize:10,fontWeight:700,color:C.gray500,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:5}}>{editId?"Nova senha (deixe vazio p/ manter)":"Senha"}</label>
            <input type="password" placeholder="••••••" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})}
              style={{width:"100%",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"9px 12px",...F.body,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
        </div>

        {/* Seleção de módulos por grupo */}
        <div style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Módulos com acesso</div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:16}}>
          {GRUPOS.map(grupo=>{
            const itensGrupo=NAV_ITEMS.filter(n=>n.grupo===grupo);
            const allOn=itensGrupo.every(n=>form.modulos.includes(n.id));
            return(
              <div key={grupo}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{...F.title,fontSize:11,fontWeight:700,color:C.black,letterSpacing:"0.08em"}}>{grupo.toUpperCase()}</span>
                  <button onClick={()=>toggleGrupo(grupo)} style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:4,padding:"2px 8px",...F.body,fontSize:10,color:C.gray500,cursor:"pointer"}}>
                    {allOn?"Desmarcar todos":"Marcar todos"}
                  </button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6}}>
                  {itensGrupo.map(n=>{
                    const on=form.modulos.includes(n.id);
                    return(
                      <div key={n.id} onClick={()=>toggleMod(n.id)}
                        style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderRadius:6,border:`1.5px solid ${on?C.red:C.gray200}`,background:on?C.red+"08":C.white,cursor:"pointer"}}>
                        <div style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${on?C.red:C.gray300}`,background:on?C.red:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          {on&&<Ic n="check" s={11} c={C.white}/>}
                        </div>
                        <Ic n={n.icon} s={14} c={on?C.red:C.gray400}/>
                        <span style={{...F.body,fontSize:12,color:on?C.black:C.gray600,fontWeight:on?600:400}}>{n.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:8}}>
          <Btn label={editId?"Salvar alterações":"Criar acesso"} icon="check" variant="success" onClick={salvar}/>
          <Btn label="Cancelar" variant="secondary" onClick={()=>setShow(false)}/>
        </div>
      </Card>}

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:520}}>
            <thead><tr style={{borderBottom:`2px solid ${C.gray200}`,background:C.gray50}}>
              {["Acesso","E-mail","Módulos","Ações"].map(hd=><th key={hd} style={{padding:"11px 16px",textAlign:"left",...F.body,fontSize:11,color:C.gray500,fontWeight:700,textTransform:"uppercase"}}>{hd}</th>)}
            </tr></thead>
            <tbody>{users.map(u=>(
              <tr key={u.id} style={{borderBottom:`1px solid ${C.gray100}`}}>
                <td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Av ini={ini(u.nome)} size={28}/><span style={{...F.body,fontWeight:600,color:C.black}}>{u.nome}</span></div></td>
                <td style={{padding:"11px 16px",...F.body,color:C.gray500,fontSize:12}}>{u.email}</td>
                <td style={{padding:"11px 16px"}}><Tag label={`${(u.modulos||[]).length} módulo${(u.modulos||[]).length!==1?"s":""}`} color={C.gray600}/></td>
                <td style={{padding:"11px 16px"}}><div style={{display:"flex",gap:6}}>
                  <Btn label="Editar" variant="secondary" size="sm" onClick={()=>abrirEdit(u)}/>
                  <Btn label="Remover" variant="danger" size="sm" onClick={()=>excluir(u)}/>
                </div></td>
              </tr>
            ))}
            {!loading&&users.length===0&&<tr><td colSpan={4} style={{padding:30,textAlign:"center",...F.body,color:C.gray400,fontSize:13}}>Nenhum acesso criado ainda.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── NOTIFICAÇÕES ─────────────────────────────────────────────────────────────
function NotifPanel({notifs,user,onClose}){
  const mine=notifs.filter(n=>n.toUid===user.id);
  return(
    <div style={{position:"fixed",top:56,right:0,width:320,background:C.white,borderLeft:`1px solid ${C.gray200}`,boxShadow:"-4px 8px 24px rgba(0,0,0,0.08)",zIndex:200,maxHeight:"70vh",overflow:"auto"}}>
      <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{...F.title,fontWeight:700,fontSize:12,letterSpacing:"0.1em"}}>NOTIFICAÇÕES</span>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",display:"flex"}}><Ic n="close" s={16} c={C.gray400}/></button>
      </div>
      {mine.length===0?<div style={{padding:28,...F.body,color:C.gray400,fontSize:13,textAlign:"center"}}>Nenhuma notificação.</div>
        :mine.map((n,i)=>(
          <div key={i} style={{padding:"12px 18px",borderBottom:`1px solid ${C.gray100}`,background:n.read?C.white:C.red+"06"}}>
            <div style={{...F.body,fontSize:13,color:C.black,fontWeight:n.read?400:600,lineHeight:1.4}}>{n.text}</div>
            <div style={{...F.body,fontSize:11,color:C.gray400,marginTop:4}}>{n.time} · {n.orderId}</div>
          </div>
        ))
      }
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const[email,setE]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const go=()=>{
    if(!email||!pw){setErr("Preencha e-mail e senha.");return;}
    setLoading(true);setErr("");
    apiFetch("/login","POST",{email,senha:pw})
      .then(r=>{
        if(r.success&&r.user){
          // adiciona ini e admin para o portal
          const nome=r.user.nome||r.user.name||r.user.email||"Usuário";
          const u={...r.user,nome,name:nome,ini:nome.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()};
          onLogin(u);
        }else setErr(r.error||"E-mail ou senha incorretos.");
      })
      .catch(()=>setErr("E-mail ou senha incorretos."))
      .finally(()=>setLoading(false));
  };
  return(
    <div style={{minHeight:"100vh",background:C.gray100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{background:C.white,borderRadius:10,padding:"40px 36px",border:`1px solid ${C.gray200}`}}>
          <div style={{marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <div style={{width:36,height:36,borderRadius:8,background:C.red,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="needle" s={18} c={C.white}/></div>
              <div>
                <div style={{...F.title,fontSize:15,fontWeight:700,color:C.black,letterSpacing:"0.12em"}}>CITEROL</div>
                <div style={{...F.body,fontSize:10,color:C.gray400,letterSpacing:"0.04em"}}>Sistema de Personalizados</div>
              </div>
            </div>
            <h1 style={{...F.title,fontSize:22,fontWeight:700,color:C.black}}>ENTRAR</h1>
            <p style={{...F.body,fontSize:13,color:C.gray500,marginTop:4}}>Acesse sua conta para continuar</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>E-mail</label>
              <input value={email} onChange={e=>setE(e.target.value)} placeholder="seu@email.com"
                style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",...F.body,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div>
              <label style={{...F.body,fontSize:11,fontWeight:700,color:C.gray600,textTransform:"uppercase",letterSpacing:"0.06em",display:"block",marginBottom:6}}>Senha</label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"
                style={{width:"100%",border:`1.5px solid ${C.gray200}`,borderRadius:6,padding:"10px 12px",...F.body,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>
            {err&&<div style={{...F.body,fontSize:12,color:C.red,fontWeight:600}}>{err}</div>}
            <button onClick={go} disabled={loading} style={{background:loading?C.gray400:C.red,color:C.white,border:"none",borderRadius:6,padding:"11px",...F.title,fontSize:14,fontWeight:700,cursor:loading?"wait":"pointer",letterSpacing:"0.06em",marginTop:4}}>{loading?"ENTRANDO...":"ENTRAR"}</button>
          </div>
  
        </div>
      </div>
    </div>
  );
}

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state={hasError:false,msg:""}; }
  static getDerivedStateFromError(error){ return {hasError:true,msg:error?.message||String(error)}; }
  componentDidCatch(error,info){ console.error("SGP crash:",error,info); }
  render(){
    if(this.state.hasError){
      return (
        <div style={{padding:40,fontFamily:"sans-serif",maxWidth:600,margin:"40px auto"}}>
          <h2 style={{color:"#9E0B0F",fontSize:20,marginBottom:12}}>Ops, algo quebrou</h2>
          <p style={{color:"#666",fontSize:14,marginBottom:16}}>Detalhe técnico do erro:</p>
          <pre style={{background:"#f5f5f5",padding:16,borderRadius:8,fontSize:12,overflow:"auto",color:"#9E0B0F"}}>{this.state.msg}</pre>
          <button onClick={()=>{try{sessionStorage.clear();}catch{};window.location.reload();}}
            style={{marginTop:16,background:"#9E0B0F",color:"#fff",border:"none",borderRadius:6,padding:"10px 20px",cursor:"pointer",fontSize:14,fontWeight:700}}>
            Limpar sessão e recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
let _refreshListeners=[];
function triggerRefresh(){ _refreshListeners.forEach(fn=>fn()); }

function AppInner(){
  const isMobile=useIsMobile();
  const[user,setUser]=useState(()=>{
    try{
      const s=sessionStorage.getItem("sgp_user");
      if(!s)return null;
      const u=JSON.parse(s);
      // Migração: se for user da estrutura antiga (sem modulos e sem admin), descarta
      if(!u.modulos&&!u.admin){sessionStorage.removeItem("sgp_user");return null;}
      return u;
    }catch{return null;}
  });
  const doLogin=(u)=>{
    try{sessionStorage.setItem("sgp_user",JSON.stringify(u));}catch{}
    setUser(u);setPage("demandas");
  };
  const doLogout=()=>{
    try{sessionStorage.removeItem("sgp_user");}catch{}
    setUser(null);
  };
  const[page,setPage]=useState("demandas");
  const[orders,setOrders]=useState(ORDERS_INIT);
  const[sel,setSel]=useState(null);
  const[collapsed,setCollapsed]=useState(false);
  const[showN,setShowN]=useState(false);
  const[slaCfg,setSlaCfg]=useState({...SLA_DEF});
  const[notifs,setNotifs]=useState([
    {toUid:7,text:'Ana: "peças chegaram, pode direcionar."',orderId:"PED-2024-001",time:"11/06 09:00",read:false},
    {toUid:3,text:"Rafael: JALECO-P faltantes no WMS.",orderId:"PED-2024-002",time:"13/06 08:20",read:false},
    {toUid:1,text:"PED-2024-004 entrou em Expedição",orderId:"PED-2024-004",time:"15/06 14:00",read:true},
  ]);

  const sendChat=(oid,text,mn)=>{
    const n=new Date();const t=`${n.getDate().toString().padStart(2,"0")}/${(n.getMonth()+1).toString().padStart(2,"0")} ${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}`;
    const upd=o=>o.id===oid?{...o,chat:[...o.chat,{uid:user.id,text,time:t,mn}]}:o;
    setOrders(p=>p.map(upd));setSel(p=>p?.id===oid?upd(p):p);
    mn.forEach(uid=>setNotifs(ns=>[...ns,{toUid:uid,text:`${user.nome||user.name||"Usuário"}: "${text.slice(0,50)}..."`,orderId:oid,time:t,read:false}]));
  };

  const handleAction=async(orderId,tipo,payload)=>{
    // O pedido aberto no modal (vem do HubSpot via Fila/Direcionamento)
    const o = sel && sel.id===orderId ? sel : null;
    if(!o){ setSel(null); return; }
    let resultMsg="";
    // Contexto enviado em toda ação (executor + IDs) para nota e Supabase
    const ctx={
      executor:user?.nome||user?.name||"Sistema",
      executorEmail:user?.email||"",
      vendasId:o.vendasId||null,
      posvendaId:o.posvendaId||null,
      bordadoId:o.bordadoId||null,
      cliente:o.client||"",
      etapa:o.etapa||"",
      prazoFinal:o.prazoFinal||null,
      centroCusto:o.centroCusto||"",
      temBordado:o.temBordado!==false,
    };

    const bordadoId = o.bordadoId;

    try{
      // ── DIRECIONAMENTO ────────────────────────────────────────────────────────
      if(tipo==="direcionamento"){
        if(o.bordadoId&&o.posvendaId){
          await apiFetch(`/direcionamento/${o.posvendaId}`,"PATCH",{
            bordadoId:o.bordadoId,
            destinos:payload.destinos,
            ctx,
          });
        }
      }

      // ── UPLOAD (Programação, Amostra Digital, Amostra Física) ──────────────────
      else if(tipo==="upload"){
        const nextMap={
          "Programação":"Amostra Digital",
          "Amostra Digital":"Aprovação de Amostra Digital",
          "Amostra Física":"Aprovação de Amostra Física",
        };
        const next=nextMap[o.etapa]||o.etapa;
        if(!bordadoId){ alert("Pedido sem negócio de Bordado associado."); return; }
        if(!payload.fileBase64||!payload.propriedade){ alert("Arquivo ou propriedade ausente."); return; }
        const res=await apiFetch(`/upload-etapa/${bordadoId}`,"POST",{
          propriedade:payload.propriedade,
          propMotivo:ETAPA_PROP_MOTIVO[o.etapa]||"",
          fileBase64:payload.fileBase64,
          fileName:payload.fileName,
          novaEtapa:ETAPA_STAGE_ID[next],
          nota:`${o.etapa} → ${next} (arquivo: ${payload.fileName})`,
          ctx,
        });
        if(res.error) throw new Error(res.error);
      }

      // ── ALTERAÇÃO DE FORMULÁRIO (pós-venda) ────────────────────────────────────
      else if(tipo==="alteracao_formulario"){
        if(!bordadoId) throw new Error("Pedido sem negócio de Bordado.");
        const stageDestino=ETAPA_STAGE_ID[payload.novaEtapa];
        if(!stageDestino) throw new Error("Etapa de destino inválida.");
        const res=await apiFetch(`/alteracao-formulario/${bordadoId}`,"PATCH",{
          novaEtapa:stageDestino,
          motivo:payload.motivo,
          ctx,
        });
        if(res.error) throw new Error(res.error);
        resultMsg="Alteração de formulário registrada. Pedido retornado para "+payload.novaEtapa+".";
      }

      // ── APROVAR AMOSTRA (pós-venda) ────────────────────────────────────────────
      else if(tipo==="aprovar_amostra"){
        const next=o.etapa==="Aprovação de Amostra Digital"?"Amostra Física":"Liberado para bordar";
        if(bordadoId&&ETAPA_STAGE_ID[next]){
          await apiFetch(`/mover-etapa/${bordadoId}`,"PATCH",{novaEtapa:ETAPA_STAGE_ID[next],nota:`Amostra aprovada → ${next}`,ctx});
        }
      }

      // ── REPROVAR AMOSTRA (limpa arquivo + volta etapa) ─────────────────────────
      else if(tipo==="reprovar_amostra"){
        const voltaMap={
          "Aprovação de Amostra Digital":"Amostra Digital",
          "Aprovação de Amostra Física":"Amostra Física",
        };
        const volta=voltaMap[o.etapa]||"Amostra Digital";
        const propVolta=ETAPA_PROPRIEDADE[volta];
        const propMotivo=ETAPA_PROP_MOTIVO[volta];
        if(bordadoId&&ETAPA_STAGE_ID[volta]){
          await apiFetch(`/reprovar/${bordadoId}`,"PATCH",{
            propriedade:propVolta,
            propMotivo:propMotivo,
            motivo:payload.obs||"",
            novaEtapa:ETAPA_STAGE_ID[volta],
            ctx,
          });
        }
      }

      // ── CONCLUSÃO DE BORDADO (interno/externo, aguarda ambos) ──────────────────
      else if(tipo==="mover"&&(o.etapa==="Bordado Interno"||o.etapa==="Bordado Externo"||o.etapa==="Bordado Interno e Externo")){
        if(!bordadoId) throw new Error("Pedido sem negócio de Bordado.");
        // O lado depende de qual fila/etapa o operador está
        const lado=payload.lado||(o.etapa==="Bordado Externo"?"externo":"interno");
        const res=await apiFetch(`/concluir-bordado/${bordadoId}`,"PATCH",{lado,ctx});
        if(res.error) throw new Error(res.error);
        // Monta a mensagem de retorno conforme o resultado
        if(res.totalmenteConcluido){
          resultMsg=res.posVendaMovido
            ? "Bordado finalizado! Ambos os lados concluídos. O pedido foi enviado para Expedição."
            : "Bordado finalizado! Ambos os lados concluídos.";
        }else{
          const falta=lado==="interno"?"externo":"interno";
          resultMsg=`Lado ${lado} concluído! Aguardando o lado ${falta} para finalizar e enviar à Expedição.`;
        }
      }

      // ── MOVIMENTAÇÃO PÓS-VENDA (Expedição → Faturamento → Faturado) ────────────
      else if(tipo==="mover"&&(o.etapa==="Expedição"||o.etapa==="Faturamento")){
        if(!o.posvendaId) throw new Error("Pedido sem negócio de Pós-venda.");
        const stageMap={
          "Expedição":"1377587761",   // Análise de frete
          "Faturamento":"1377587762", // Faturado
        };
        const novaEtapa=stageMap[o.etapa];
        await apiFetch(`/mover-posvenda/${o.posvendaId}`,"PATCH",{novaEtapa,nota:`${o.etapa} concluída`,ctx});
        resultMsg=o.etapa==="Expedição"
          ?"Pedido enviado para Faturamento."
          :"Pedido faturado! Processo de pós-venda concluído.";
      }

      // ── MOVIMENTAÇÃO SIMPLES (fallback) ────────────────────────────────────────
      else if(tipo==="mover"){
        const nextMap={};
        const next=nextMap[o.etapa]||o.etapa;
        if(bordadoId&&ETAPA_STAGE_ID[next]){
          await apiFetch(`/mover-etapa/${bordadoId}`,"PATCH",{novaEtapa:ETAPA_STAGE_ID[next],nota:`${o.etapa} → ${next}`,ctx});
        }
      }

    }catch(e){
      alert("Erro ao processar: "+e.message);
      console.error("handleAction:",e);
      throw e; // propaga para o botão não marcar como concluído
    }

    // Sucesso — recarrega as filas. NÃO fecha o modal aqui:
    // o botão exibe a tela de pós-execução com a mensagem.
    setTimeout(()=>triggerRefresh(),900);
    return resultMsg||"O pedido foi movimentado com sucesso.";
  };

  const TITLES={
    demandas:"Minhas Demandas",dashboard:"Dashboard",funil:"Funil em Tempo Real",
    gerencial:"Gerencial",historico:"Histórico",ranking:"Ranking / Premiação",
    pedidos:"Todos os Pedidos",direcionamento:"Direcionamento",
    programacao:"Programação",amostra_digital:"Amostra Digital",amostra_fisica:"Amostra Física",
    bordado_interno:"Bordado Interno",bordado_externo:"Bordado Externo",
    expedicao:"Expedição",faturamento:"Faturamento",finalizados:"Finalizados",alteracoes_form:"Alterações de Formulário",sla:"Configurar SLA",usuarios:"Usuários",
  };
  const nav=id=>{setPage(id);setShowN(false);};

  if(!user)return <Login onLogin={doLogin}/>;

  return(
    <div style={{display:"flex",height:"100dvh",...F.body,background:C.gray100,overflow:"hidden",flexDirection:"column"}}>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {!isMobile&&<Sidebar user={user} active={page} onNav={nav} collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)}/>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <Topbar user={user} title={TITLES[page]||""} notifs={notifs} onBell={()=>setShowN(!showN)} onLogout={doLogout} isMobile={isMobile}/>
          {showN&&<NotifPanel notifs={notifs} user={user} onClose={()=>setShowN(false)}/>}
          <div className="sgp-scroll" style={{flex:1,overflowY:"auto",paddingBottom:isMobile?70:0}}>
            {page==="demandas"&&<MinhasDemandas user={user} orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="dashboard"&&<Dashboard orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="funil"&&<Funil orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="gerencial"&&<Gerencial isMobile={isMobile}/>}
            {page==="historico"&&<Historico hist={HIST} onOpen={setSel}/>}
            {page==="ranking"&&<Ranking hist={HIST}/>}
            {page==="pedidos"&&<Dashboard orders={orders} onOpen={setSel} slaCfg={slaCfg}/>}
            {page==="direcionamento"&&<Direcionamento orders={orders} setOrders={setOrders} onOpen={setSel} slaCfg={slaCfg} user={user}/>}
            {page==="programacao"&&<Fila title="Programação de Bordado" etapa="Programação" endpoint="/programacao" orders={orders} onOpen={setSel} actionLabel="Marcar como programado" actionColor={C.amber} slaCfg={slaCfg}/>}
            {page==="amostra_digital"&&<Fila title="Amostra Digital" etapa="Amostra Digital" endpoint="/amostra-digital" orders={orders} onOpen={setSel} actionLabel="Enviar amostra" actionColor={C.purple} slaCfg={slaCfg}/>}
            {page==="amostra_fisica"&&<Fila title="Amostra Física" etapa="Amostra Física" endpoint="/amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Notificar vendedor" actionColor="#be185d" slaCfg={slaCfg}/>}
            {page==="aprovacao_amostra_digital"&&<Fila title="Aprovação de Amostra Digital" etapa="Aprovação de Amostra Digital" endpoint="/aprovacao-amostra-digital" orders={orders} onOpen={setSel} actionLabel="Aprovar/Reprovar" actionColor={C.blue} slaCfg={slaCfg}/>}
            {page==="aprovacao_amostra_fisica"&&<Fila title="Aprovação de Amostra Física" etapa="Aprovação de Amostra Física" endpoint="/aprovacao-amostra-fisica" orders={orders} onOpen={setSel} actionLabel="Aprovar/Reprovar" actionColor={C.blue} slaCfg={slaCfg}/>}
            {page==="bordado_interno"&&<Fila title="Bordado Interno" etapa="Bordado Interno" endpoint="/bordado-interno" orders={orders} onOpen={setSel} actionLabel="Bordado concluído" actionColor={C.green} slaCfg={slaCfg}/>}
            {page==="bordado_externo"&&<Fila title="Bordado Externo" etapa="Bordado Externo" endpoint="/bordado-externo" orders={orders} onOpen={setSel} actionLabel="Registrar retorno" actionColor={C.purple} slaCfg={slaCfg}/>}
            {page==="expedicao"&&<Fila title="Expedição" etapa="Expedição" endpoint="/expedicao" orders={orders} onOpen={setSel} actionLabel="Enviar p/ faturamento" actionColor={C.teal} slaCfg={slaCfg}/>}
            {page==="faturamento"&&<Fila title="Faturamento" etapa="Faturamento" endpoint="/faturamento" orders={orders} onOpen={setSel} actionLabel="Faturar pedido" actionColor={C.green} slaCfg={slaCfg}/>}
            {page==="finalizados"&&<Fila title="Finalizados" etapa="Finalizado" endpoint="/finalizados" orders={orders} onOpen={setSel} slaCfg={slaCfg} finalizado/>}
            {page==="alteracoes_form"&&<AlteracoesFormList/>}
            {page==="sla"&&<SLAConfig slaCfg={slaCfg} onSave={setSlaCfg}/>}
            {page==="usuarios"&&<Usuarios/>}
          </div>
        </div>
      </div>
      {isMobile&&<BottomNav user={user} active={page} onNav={nav}/>}
      {sel&&<OrderModal order={sel} me={user} onClose={()=>setSel(null)} onSendChat={sendChat} onAction={handleAction} isMobile={isMobile} slaCfg={slaCfg}/>}
    </div>
  );
}

export default function App(){
  return <ErrorBoundary><AppInner/></ErrorBoundary>;
}
