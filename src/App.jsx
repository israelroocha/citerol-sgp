import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── TOKENS ─────────────────────────────────────────────────────────────────
const C = {
  red:"#9E0B0F",green:"#4B5528",black:"#111",
  gray900:"#1a1a1a",gray800:"#2a2a2a",gray700:"#3a3a3a",
  gray600:"#555",gray500:"#666",gray400:"#888",gray300:"#aaa",
  gray200:"#ddd",gray100:"#f2f2f2",white:"#fff",
  amber:"#d97706",blue:"#1d4ed8",teal:"#0d9488",purple:"#7c3aed",
};
const SC = {
  "Programação":C.amber,"Amostra Digital":"#8b5cf6","Amostra Física":"#ec4899",
  "Separação":C.blue,"Direcionamento":"#0891b2",
  "Bordado Interno":C.green,"Bordado Externo":C.purple,
  "Expedição":C.teal,"Faturamento":C.green,
};
const PIE_COLORS=[C.red,C.green,C.amber,C.blue,C.purple];

// ─── SLA PADRÃO (horas) ──────────────────────────────────────────────────────
const SLA_DEFAULTS = {
  "Programação":8,"Amostra Digital":16,"Amostra Física":24,
  "Separação":48,"Direcionamento":4,
  "Bordado Interno":72,"Bordado Externo":120,
  "Expedição":8,"Faturamento":4,
};

// ─── USERS ──────────────────────────────────────────────────────────────────
const USERS=[
  {id:1,name:"Israel Rocha",     email:"israel@citerol.com.br",  role:"superadmin",     avatar:"IR",password:"admin123"},
  {id:2,name:"Leidiane Silva",   email:"leidiane@citerol.com.br",role:"supervisao",     avatar:"LS",password:"123456"},
  {id:3,name:"Ana Pós-venda",    email:"ana@citerol.com.br",     role:"posvenda",       avatar:"AP",password:"123456"},
  {id:4,name:"Carlos Programador",email:"carlos@citerol.com.br", role:"programador",    avatar:"CP",password:"123456"},
  {id:5,name:"Julia Digital",    email:"julia@citerol.com.br",   role:"amostra_digital",avatar:"JD",password:"123456"},
  {id:6,name:"Marcos Físico",    email:"marcos@citerol.com.br",  role:"amostra_fisica", avatar:"MF",password:"123456"},
  {id:7,name:"Rafael Direcionador",email:"rafael@citerol.com.br",role:"direcionador",   avatar:"RD",password:"123456"},
  {id:8,name:"Pedro Bordado",    email:"pedro@citerol.com.br",   role:"bordado_interno",avatar:"PB",password:"123456"},
  {id:9,name:"Fernanda Externo", email:"fernanda@citerol.com.br",role:"bordado_externo",avatar:"FE",password:"123456"},
  {id:10,name:"Thiago Expedição",email:"thiago@citerol.com.br",  role:"expedicao",      avatar:"TE",password:"123456"},
  {id:11,name:"Camila Fat.",     email:"camila@citerol.com.br",  role:"faturamento",    avatar:"CF",password:"123456"},
];
const ROLE_LABELS={
  superadmin:"Super Admin",supervisao:"Supervisão",posvenda:"Pós-venda",
  programador:"Programador de Bordado",amostra_digital:"Amostra Digital",
  amostra_fisica:"Amostra Física",direcionador:"Direcionador de Bordado",
  bordado_interno:"Bordado Interno",bordado_externo:"Bordado Externo",
  expedicao:"Expedição",faturamento:"Faturamento",
};
const ROLE_ETAPAS={
  programador:["Programação"],amostra_digital:["Amostra Digital"],
  amostra_fisica:["Amostra Física"],direcionador:["Direcionamento"],
  bordado_interno:["Bordado Interno"],bordado_externo:["Bordado Externo"],
  expedicao:["Expedição"],faturamento:["Faturamento"],
  posvenda:Object.keys(SLA_DEFAULTS),
  supervisao:Object.keys(SLA_DEFAULTS),
  superadmin:Object.keys(SLA_DEFAULTS),
};
const NAV_BY_ROLE={
  superadmin:["demandas","dashboard","funil","gerencial","historico","ranking","pedidos","direcionamento","programacao","amostra_digital","amostra_fisica","bordado_interno","bordado_externo","expedicao","faturamento","sla","usuarios"],
  supervisao:["demandas","dashboard","funil","gerencial","historico","ranking","pedidos","direcionamento","programacao","amostra_digital","amostra_fisica","bordado_interno","bordado_externo","expedicao","faturamento","sla"],
  posvenda:["demandas","dashboard","funil","pedidos"],
  programador:["demandas"],amostra_digital:["demandas"],amostra_fisica:["demandas"],
  direcionador:["demandas","direcionamento"],bordado_interno:["demandas"],
  bordado_externo:["demandas"],expedicao:["demandas"],faturamento:["demandas"],
};
const NAV_META={
  demandas:{label:"Minhas Demandas",icon:"📌"},dashboard:{label:"Dashboard",icon:"⬛"},
  funil:{label:"Funil em Tempo Real",icon:"🔄"},gerencial:{label:"Gerencial",icon:"📊"},
  historico:{label:"Histórico",icon:"📅"},ranking:{label:"Ranking / Premiação",icon:"🏆"},
  pedidos:{label:"Todos os Pedidos",icon:"📋"},programacao:{label:"Programação",icon:"🧵"},
  amostra_digital:{label:"Amostra Digital",icon:"💻"},amostra_fisica:{label:"Amostra Física",icon:"🪡"},
  direcionamento:{label:"Direcionamento",icon:"↗️"},bordado_interno:{label:"Bordado Interno",icon:"🟢"},
  bordado_externo:{label:"Bordado Externo",icon:"🟣"},expedicao:{label:"Expedição",icon:"📦"},
  faturamento:{label:"Faturamento",icon:"💰"},sla:{label:"Config. SLA",icon:"⚙️"},
  usuarios:{label:"Usuários",icon:"👥"},
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const now = Date.now();
const h = (n) => n * 3600000;
const d = (n) => n * 86400000;

function mkTL(stages) {
  return stages.map((s,i) => ({
    stage:s.stage, user:s.user,
    enteredAt: new Date(now - s.ago).toISOString(),
    exitedAt: s.exitAgo != null ? new Date(now - s.exitAgo).toISOString() : null,
    durationH: s.exitAgo != null ? ((s.ago - s.exitAgo)/3600000) : null,
  }));
}

const ORDERS_INIT = [
  {
    id:"PED-2024-001",client:"Grupo Construção ABC",vendedor:"Marcos Vendas",responsavel:"Pedro Bordado",
    cnpj:"11.875.373/0001-22",telefone:"(11) 98765-4321",email:"compras@grupoabc.com.br",
    valorPedido:8450,prazoFinal: new Date(now + d(3)).toISOString(),
    observacoes:"Bordado em alto relevo. Fio poliéster pantone 485.",
    etapa:"Bordado Interno",amostrasAprovada:true,separacaoCompleta:true,
    dataEntrada: new Date(now - d(6)).toISOString(),
    etapaEntradaAt: new Date(now - h(20)).toISOString(),
    alertas:[],concluido:false,dataConclusao:null,
    bordado:{pontos:12400,cores:["Branco","Vermelho P.485","Preto"],arquivo:"logo_grupoabc_v3.emb",arquivoAprovado:true,
      amostrasDigital:[{nome:"amostra_digital_v1.png",data:"10/06 14:30",aprovado:true}],amostrasDigitalObs:"Aprovada.",
      amostrasiFisica:[{nome:"amostra_fisica_001.jpg",data:"11/06 09:00",aprovado:true}],amostrasiFisicaObs:"Aprovada."},
    items:[
      {sku:"CAM-POLO-P",desc:"Camisa Polo",cor:"Azul Marinho",qty:15,dest:"interno",status:"bordando"},
      {sku:"CAM-POLO-M",desc:"Camisa Polo",cor:"Azul Marinho",qty:22,dest:"externo",status:"aguardando"},
      {sku:"CAM-POLO-G",desc:"Camisa Polo",cor:"Azul Marinho",qty:8,dest:null,status:"separado"},
    ],
    timeline:mkTL([
      {stage:"Pós-venda",user:"Ana Pós-venda",ago:d(6),exitAgo:d(6)-h(1.2)},
      {stage:"Amostra Digital",user:"Julia Digital",ago:d(6)-h(1.2),exitAgo:d(6)-h(6.6)},
      {stage:"Amostra Física",user:"Marcos Físico",ago:d(6)-h(6.6),exitAgo:d(6)-h(14.7)},
      {stage:"Separação",user:"WMS Auto",ago:d(6)-h(14.7),exitAgo:d(6)-h(27)},
      {stage:"Direcionamento",user:"Rafael Direcionador",ago:d(6)-h(27),exitAgo:h(20)},
      {stage:"Bordado Interno",user:"Pedro Bordado",ago:h(20),exitAgo:null},
    ]),
    chat:[
      {userId:3,text:"Pedido recebido, iniciando amostra.",time:"10/06 08:15",mentions:[]},
      {userId:5,text:"Amostra digital finalizada.",time:"10/06 13:40",mentions:[]},
    ],
  },
  {
    id:"PED-2024-002",client:"Hospital São Lucas",vendedor:"Beatriz Vendas",responsavel:"Rafael Direcionador",
    cnpj:"22.445.891/0001-55",telefone:"(11) 3344-5566",email:"suprimentos@saolucas.com.br",
    valorPedido:15200,prazoFinal: new Date(now + d(1)).toISOString(),
    observacoes:"Bordado padrão hospitalar. Não usar fio metálico.",
    etapa:"Direcionamento",amostrasAprovada:false,separacaoCompleta:false,
    dataEntrada: new Date(now - d(4)).toISOString(),
    etapaEntradaAt: new Date(now - h(30)).toISOString(),
    alertas:["Peças faltantes: JALECO-P (30 un)","Amostra não aprovada"],concluido:false,dataConclusao:null,
    bordado:{pontos:8900,cores:["Branco","Azul Royal"],arquivo:"logo_saolucas_v1.emb",arquivoAprovado:false,
      amostrasDigital:[{nome:"amostra_digital_v1.png",data:"13/06 10:00",aprovado:false}],amostrasDigitalObs:"Aguardando cliente.",
      amostrasiFisica:[],amostrasiFisicaObs:""},
    items:[
      {sku:"JALECO-P",desc:"Jaleco Manga Longa",cor:"Branco",qty:30,dest:null,status:"faltante"},
      {sku:"JALECO-M",desc:"Jaleco Manga Longa",cor:"Branco",qty:45,dest:null,status:"separado"},
      {sku:"CALCA-M",desc:"Calça Scrub",cor:"Azul",qty:45,dest:"interno",status:"separado"},
    ],
    timeline:mkTL([
      {stage:"Pós-venda",user:"Ana Pós-venda",ago:d(4),exitAgo:d(4)-h(2)},
      {stage:"Programação",user:"Carlos Programador",ago:d(4)-h(2),exitAgo:d(4)-h(8.5)},
      {stage:"Amostra Digital",user:"Julia Digital",ago:d(4)-h(8.5),exitAgo:h(30)},
      {stage:"Direcionamento",user:"Rafael Direcionador",ago:h(30),exitAgo:null},
    ]),
    chat:[
      {userId:3,text:"Cliente novo, iniciando programação.",time:"12/06 10:10",mentions:[]},
      {userId:7,text:"@Ana JALECO-P com 30 un faltantes.",time:"13/06 08:20",mentions:[3]},
    ],
  },
  {
    id:"PED-2024-003",client:"Prefeitura Municipal",vendedor:"Roberto Vendas",responsavel:"Fernanda Externo",
    cnpj:"33.112.004/0001-77",telefone:"(11) 4455-6677",email:"licitacao@prefeitura.gov.br",
    valorPedido:22800,prazoFinal: new Date(now - d(1)).toISOString(),
    observacoes:"Pedido licitatório. Documentação obrigatória.",
    etapa:"Bordado Externo",amostrasAprovada:true,separacaoCompleta:true,
    dataEntrada: new Date(now - d(9)).toISOString(),
    etapaEntradaAt: new Date(now - h(50)).toISOString(),
    alertas:[],concluido:false,dataConclusao:null,
    bordado:{pontos:15600,cores:["Dourado","Verde"],arquivo:"brasao_prefeitura_v2.emb",arquivoAprovado:true,
      amostrasDigital:[{nome:"amostra_digital_v2.png",data:"08/06 15:00",aprovado:true}],amostrasDigitalObs:"Aprovada.",
      amostrasiFisica:[{nome:"amostra_fisica_003.jpg",data:"09/06 11:00",aprovado:true}],amostrasiFisicaObs:"Aprovada."},
    items:[
      {sku:"COLETE-P",desc:"Colete Funcional",cor:"Cinza",qty:20,dest:"externo",status:"bordando"},
      {sku:"COLETE-M",desc:"Colete Funcional",cor:"Cinza",qty:35,dest:"externo",status:"bordando"},
      {sku:"COLETE-G",desc:"Colete Funcional",cor:"Cinza",qty:15,dest:"externo",status:"pronto"},
    ],
    timeline:mkTL([
      {stage:"Pós-venda",user:"Ana Pós-venda",ago:d(9),exitAgo:d(9)-h(0.5)},
      {stage:"Separação",user:"WMS Auto",ago:d(9)-h(0.5),exitAgo:d(9)-h(10.5)},
      {stage:"Direcionamento",user:"Rafael Direcionador",ago:d(9)-h(10.5),exitAgo:h(50)},
      {stage:"Bordado Externo",user:"Fernanda Externo",ago:h(50),exitAgo:null},
    ]),
    chat:[{userId:3,text:"Cliente recorrente, direto para separação.",time:"08/06 09:05",mentions:[]}],
  },
  {
    id:"PED-2024-004",client:"Banco Meridional",vendedor:"Carla Vendas",responsavel:"Thiago Expedição",
    cnpj:"44.789.321/0001-11",telefone:"(11) 5566-7788",email:"uniforme@bancomeridional.com.br",
    valorPedido:6300,prazoFinal: new Date(now + d(2)).toISOString(),
    observacoes:"Camisa social feminina. Bordado sutil no bolso.",
    etapa:"Expedição",amostrasAprovada:true,separacaoCompleta:true,
    dataEntrada: new Date(now - d(12)).toISOString(),
    etapaEntradaAt: new Date(now - h(5)).toISOString(),
    alertas:[],concluido:false,dataConclusao:null,
    bordado:{pontos:3200,cores:["Dourado Champagne"],arquivo:"logo_meridional_v4.emb",arquivoAprovado:true,
      amostrasDigital:[{nome:"amostra_digital_v1.png",data:"05/06 14:00",aprovado:true}],amostrasDigitalObs:"Aprovada.",
      amostrasiFisica:[{nome:"amostra_fisica_004.jpg",data:"06/06 10:00",aprovado:true}],amostrasiFisicaObs:"Aprovada."},
    items:[
      {sku:"CAMISA-OF-P",desc:"Camisa Social Feminina",cor:"Branco",qty:12,dest:"interno",status:"pronto"},
      {sku:"CAMISA-OF-M",desc:"Camisa Social Feminina",cor:"Branco",qty:18,dest:"interno",status:"pronto"},
    ],
    timeline:mkTL([
      {stage:"Pós-venda",user:"Ana Pós-venda",ago:d(12),exitAgo:d(12)-h(1)},
      {stage:"Amostra Digital",user:"Julia Digital",ago:d(12)-h(1),exitAgo:d(12)-h(5)},
      {stage:"Amostra Física",user:"Marcos Físico",ago:d(12)-h(5),exitAgo:d(12)-h(12.5)},
      {stage:"Separação",user:"WMS Auto",ago:d(12)-h(12.5),exitAgo:d(12)-h(23.5)},
      {stage:"Direcionamento",user:"Rafael Direcionador",ago:d(12)-h(23.5),exitAgo:d(12)-h(24.2)},
      {stage:"Bordado Interno",user:"Pedro Bordado",ago:d(12)-h(24.2),exitAgo:h(5)},
      {stage:"Expedição",user:"Thiago Expedição",ago:h(5),exitAgo:null},
    ]),
    chat:[{userId:10,text:"Recebido, embalagem em andamento.",time:"15/06 14:00",mentions:[]}],
  },
  {
    id:"PED-2024-005",client:"Clínica Vita Saúde",vendedor:"Marcos Vendas",responsavel:"Camila Fat.",
    cnpj:"55.001.234/0001-99",telefone:"(11) 6677-8899",email:"admin@vitasaude.com.br",
    valorPedido:11700,prazoFinal: new Date(now - d(2)).toISOString(),
    observacoes:"Scrub unissex. Bordado no peito e costas.",
    etapa:"Faturamento",amostrasAprovada:true,separacaoCompleta:true,
    dataEntrada: new Date(now - d(14)).toISOString(),
    etapaEntradaAt: new Date(now - h(2)).toISOString(),
    alertas:[],concluido:false,dataConclusao:null,
    bordado:{pontos:9800,cores:["Verde Musgo","Branco"],arquivo:"logo_vita_v2.emb",arquivoAprovado:true,
      amostrasDigital:[{nome:"amostra_digital_v2.png",data:"03/06 16:00",aprovado:true}],amostrasDigitalObs:"Aprovada.",
      amostrasiFisica:[{nome:"amostra_fisica_005.jpg",data:"04/06 09:00",aprovado:true}],amostrasiFisicaObs:"Aprovada."},
    items:[
      {sku:"SCRUB-P",desc:"Scrub Unissex Azul",cor:"Azul",qty:25,dest:"interno",status:"pronto"},
      {sku:"SCRUB-M",desc:"Scrub Unissex Azul",cor:"Azul",qty:40,dest:"interno",status:"pronto"},
    ],
    timeline:mkTL([
      {stage:"Pós-venda",user:"Ana Pós-venda",ago:d(14),exitAgo:d(14)-h(0.8)},
      {stage:"Separação",user:"WMS Auto",ago:d(14)-h(0.8),exitAgo:d(14)-h(10.3)},
      {stage:"Direcionamento",user:"Rafael Direcionador",ago:d(14)-h(10.3),exitAgo:d(14)-h(10.9)},
      {stage:"Bordado Interno",user:"Pedro Bordado",ago:d(14)-h(10.9),exitAgo:d(14)-h(30.9)},
      {stage:"Expedição",user:"Thiago Expedição",ago:d(14)-h(30.9),exitAgo:h(2)},
      {stage:"Faturamento",user:"Camila Fat.",ago:h(2),exitAgo:null},
    ]),
    chat:[],
  },
];

// Histórico de pedidos concluídos (mock)
const HISTORICO_INIT = [
  {id:"PED-2024-H01",client:"TechCorp Ltda",vendedor:"Marcos Vendas",responsavel:"Pedro Bordado",valorPedido:5200,etapa:"Concluído",amostrasAprovada:true,separacaoCompleta:true,dataEntrada:new Date(now-d(30)).toISOString(),dataConclusao:new Date(now-d(22)).toISOString(),prazoFinal:new Date(now-d(20)).toISOString(),concluido:true,alertas:[],tempoTotal:8*24,cumpriunSLA:true,bordado:{pontos:6000,cores:["Azul"],arquivo:"logo.emb",arquivoAprovado:true,amostrasDigital:[{nome:"ad.png",data:"",aprovado:true}],amostrasDigitalObs:"",amostrasiFisica:[{nome:"af.jpg",data:"",aprovado:true}],amostrasiFisicaObs:""},items:[{sku:"CAM-P",desc:"Camisa",cor:"Azul",qty:20,dest:"interno",status:"pronto"}],timeline:[],chat:[]},
  {id:"PED-2024-H02",client:"Indústria Forte",vendedor:"Carla Vendas",responsavel:"Fernanda Externo",valorPedido:18400,etapa:"Concluído",amostrasAprovada:true,separacaoCompleta:true,dataEntrada:new Date(now-d(28)).toISOString(),dataConclusao:new Date(now-d(18)).toISOString(),prazoFinal:new Date(now-d(16)).toISOString(),concluido:true,alertas:[],tempoTotal:10*24,cumpriunSLA:false,bordado:{pontos:11000,cores:["Preto"],arquivo:"logo2.emb",arquivoAprovado:true,amostrasDigital:[{nome:"ad2.png",data:"",aprovado:true}],amostrasDigitalObs:"",amostrasiFisica:[{nome:"af2.jpg",data:"",aprovado:true}],amostrasiFisicaObs:""},items:[{sku:"COLETE-P",desc:"Colete",cor:"Preto",qty:50,dest:"externo",status:"pronto"},{sku:"COLETE-M",desc:"Colete",cor:"Preto",qty:60,dest:"externo",status:"pronto"}],timeline:[],chat:[]},
  {id:"PED-2024-H03",client:"Escola Municipal",vendedor:"Roberto Vendas",responsavel:"Pedro Bordado",valorPedido:3800,etapa:"Concluído",amostrasAprovada:true,separacaoCompleta:true,dataEntrada:new Date(now-d(25)).toISOString(),dataConclusao:new Date(now-d(19)).toISOString(),prazoFinal:new Date(now-d(18)).toISOString(),concluido:true,alertas:[],tempoTotal:6*24,cumpriunSLA:true,bordado:{pontos:4500,cores:["Verde"],arquivo:"logo3.emb",arquivoAprovado:true,amostrasDigital:[],amostrasDigitalObs:"",amostrasiFisica:[],amostrasiFisicaObs:""},items:[{sku:"CAM-M",desc:"Camisa",cor:"Verde",qty:30,dest:"interno",status:"pronto"}],timeline:[],chat:[]},
  {id:"PED-2024-H04",client:"Clínica Norte",vendedor:"Beatriz Vendas",responsavel:"Thiago Expedição",valorPedido:9100,etapa:"Concluído",amostrasAprovada:true,separacaoCompleta:true,dataEntrada:new Date(now-d(20)).toISOString(),dataConclusao:new Date(now-d(12)).toISOString(),prazoFinal:new Date(now-d(14)).toISOString(),concluido:true,alertas:[],tempoTotal:8*24,cumpriunSLA:true,bordado:{pontos:7200,cores:["Branco"],arquivo:"logo4.emb",arquivoAprovado:true,amostrasDigital:[{nome:"ad4.png",data:"",aprovado:true}],amostrasDigitalObs:"",amostrasiFisica:[{nome:"af4.jpg",data:"",aprovado:true}],amostrasiFisicaObs:""},items:[{sku:"SCRUB-P",desc:"Scrub",cor:"Branco",qty:40,dest:"interno",status:"pronto"},{sku:"SCRUB-M",desc:"Scrub",cor:"Branco",qty:35,dest:"interno",status:"pronto"}],timeline:[],chat:[]},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useIsMobile(){
  const [m,setM]=useState(typeof window!=="undefined"&&window.innerWidth<768);
  useEffect(()=>{const f=()=>setM(window.innerWidth<768);window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);
  return m;
}
function fmtDate(iso){if(!iso)return"—";return new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"});}
function fmtDateShort(iso){if(!iso)return"—";return new Date(iso).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});}
function fmtCurrency(v){return"R$ "+Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2});}
function hoursInStage(enteredAt){return(Date.now()-new Date(enteredAt).getTime())/3600000;}
function getSLAStatus(order,slaConfig){
  const sla=slaConfig[order.etapa];
  const hrs=hoursInStage(order.etapaEntradaAt);
  const pctStage=sla?hrs/sla:0;
  const prazoFinal=new Date(order.prazoFinal).getTime();
  const hoursToDeadline=(prazoFinal-Date.now())/3600000;
  let stageStatus="ok";
  if(pctStage>=1) stageStatus="late";
  else if(pctStage>=0.8) stageStatus="risk";
  let finalStatus="ok";
  if(hoursToDeadline<0) finalStatus="late";
  else if(hoursToDeadline<24) finalStatus="risk";
  return{stageStatus,finalStatus,hrsInStage:hrs,slaHrs:sla,pctStage,hoursToDeadline};
}

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
function Avatar({initials,size=32,color=C.red}){return <div style={{width:size,height:size,borderRadius:"50%",background:color,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:700,flexShrink:0}}>{initials}</div>;}
function Badge({label,color=C.gray600,bg=C.gray100}){return <span style={{background:bg,color,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600,display:"inline-block"}}>{label}</span>;}
function Card({children,style={},onClick}){return <div onClick={onClick} style={{background:C.white,borderRadius:10,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",border:`1px solid ${C.gray200}`,cursor:onClick?"pointer":"default",...style}}>{children}</div>;}
function SecTitle({children,style={}}){return <div style={{fontFamily:"Oswald,sans-serif",fontSize:12,fontWeight:700,color:C.gray500,letterSpacing:0.8,textTransform:"uppercase",marginBottom:10,...style}}>{children}</div>;}
function AlertBadge({text}){return <div style={{background:"#fff3cd",border:`1px solid ${C.amber}`,borderRadius:6,padding:"4px 10px",fontSize:12,color:"#92400e",display:"inline-flex",alignItems:"center",gap:6}}>⚠️ {text}</div>;}
function EtapaBadge({etapa}){const c=SC[etapa]||C.gray600;return <span style={{background:c+"22",color:c,border:`1px solid ${c}44`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{etapa}</span>;}

function SLABar({pct,status}){
  const color=status==="late"?C.red:status==="risk"?C.amber:C.green;
  return(
    <div style={{background:C.gray100,borderRadius:4,height:6,overflow:"hidden",flex:1}}>
      <div style={{height:"100%",width:`${Math.min(pct*100,100)}%`,background:color,borderRadius:4,transition:"width 0.3s"}}/>
    </div>
  );
}

function SLABadge({stageStatus,finalStatus,hrsInStage,slaHrs,hoursToDeadline}){
  const st=stageStatus==="late"?"🔴 Etapa atrasada":stageStatus==="risk"?"🟡 Etapa em risco":"🟢 No prazo";
  const ft=finalStatus==="late"?"🔴 Prazo final vencido":finalStatus==="risk"?"🟡 Prazo final próximo":"";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <div style={{fontSize:11,fontWeight:600,color:stageStatus==="late"?C.red:stageStatus==="risk"?C.amber:C.green}}>{st} {slaHrs?`(${hrsInStage.toFixed(0)}h/${slaHrs}h)`:""}</div>
      {ft&&<div style={{fontSize:11,fontWeight:600,color:finalStatus==="late"?C.red:C.amber}}>{ft}</div>}
    </div>
  );
}

function StatCard({label,value,sub,color=C.red,icon}){
  return(
    <Card style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:11,color:C.gray400,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{label}</span>
        <span style={{fontSize:20}}>{icon}</span>
      </div>
      <div style={{fontSize:28,fontWeight:800,fontFamily:"Oswald,sans-serif",color}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:C.gray400}}>{sub}</div>}
    </Card>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const[email,setE]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");
  const go=()=>{const u=USERS.find(x=>x.email===email&&x.password===pw);u?onLogin(u):setErr("E-mail ou senha incorretos.");};
  return(
    <div style={{minHeight:"100vh",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontFamily:"Oswald,sans-serif",fontSize:30,fontWeight:700,color:C.white,letterSpacing:3,textTransform:"uppercase"}}>CITEROL</div>
          <div style={{width:40,height:3,background:C.red,margin:"10px auto"}}/>
          <div style={{fontSize:12,color:C.gray400,letterSpacing:1}}>SISTEMA DE PERSONALIZADOS</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input placeholder="E-mail" value={email} onChange={e=>setE(e.target.value)} style={{background:"#1e1e1e",border:"1px solid #3a3a3a",borderRadius:8,padding:"13px 16px",color:C.white,fontSize:15,outline:"none"}}/>
          <input placeholder="Senha" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{background:"#1e1e1e",border:"1px solid #3a3a3a",borderRadius:8,padding:"13px 16px",color:C.white,fontSize:15,outline:"none"}}/>
          {err&&<div style={{color:"#f87171",fontSize:13}}>{err}</div>}
          <button onClick={go} style={{background:C.red,color:C.white,border:"none",borderRadius:8,padding:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"Oswald,sans-serif",letterSpacing:1,textTransform:"uppercase"}}>Entrar</button>
        </div>
        <div style={{marginTop:24,background:"#1a1a1a",borderRadius:8,padding:14}}>
          <div style={{fontSize:11,color:C.gray400,marginBottom:8,fontWeight:600}}>ACESSO RÁPIDO (DEMO)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
            {USERS.map(u=>(
              <div key={u.id} onClick={()=>onLogin(u)} style={{fontSize:11,cursor:"pointer",padding:"5px 8px",borderRadius:4,background:"#222"}}>
                <div style={{color:C.gray200,fontWeight:600}}>{u.name.split(" ")[0]}</div>
                <div style={{color:C.gray600,fontSize:10}}>{ROLE_LABELS[u.role]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({user,active,onNav,collapsed,onToggle}){
  const items=NAV_BY_ROLE[user.role]||[];
  return(
    <div style={{width:collapsed?60:230,background:C.gray900,borderRight:`1px solid ${C.gray800}`,display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden",flexShrink:0}}>
      <div style={{padding:collapsed?"16px 12px":"18px 16px",borderBottom:`1px solid ${C.gray800}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {!collapsed&&<div><div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,color:C.white,letterSpacing:2}}>CITEROL</div><div style={{fontSize:9,color:C.gray400,letterSpacing:1}}>PERSONALIZADOS</div></div>}
        <button onClick={onToggle} style={{background:"none",border:"none",color:C.gray400,cursor:"pointer",fontSize:16,padding:4}}>{collapsed?"→":"←"}</button>
      </div>
      <div style={{flex:1,padding:"6px 0",overflowY:"auto"}}>
        {items.map(id=>{const m=NAV_META[id];return(
          <div key={id} onClick={()=>onNav(id)} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px 18px":"9px 14px",cursor:"pointer",background:active===id?C.red+"22":"transparent",borderLeft:active===id?`3px solid ${C.red}`:"3px solid transparent",color:active===id?C.white:C.gray400,fontSize:13,fontWeight:active===id?600:400,whiteSpace:"nowrap"}}>
            <span style={{fontSize:15,flexShrink:0}}>{m.icon}</span>
            {!collapsed&&<span style={{fontFamily:"Montserrat,sans-serif"}}>{m.label}</span>}
          </div>
        );})}
      </div>
      <div style={{padding:collapsed?"10px":"12px 14px",borderTop:`1px solid ${C.gray800}`}}>
        {!collapsed&&<div style={{display:"flex",alignItems:"center",gap:10}}><Avatar initials={user.avatar} size={30}/><div><div style={{fontSize:12,color:C.white,fontWeight:600}}>{user.name.split(" ")[0]}</div><div style={{fontSize:10,color:C.gray400}}>{ROLE_LABELS[user.role]}</div></div></div>}
      </div>
    </div>
  );
}

function BottomNav({user,active,onNav}){
  const items=(NAV_BY_ROLE[user.role]||[]).slice(0,5);
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.gray900,borderTop:`1px solid ${C.gray800}`,display:"flex",zIndex:100}}>
      {items.map(id=>{const m=NAV_META[id];return(
        <div key={id} onClick={()=>onNav(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 4px",cursor:"pointer",background:active===id?C.red+"22":"transparent",color:active===id?C.white:C.gray400}}>
          <span style={{fontSize:20}}>{m.icon}</span>
          <span style={{fontSize:9,marginTop:2,textAlign:"center",fontWeight:active===id?700:400}}>{m.label.split(" ")[0]}</span>
        </div>
      );})}
    </div>
  );
}

function Topbar({user,title,notifications,onBell,onLogout,isMobile}){
  const unread=notifications.filter(n=>!n.read&&n.toUserId===user.id).length;
  return(
    <div style={{height:56,background:C.white,borderBottom:`1px solid ${C.gray200}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",flexShrink:0}}>
      <div style={{fontFamily:"Oswald,sans-serif",fontSize:isMobile?14:17,fontWeight:600,color:C.black,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</div>
      <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <div onClick={onBell} style={{position:"relative",cursor:"pointer"}}>
          <span style={{fontSize:22}}>🔔</span>
          {unread>0&&<span style={{position:"absolute",top:-4,right:-4,background:C.red,color:C.white,borderRadius:"50%",width:16,height:16,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
        </div>
        <Avatar initials={user.avatar} size={32}/>
        {!isMobile&&<button onClick={onLogout} style={{background:"none",border:"none",color:C.gray400,cursor:"pointer",fontSize:13}}>Sair</button>}
      </div>
    </div>
  );
}

// ─── CHAT ────────────────────────────────────────────────────────────────────
function ChatPanel({order,currentUser,onSend}){
  const[msg,setMsg]=useState("");const[showM,setShowM]=useState(false);const[mq,setMq]=useState("");const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[order.chat]);
  const hc=v=>{setMsg(v);const at=v.lastIndexOf("@");if(at!==-1&&v.slice(at+1).match(/^\w*$/)){setShowM(true);setMq(v.slice(at+1).toLowerCase());}else setShowM(false);};
  const ins=u=>{const at=msg.lastIndexOf("@");setMsg(msg.slice(0,at)+"@"+u.name.split(" ")[0]+" ");setShowM(false);};
  const fu=USERS.filter(u=>u.id!==currentUser.id&&(mq===""||u.name.toLowerCase().includes(mq)));
  const send=()=>{if(!msg.trim())return;const mn=USERS.filter(u=>msg.includes("@"+u.name.split(" ")[0])).map(u=>u.id);onSend(order.id,msg,mn);setMsg("");};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
        {order.chat.length===0&&<div style={{color:C.gray400,fontSize:13,textAlign:"center",marginTop:20}}>Nenhuma mensagem ainda.</div>}
        {order.chat.map((m,i)=>{const u=USERS.find(x=>x.id===m.userId);return(
          <div key={i} style={{display:"flex",gap:8}}>
            <Avatar initials={u?.avatar||"?"} size={28} color={u?.id===currentUser.id?C.red:C.green}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"baseline",flexWrap:"wrap"}}>
                <span style={{fontSize:12,fontWeight:700}}>{u?.name}</span>
                <span style={{fontSize:10,color:C.gray400}}>{m.time}</span>
              </div>
              <div style={{fontSize:13,color:C.gray700,marginTop:2,lineHeight:1.5}}>
                {m.text.split(/(@\w+)/).map((p,j)=>p.startsWith("@")?<span key={j} style={{color:C.red,fontWeight:600}}>{p}</span>:p)}
              </div>
            </div>
          </div>
        );})}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 14px",borderTop:`1px solid ${C.gray200}`,position:"relative"}}>
        {showM&&fu.length>0&&(
          <div style={{position:"absolute",bottom:68,left:14,right:14,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",zIndex:10}}>
            {fu.slice(0,5).map(u=>(<div key={u.id} onClick={()=>ins(u)} style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:13}}><Avatar initials={u.avatar} size={22}/><span>{u.name}</span><span style={{color:C.gray400,fontSize:10}}>{ROLE_LABELS[u.role]}</span></div>))}
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <input value={msg} onChange={e=>hc(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Mensagem... @ para mencionar" style={{flex:1,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",fontSize:14,outline:"none"}}/>
          <button onClick={send} style={{background:C.red,color:C.white,border:"none",borderRadius:8,padding:"10px 16px",cursor:"pointer",fontSize:16,fontWeight:700}}>↑</button>
        </div>
      </div>
    </div>
  );
}

function TimelineView({order}){
  return(
    <div style={{padding:16,position:"relative"}}>
      <div style={{position:"absolute",left:31,top:16,bottom:16,width:2,background:C.gray200}}/>
      {order.timeline.map((t,i)=>{const act=t.exitedAt===null;return(
        <div key={i} style={{display:"flex",gap:12,marginBottom:20,position:"relative"}}>
          <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,background:act?C.red:C.green,display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontSize:12,fontWeight:700,zIndex:1,boxShadow:act?`0 0 0 4px ${C.red}30`:"none"}}>{act?"▶":"✓"}</div>
          <div style={{flex:1,paddingTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
              <span style={{fontWeight:700,fontSize:13}}>{t.stage}</span>
              {act&&<Badge label="Em andamento" color={C.red} bg={C.red+"15"}/>}
            </div>
            <div style={{fontSize:11,color:C.gray400,marginTop:1}}>{t.user}</div>
            <div style={{fontSize:11,color:C.gray600,marginTop:2}}>
              Entrada: {fmtDate(t.enteredAt)}{t.exitedAt&&<> · Saída: {fmtDate(t.exitedAt)}</>}
              {t.durationH!=null&&<> · <strong style={{color:C.red}}>{t.durationH.toFixed(1)}h</strong></>}
              {t.durationH==null&&act&&<> · <strong style={{color:C.amber}}>Em andamento</strong></>}
            </div>
          </div>
        </div>
      );})}
    </div>
  );
}

// ─── ORDER MODAL ─────────────────────────────────────────────────────────────
function OrderModal({order,currentUser,onClose,onSendChat,isMobile,slaConfig}){
  const[tab,setTab]=useState("info");
  const total=order.items.reduce((s,i)=>s+i.qty,0);
  const sla=getSLAStatus(order,slaConfig);
  const tabs=[{id:"info",l:"Negócio"},{id:"sla",l:"SLA / Prazo"},{id:"bordado",l:"Bordado"},{id:"itens",l:"Peças"},{id:"timeline",l:"Timeline"},{id:"chat",l:"Conversa"}];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?0:16}}>
      <div style={{background:C.white,borderRadius:isMobile?0:12,width:"100%",maxWidth:880,maxHeight:isMobile?"100dvh":"92vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontFamily:"Oswald,sans-serif",fontSize:17,fontWeight:700}}>{order.id}</span>
              <EtapaBadge etapa={order.etapa}/>
              {sla.stageStatus!=="ok"&&<Badge label={sla.stageStatus==="late"?"🔴 Etapa atrasada":"🟡 Etapa em risco"} color={sla.stageStatus==="late"?C.red:C.amber} bg={sla.stageStatus==="late"?C.red+"15":C.amber+"15"}/>}
              {sla.finalStatus!=="ok"&&<Badge label={sla.finalStatus==="late"?"🔴 Prazo vencido":"🟡 Prazo próximo"} color={sla.finalStatus==="late"?C.red:C.amber} bg={sla.finalStatus==="late"?C.red+"15":C.amber+"15"}/>}
            </div>
            <div style={{fontSize:13,color:C.gray600,marginTop:2,fontWeight:600}}>{order.client}</div>
            <div style={{fontSize:11,color:C.gray400}}>Vendedor: {order.vendedor} · {total} peças · {fmtCurrency(order.valorPedido)}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.gray400,flexShrink:0}}>✕</button>
        </div>
        {order.alertas.length>0&&<div style={{padding:"8px 16px",display:"flex",gap:8,flexWrap:"wrap",borderBottom:`1px solid ${C.gray200}`,background:"#fffbeb"}}>{order.alertas.map((a,i)=><AlertBadge key={i} text={a}/>)}</div>}
        <div style={{display:"flex",borderBottom:`1px solid ${C.gray200}`,padding:"0 16px",overflowX:"auto"}}>
          {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",padding:"11px 12px",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?C.red:C.gray400,borderBottom:tab===t.id?`2px solid ${C.red}`:"2px solid transparent",whiteSpace:"nowrap",flexShrink:0,fontFamily:"Montserrat,sans-serif"}}>{t.l}</button>))}
        </div>
        <div style={{flex:1,overflow:"auto"}}>
          {tab==="info"&&(
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
                {[["Cliente",order.client],["CNPJ",order.cnpj],["Vendedor",order.vendedor],["Telefone",order.telefone],["E-mail",order.email],["Valor",fmtCurrency(order.valorPedido)],["Prazo Final",fmtDate(order.prazoFinal)],["Entrada",fmtDate(order.dataEntrada)]].map(([k,v])=>(
                  <div key={k} style={{background:C.gray100,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.black,wordBreak:"break-word"}}>{v}</div>
                  </div>
                ))}
              </div>
              <div><div style={{fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Observações</div><div style={{background:C.gray100,borderRadius:8,padding:"12px 14px",fontSize:13,color:C.gray700,lineHeight:1.6}}>{order.observacoes||"—"}</div></div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["AMOSTRA",order.amostrasAprovada,"Aprovada","Pendente"],["SEPARAÇÃO",order.separacaoCompleta,"Completa","Pendente"]].map(([lbl,ok,y,n])=>(
                  <div key={lbl} style={{flex:1,minWidth:130,background:ok?C.green+"15":C.amber+"15",border:`1px solid ${ok?C.green:C.amber}44`,borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:20}}>{ok?"✅":"⏳"}</span>
                    <div><div style={{fontSize:11,fontWeight:700,color:ok?C.green:C.amber}}>{lbl}</div><div style={{fontSize:12,color:C.gray600}}>{ok?y:n}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==="sla"&&(
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
                <Card style={{borderLeft:`4px solid ${sla.stageStatus==="late"?C.red:sla.stageStatus==="risk"?C.amber:C.green}`}}>
                  <div style={{fontSize:11,color:C.gray400,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>SLA desta Etapa</div>
                  <div style={{fontSize:22,fontWeight:800,fontFamily:"Oswald,sans-serif",color:sla.stageStatus==="late"?C.red:sla.stageStatus==="risk"?C.amber:C.green}}>
                    {sla.hrsInStage.toFixed(0)}h <span style={{fontSize:14,fontWeight:400,color:C.gray400}}>/ {sla.slaHrs}h</span>
                  </div>
                  <SLABar pct={sla.pctStage} status={sla.stageStatus}/>
                  <div style={{fontSize:11,color:C.gray500,marginTop:6}}>{sla.stageStatus==="late"?"Etapa ultrapassou o SLA":sla.stageStatus==="risk"?"Próximo do limite":"Dentro do SLA"}</div>
                </Card>
                <Card style={{borderLeft:`4px solid ${sla.finalStatus==="late"?C.red:sla.finalStatus==="risk"?C.amber:C.green}`}}>
                  <div style={{fontSize:11,color:C.gray400,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Prazo Final do Pedido</div>
                  <div style={{fontSize:22,fontWeight:800,fontFamily:"Oswald,sans-serif",color:sla.finalStatus==="late"?C.red:sla.finalStatus==="risk"?C.amber:C.green}}>
                    {sla.finalStatus==="late"?`${Math.abs(sla.hoursToDeadline).toFixed(0)}h atraso`:`${sla.hoursToDeadline.toFixed(0)}h restantes`}
                  </div>
                  <div style={{fontSize:12,color:C.gray500,marginTop:4}}>Prazo: {fmtDate(order.prazoFinal)}</div>
                  <div style={{fontSize:11,color:C.gray500,marginTop:2}}>{sla.finalStatus==="late"?"Pedido fora do prazo":sla.finalStatus==="risk"?"Prazo muito próximo":"Dentro do prazo"}</div>
                </Card>
              </div>
              <Card>
                <SecTitle>Tempo em cada etapa</SecTitle>
                <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
                  <thead><tr style={{background:C.gray100}}>{["Etapa","Responsável","Tempo","SLA","Status"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:11,color:C.gray400,fontWeight:700}}>{h}</th>)}</tr></thead>
                  <tbody>
                    {order.timeline.map((t,i)=>{
                      const dur=t.durationH;
                      const sl=slaConfig[t.stage];
                      const st=dur==null?"em andamento":sl&&dur>sl?"atrasado":sl&&dur>sl*0.8?"risco":"ok";
                      return(
                        <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                          <td style={{padding:"8px 10px",fontWeight:600}}>{t.stage}</td>
                          <td style={{padding:"8px 10px",color:C.gray500,fontSize:12}}>{t.user}</td>
                          <td style={{padding:"8px 10px",fontWeight:700,color:st==="atrasado"?C.red:st==="risco"?C.amber:C.green}}>
                            {dur!=null?`${dur.toFixed(1)}h`:<span style={{color:C.amber}}>Em andamento</span>}
                          </td>
                          <td style={{padding:"8px 10px",color:C.gray400}}>{sl?`${sl}h`:"—"}</td>
                          <td style={{padding:"8px 10px"}}>
                            {st==="em andamento"?<Badge label="▶ Andamento" color={C.amber} bg={C.amber+"15"}/>:st==="atrasado"?<Badge label="🔴 Atrasado" color={C.red} bg={C.red+"15"}/>:st==="risco"?<Badge label="🟡 Risco" color={C.amber} bg={C.amber+"15"}/>:<Badge label="✓ OK" color={C.green} bg={C.green+"15"}/>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </div>
          )}
          {tab==="bordado"&&(
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
                {[["Pontos",order.bordado.pontos.toLocaleString()],["Arquivo",order.bordado.arquivo],["Aprovado",order.bordado.arquivoAprovado?"✅ Sim":"⏳ Não"],["Cores",order.bordado.cores.join(", ")]].map(([k,v])=>(
                  <div key={k} style={{background:C.gray100,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
              {[["Amostras Digitais","amostrasDigital","amostrasDigitalObs","🖼️"],["Amostras Físicas","amostrasiFisica","amostrasiFisicaObs","📷"]].map(([title,key,obsKey,icon])=>(
                <div key={key}>
                  <SecTitle>{title}</SecTitle>
                  {order.bordado[key].length===0?<div style={{color:C.gray400,fontSize:13}}>Nenhuma registrada.</div>
                    :order.bordado[key].map((a,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,background:C.gray100,borderRadius:8,padding:"10px 14px",marginBottom:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:22}}>{icon}</span>
                        <div style={{flex:1,minWidth:100}}><div style={{fontSize:13,fontWeight:600}}>{a.nome}</div><div style={{fontSize:11,color:C.gray400}}>{a.data}</div></div>
                        <Badge label={a.aprovado?"✅ Aprovada":"⏳ Pendente"} color={a.aprovado?C.green:C.amber} bg={a.aprovado?C.green+"15":C.amber+"15"}/>
                        <button style={{background:C.blue,color:C.white,border:"none",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Baixar</button>
                      </div>
                    ))
                  }
                  {order.bordado[obsKey]&&<div style={{fontSize:12,color:C.gray500,marginTop:4}}>Obs: {order.bordado[obsKey]}</div>}
                </div>
              ))}
            </div>
          )}
          {tab==="itens"&&(
            <div style={{padding:16,overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:460}}>
                <thead><tr style={{background:C.gray100}}>{["SKU","Descrição","Cor","Qtd","Destino","Status"].map(h=><th key={h} style={{padding:"9px 10px",textAlign:"left",fontWeight:700,color:C.gray600,fontSize:11,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                <tbody>{order.items.map((it,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.gray200}`}}>
                    <td style={{padding:"9px 10px",fontWeight:700,fontFamily:"monospace",fontSize:12}}>{it.sku}</td>
                    <td style={{padding:"9px 10px",color:C.gray700}}>{it.desc}</td>
                    <td style={{padding:"9px 10px",color:C.gray500}}>{it.cor}</td>
                    <td style={{padding:"9px 10px",fontWeight:700}}>{it.qty}</td>
                    <td style={{padding:"9px 10px"}}>{it.dest?<Badge label={it.dest==="interno"?"🟢 Interno":"🟣 Externo"} color={it.dest==="interno"?C.green:C.purple} bg={it.dest==="interno"?C.green+"15":C.purple+"15"}/>:<span style={{color:C.gray400}}>—</span>}</td>
                    <td style={{padding:"9px 10px"}}><Badge label={it.status==="faltante"?"⚠️ Faltante":it.status==="bordando"?"✂️ Bordando":it.status==="pronto"?"✓ Pronto":"📦 Separado"} color={it.status==="faltante"?C.red:it.status==="pronto"?C.green:C.gray600} bg={it.status==="faltante"?C.red+"15":it.status==="pronto"?C.green+"15":C.gray100}/></td>
                  </tr>
                ))}</tbody>
                <tfoot><tr style={{background:C.gray100}}><td colSpan={3} style={{padding:"9px 10px",fontWeight:700,fontSize:12,color:C.gray600}}>TOTAL</td><td style={{padding:"9px 10px",fontWeight:800,fontSize:14}}>{order.items.reduce((s,i)=>s+i.qty,0)}</td><td colSpan={2}/></tr></tfoot>
              </table>
            </div>
          )}
          {tab==="timeline"&&<TimelineView order={order}/>}
          {tab==="chat"&&<div style={{height:isMobile?380:420}}><ChatPanel order={order} currentUser={currentUser} onSend={onSendChat}/></div>}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
function OrderCard({order,onClick,slaConfig}){
  const total=order.items.reduce((s,i)=>s+i.qty,0);
  const falt=order.items.filter(i=>i.status==="faltante").reduce((s,i)=>s+i.qty,0);
  const sla=getSLAStatus(order,slaConfig);
  const borderColor=sla.stageStatus==="late"||sla.finalStatus==="late"?C.red:sla.stageStatus==="risk"||sla.finalStatus==="risk"?C.amber:SC[order.etapa]||C.gray400;
  return(
    <div onClick={onClick} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:10,padding:14,cursor:"pointer",borderLeft:`4px solid ${borderColor}`}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(0,0,0,0.1)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,gap:8}}>
        <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:14}}>{order.id}</div><div style={{fontSize:12,color:C.gray400,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{order.client}</div></div>
        <EtapaBadge etapa={order.etapa}/>
      </div>
      <div style={{display:"flex",gap:10,fontSize:12,color:C.gray600,flexWrap:"wrap",marginBottom:6}}>
        <span>{total} peças</span>
        <span style={{fontWeight:600,color:C.green}}>{fmtCurrency(order.valorPedido)}</span>
        {falt>0&&<span style={{color:C.red,fontWeight:600}}>⚠️ {falt} faltantes</span>}
        {!order.amostrasAprovada&&<span style={{color:C.amber,fontWeight:600}}>⏳ Amostra</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <SLABar pct={sla.pctStage} status={sla.stageStatus}/>
        <span style={{fontSize:10,color:sla.stageStatus==="late"?C.red:sla.stageStatus==="risk"?C.amber:C.green,fontWeight:600,flexShrink:0}}>{sla.hrsInStage.toFixed(0)}h/{sla.slaHrs}h</span>
      </div>
      {(sla.stageStatus!=="ok"||sla.finalStatus!=="ok")&&(
        <div style={{marginTop:6}}>
          <SLABadge {...sla}/>
        </div>
      )}
    </div>
  );
}

// ─── FUNIL TEMPO REAL ────────────────────────────────────────────────────────
function FunilTempoReal({orders,onOpenOrder,slaConfig}){
  const [selected,setSelected]=useState(null);
  const etapas=Object.keys(SLA_DEFAULTS);
  const stats=etapas.map(e=>{
    const ords=orders.filter(o=>o.etapa===e&&!o.concluido);
    const totalVal=ords.reduce((s,o)=>s+o.valorPedido,0);
    const totalPecas=ords.reduce((s,o)=>s+o.items.reduce((ss,i)=>ss+i.qty,0),0);
    const tempoMed=ords.length>0?ords.reduce((s,o)=>s+hoursInStage(o.etapaEntradaAt),0)/ords.length:0;
    const atrasados=ords.filter(o=>getSLAStatus(o,slaConfig).stageStatus==="late").length;
    return{etapa:e,count:ords.length,totalVal,totalPecas,tempoMed,atrasados,ords};
  }).filter(s=>s.count>0);
  const selOrds=selected?stats.find(s=>s.etapa===selected)?.ords||[]:[];
  return(
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,letterSpacing:0.5}}>FUNIL EM TEMPO REAL</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {stats.map(s=>{
          const color=SC[s.etapa]||C.gray600;
          const isSelected=selected===s.etapa;
          return(
            <div key={s.etapa} onClick={()=>setSelected(isSelected?null:s.etapa)} style={{background:C.white,border:`2px solid ${isSelected?color:C.gray200}`,borderRadius:10,padding:16,cursor:"pointer",transition:"all 0.15s",boxShadow:isSelected?`0 0 0 4px ${color}22`:"none"}}
              onMouseEnter={e=>{if(!isSelected)e.currentTarget.style.borderColor=color+"88";}}
              onMouseLeave={e=>{if(!isSelected)e.currentTarget.style.borderColor=C.gray200;}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{width:10,height:10,borderRadius:"50%",background:color,marginBottom:6}}/>
                  <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,color:C.black,letterSpacing:0.3}}>{s.etapa.toUpperCase()}</div>
                </div>
                <div style={{background:color+"15",color,borderRadius:20,padding:"3px 10px",fontSize:13,fontWeight:800}}>{s.count}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:C.gray500}}>Valor retido</span>
                  <span style={{fontWeight:700,color:C.green}}>{fmtCurrency(s.totalVal)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:C.gray500}}>Peças</span>
                  <span style={{fontWeight:700}}>{s.totalPecas}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:C.gray500}}>Tempo médio</span>
                  <span style={{fontWeight:700,color:s.tempoMed>slaConfig[s.etapa]?C.red:C.green}}>{s.tempoMed.toFixed(1)}h</span>
                </div>
                {s.atrasados>0&&<div style={{background:C.red+"15",borderRadius:6,padding:"4px 8px",fontSize:11,color:C.red,fontWeight:700}}>⚠️ {s.atrasados} atrasado{s.atrasados>1?"s":""}</div>}
              </div>
              <div style={{marginTop:8,fontSize:11,color:isSelected?color:C.gray400,fontWeight:600,textAlign:"center"}}>{isSelected?"▲ Fechar pedidos":"▼ Ver pedidos"}</div>
            </div>
          );
        })}
      </div>
      {selected&&(
        <div style={{background:C.white,border:`1px solid ${SC[selected]||C.gray200}`,borderRadius:10,padding:16}}>
          <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,letterSpacing:0.5,marginBottom:12,color:SC[selected]||C.black}}>{selected.toUpperCase()} — PEDIDOS EM ABERTO</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {selOrds.map(o=><OrderCard key={o.id} order={o} onClick={()=>onOpenOrder(o)} slaConfig={slaConfig}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SLA CONFIG ──────────────────────────────────────────────────────────────
function SLAConfig({slaConfig,onSave}){
  const[local,setLocal]=useState({...slaConfig});
  const[saved,setSaved]=useState(false);
  const save=()=>{onSave(local);setSaved(true);setTimeout(()=>setSaved(false),2000);};
  return(
    <div style={{padding:16}}>
      <div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,letterSpacing:0.5,marginBottom:16}}>CONFIGURAÇÃO DE SLA POR ETAPA</div>
      <Card>
        <div style={{fontSize:13,color:C.gray500,marginBottom:16}}>Defina o tempo máximo (em horas) aceitável para cada etapa. Pedidos que ultrapassarem serão sinalizados como atrasados.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {Object.keys(SLA_DEFAULTS).map(etapa=>(
            <div key={etapa}>
              <div style={{fontSize:11,fontWeight:700,color:SC[etapa]||C.gray600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:SC[etapa]||C.gray400}}/>
                {etapa}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="number" value={local[etapa]||""} onChange={e=>setLocal({...local,[etapa]:Number(e.target.value)})}
                  style={{width:80,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"8px 12px",fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
                <span style={{fontSize:12,color:C.gray400}}>horas</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:20,display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={save} style={{background:C.green,color:C.white,border:"none",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontWeight:700,fontSize:14}}>Salvar SLA</button>
          {saved&&<span style={{color:C.green,fontSize:13,fontWeight:600}}>✓ Salvo!</span>}
        </div>
      </Card>
    </div>
  );
}

// ─── HISTÓRICO ───────────────────────────────────────────────────────────────
function Historico({historico,onOpenOrder,slaConfig}){
  const[dateFrom,setDateFrom]=useState("");
  const[dateTo,setDateTo]=useState("");
  const[vendor,setVendor]=useState("");
  const filtered=historico.filter(o=>{
    if(dateFrom&&new Date(o.dataConclusao)<new Date(dateFrom)) return false;
    if(dateTo&&new Date(o.dataConclusao)>new Date(dateTo+"T23:59:59")) return false;
    if(vendor&&!o.vendedor.toLowerCase().includes(vendor.toLowerCase())) return false;
    return true;
  });
  const totalVal=filtered.reduce((s,o)=>s+o.valorPedido,0);
  const cumpridos=filtered.filter(o=>o.cumpriunSLA).length;
  const totalPecas=filtered.reduce((s,o)=>s+o.items.reduce((ss,i)=>ss+i.qty,0),0);
  return(
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,letterSpacing:0.5}}>HISTÓRICO DE PEDIDOS</div>
      <Card>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[["De",dateFrom,setDateFrom,"date"],["Até",dateTo,setDateTo,"date"],["Vendedor",vendor,setVendor,"text"]].map(([lbl,val,set,type])=>(
            <div key={lbl}>
              <div style={{fontSize:11,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{lbl}</div>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={type==="text"?"Filtrar vendedor...":undefined}
                style={{border:`1px solid ${C.gray200}`,borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
            </div>
          ))}
          <button onClick={()=>{setDateFrom("");setDateTo("");setVendor("");}} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,color:C.gray600}}>Limpar</button>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        <StatCard label="Pedidos" value={filtered.length} icon="📋" color={C.blue}/>
        <StatCard label="Valor Total" value={"R$"+Math.round(totalVal/1000)+"k"} icon="💰" color={C.green}/>
        <StatCard label="Peças" value={totalPecas} icon="👕" color={C.purple}/>
        <StatCard label="SLA Cumprido" value={`${filtered.length?Math.round(cumpridos/filtered.length*100):0}%`} icon="✅" color={cumpridos/filtered.length>=0.8?C.green:C.red}/>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:600}}>
            <thead><tr style={{background:C.gray100}}>{["Pedido","Cliente","Vendedor","Valor","Conclusão","Prazo","SLA"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:11,color:C.gray400,fontWeight:700}}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id} onClick={()=>onOpenOrder(o)} style={{borderBottom:`1px solid ${C.gray100}`,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.gray100}
                  onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                  <td style={{padding:"10px 12px",fontWeight:700}}>{o.id}</td>
                  <td style={{padding:"10px 12px",color:C.gray700}}>{o.client}</td>
                  <td style={{padding:"10px 12px",color:C.gray500}}>{o.vendedor}</td>
                  <td style={{padding:"10px 12px",fontWeight:700,color:C.green}}>{fmtCurrency(o.valorPedido)}</td>
                  <td style={{padding:"10px 12px",color:C.gray500}}>{fmtDateShort(o.dataConclusao)}</td>
                  <td style={{padding:"10px 12px",color:new Date(o.prazoFinal)<new Date(o.dataConclusao)?C.red:C.green,fontWeight:600}}>{fmtDateShort(o.prazoFinal)}</td>
                  <td style={{padding:"10px 12px"}}><Badge label={o.cumpriunSLA?"✓ Cumprido":"✗ Atrasado"} color={o.cumpriunSLA?C.green:C.red} bg={o.cumpriunSLA?C.green+"15":C.red+"15"}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── RANKING ─────────────────────────────────────────────────────────────────
function Ranking({allOrders,historico}){
  const[period,setPeriod]=useState("mes");
  const[dateFrom,setDateFrom]=useState("");
  const[dateTo,setDateTo]=useState("");
  const todos=[...historico,...allOrders.filter(o=>o.concluido)];
  const filtered=todos.filter(o=>{
    if(dateFrom&&new Date(o.dataConclusao||o.dataEntrada)<new Date(dateFrom)) return false;
    if(dateTo&&new Date(o.dataConclusao||o.dataEntrada)>new Date(dateTo+"T23:59:59")) return false;
    return true;
  });
  // Por vendedor
  const byVendedor={};
  filtered.forEach(o=>{
    if(!byVendedor[o.vendedor]) byVendedor[o.vendedor]={nome:o.vendedor,pedidos:0,valor:0,pecas:0,cumpridos:0};
    byVendedor[o.vendedor].pedidos++;
    byVendedor[o.vendedor].valor+=o.valorPedido;
    byVendedor[o.vendedor].pecas+=o.items.reduce((s,i)=>s+i.qty,0);
    if(o.cumpriunSLA) byVendedor[o.vendedor].cumpridos++;
  });
  // Por responsável (executor)
  const byResp={};
  filtered.forEach(o=>{
    const r=o.responsavel||"—";
    if(!byResp[r]) byResp[r]={nome:r,pedidos:0,valor:0,cumpridos:0};
    byResp[r].pedidos++;byResp[r].valor+=o.valorPedido;
    if(o.cumpriunSLA) byResp[r].cumpridos++;
  });
  const vendRank=Object.values(byVendedor).sort((a,b)=>b.valor-a.valor);
  const respRank=Object.values(byResp).sort((a,b)=>b.pedidos-a.pedidos);
  const medals=["🥇","🥈","🥉"];
  return(
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,letterSpacing:0.5}}>RANKING & PREMIAÇÃO</div>
      <Card>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          {[["De",dateFrom,setDateFrom,"date"],["Até",dateTo,setDateTo,"date"]].map(([lbl,val,set])=>(
            <div key={lbl}>
              <div style={{fontSize:11,color:C.gray400,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{lbl}</div>
              <input type="date" value={val} onChange={e=>set(e.target.value)} style={{border:`1px solid ${C.gray200}`,borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}}/>
            </div>
          ))}
          <button onClick={()=>{setDateFrom("");setDateTo("");}} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,color:C.gray600}}>Limpar</button>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <SecTitle>🏆 Ranking de Vendedores — Faturamento</SecTitle>
          {vendRank.length===0?<div style={{color:C.gray400,fontSize:13}}>Sem dados no período.</div>
            :vendRank.map((v,i)=>(
              <div key={v.nome} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<vendRank.length-1?`1px solid ${C.gray100}`:"none"}}>
                <div style={{fontSize:20,width:30,textAlign:"center"}}>{medals[i]||`${i+1}º`}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{v.nome}</div>
                  <div style={{fontSize:11,color:C.gray400}}>{v.pedidos} pedidos · {v.pecas} peças</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:800,color:C.green,fontSize:15}}>{fmtCurrency(v.valor)}</div>
                  <div style={{fontSize:11,color:C.gray400}}>{v.pedidos?Math.round(v.cumpridos/v.pedidos*100):0}% SLA</div>
                </div>
              </div>
            ))
          }
        </Card>
        <Card>
          <SecTitle>🏆 Ranking de Executores — Pedidos Entregues</SecTitle>
          {respRank.length===0?<div style={{color:C.gray400,fontSize:13}}>Sem dados no período.</div>
            :respRank.map((v,i)=>(
              <div key={v.nome} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<respRank.length-1?`1px solid ${C.gray100}`:"none"}}>
                <div style={{fontSize:20,width:30,textAlign:"center"}}>{medals[i]||`${i+1}º`}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14}}>{v.nome}</div>
                  <div style={{fontSize:11,color:C.gray400}}>{fmtCurrency(v.valor)} em pedidos</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:800,color:C.blue,fontSize:15}}>{v.pedidos} pedidos</div>
                  <div style={{fontSize:11,color:v.pedidos&&v.cumpridos/v.pedidos>=0.8?C.green:C.red}}>{v.pedidos?Math.round(v.cumpridos/v.pedidos*100):0}% SLA</div>
                </div>
              </div>
            ))
          }
        </Card>
      </div>
      <Card>
        <SecTitle>📊 SLA Geral no Período</SecTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
          {[
            ["Pedidos Analisados",filtered.length,"📋",C.blue],
            ["SLA Cumprido",filtered.filter(o=>o.cumpriunSLA).length,"✅",C.green],
            ["SLA Descumprido",filtered.filter(o=>!o.cumpriunSLA).length,"❌",C.red],
            ["Taxa de Cumprimento",`${filtered.length?Math.round(filtered.filter(o=>o.cumpriunSLA).length/filtered.length*100):0}%`,"🎯",C.green],
          ].map(([lbl,val,icon,color])=>(
            <div key={lbl} style={{background:C.gray100,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:22,fontWeight:800,fontFamily:"Oswald,sans-serif",color}}>{val}</div>
              <div style={{fontSize:11,color:C.gray400,marginTop:2}}>{lbl}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── MINHAS DEMANDAS ─────────────────────────────────────────────────────────
function MinhasDemandas({user,orders,onOpenOrder,slaConfig}){
  const etapas=ROLE_ETAPAS[user.role]||[];
  const myOrders=orders.filter(o=>etapas.includes(o.etapa)&&!o.concluido);
  const grouped={};etapas.forEach(e=>{grouped[e]=myOrders.filter(o=>o.etapa===e);});
  const active=etapas.filter(e=>grouped[e].length>0);
  const semAm=myOrders.filter(o=>!o.amostrasAprovada);
  const atrasados=myOrders.filter(o=>getSLAStatus(o,slaConfig).stageStatus==="late");
  const showAmBox=["direcionador","superadmin","supervisao","posvenda"].includes(user.role);
  return(
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
        <StatCard label="Minhas Demandas" value={myOrders.length} icon="📌"/>
        {atrasados.length>0&&<StatCard label="Atrasados" value={atrasados.length} color={C.red} icon="🔴"/>}
        {semAm.length>0&&<StatCard label="Sem Amostra" value={semAm.length} color={C.amber} icon="⏳"/>}
      </div>
      {showAmBox&&semAm.length>0&&(
        <div>
          <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,color:C.red,letterSpacing:0.5,background:C.red+"10",border:`1px solid ${C.red}25`,borderRadius:8,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            ⚠️ AGUARDANDO APROVAÇÃO DE AMOSTRA ({semAm.length})
          </div>
          {semAm.map(o=>(
            <div key={o.id} onClick={()=>onOpenOrder(o)} style={{background:"#fffbeb",border:`1px solid ${C.amber}`,borderLeft:`4px solid ${C.amber}`,borderRadius:8,padding:12,cursor:"pointer",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                <div><span style={{fontWeight:700}}>{o.id}</span> <span style={{color:C.gray400,fontSize:13}}>{o.client}</span></div>
                <Badge label="⏳ Amostra Pendente" color="#92400e" bg="#fef3c7"/>
              </div>
              {o.alertas.map((a,i)=><div key={i} style={{fontSize:12,color:"#92400e",marginTop:4}}>• {a}</div>)}
            </div>
          ))}
        </div>
      )}
      {active.length===0&&<div style={{textAlign:"center",padding:60,color:C.gray400,fontSize:14,background:C.white,borderRadius:10,border:`1px solid ${C.gray200}`}}><div style={{fontSize:40,marginBottom:12}}>✅</div>Nenhuma demanda pendente.</div>}
      {active.map(etapa=>(
        <div key={etapa}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:SC[etapa]||C.gray400,flexShrink:0}}/>
            <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,letterSpacing:0.5}}>{etapa.toUpperCase()}</div>
            <div style={{fontSize:12,color:C.gray400}}>({grouped[etapa].length})</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {grouped[etapa].map(o=><OrderCard key={o.id} order={o} onClick={()=>onOpenOrder(o)} slaConfig={slaConfig}/>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({orders,onOpenOrder,slaConfig}){
  const semAm=orders.filter(o=>!o.amostrasAprovada&&!o.concluido);
  const atrasados=orders.filter(o=>!o.concluido&&getSLAStatus(o,slaConfig).stageStatus==="late");
  return(
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
        <StatCard label="Pedidos Ativos" value={orders.filter(o=>!o.concluido).length} icon="📋"/>
        <StatCard label="Atrasados" value={atrasados.length} color={C.red} icon="🔴"/>
        <StatCard label="Sem Amostra" value={semAm.length} color={C.amber} icon="⏳"/>
        <StatCard label="P/ Faturar" value={orders.filter(o=>o.etapa==="Faturamento").length} color={C.green} icon="💰"/>
      </div>
      {atrasados.length>0&&(
        <div>
          <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,color:C.red,letterSpacing:0.5,marginBottom:10,background:C.red+"10",border:`1px solid ${C.red}25`,borderRadius:8,padding:"10px 14px"}}>🔴 PEDIDOS ATRASADOS ({atrasados.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{atrasados.map(o=><OrderCard key={o.id} order={o} onClick={()=>onOpenOrder(o)} slaConfig={slaConfig}/>)}</div>
        </div>
      )}
      <div>
        <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,letterSpacing:0.5,marginBottom:10}}>TODOS OS PEDIDOS ATIVOS</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>{orders.filter(o=>!o.concluido).map(o=><OrderCard key={o.id} order={o} onClick={()=>onOpenOrder(o)} slaConfig={slaConfig}/>)}</div>
      </div>
    </div>
  );
}

function QueueModule({title,etapa,orders,onOpenOrder,actionLabel,actionColor=C.green,slaConfig}){
  const mine=orders.filter(o=>o.etapa===etapa&&!o.concluido);
  return(
    <div style={{padding:16}}>
      <div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,marginBottom:14,letterSpacing:0.5}}>{title} <span style={{color:C.gray400,fontSize:13,fontWeight:400}}>({mine.length})</span></div>
      {mine.length===0?<div style={{color:C.gray400,fontSize:14,textAlign:"center",padding:60,background:C.white,borderRadius:10,border:`1px solid ${C.gray200}`}}>Nenhum pedido nesta etapa.</div>
        :mine.map(o=>{
          const sla=getSLAStatus(o,slaConfig);
          return(
            <Card key={o.id} style={{marginBottom:10,borderLeft:`4px solid ${sla.stageStatus==="late"?C.red:sla.stageStatus==="risk"?C.amber:SC[etapa]||C.gray400}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:15}}>{o.id}</span>
                    {sla.stageStatus!=="ok"&&<Badge label={sla.stageStatus==="late"?"🔴 Atrasado":"🟡 Em risco"} color={sla.stageStatus==="late"?C.red:C.amber} bg={sla.stageStatus==="late"?C.red+"15":C.amber+"15"}/>}
                  </div>
                  <div style={{fontSize:12,color:C.gray400,marginTop:2}}>{o.client} · {fmtCurrency(o.valorPedido)}</div>
                  <div style={{fontSize:12,color:C.gray600,marginTop:4}}>{o.items.length} SKUs · {o.items.reduce((s,i)=>s+i.qty,0)} peças</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                    <SLABar pct={sla.pctStage} status={sla.stageStatus}/>
                    <span style={{fontSize:10,color:sla.stageStatus==="late"?C.red:sla.stageStatus==="risk"?C.amber:C.green,fontWeight:600,flexShrink:0}}>{sla.hrsInStage.toFixed(0)}h/{sla.slaHrs}h</span>
                  </div>
                  <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>{o.alertas.map((a,i)=><AlertBadge key={i} text={a}/>)}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
                  <button onClick={()=>onOpenOrder(o)} style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:6,padding:"7px 12px",cursor:"pointer",fontSize:12,color:C.gray600}}>Ver detalhes</button>
                  <button style={{background:actionColor,color:C.white,border:"none",borderRadius:6,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>{actionLabel}</button>
                </div>
              </div>
            </Card>
          );
        })
      }
    </div>
  );
}

function DirecionamentoModule({orders,onOpenOrder,slaConfig}){
  const pend=orders.filter(o=>!o.amostrasAprovada&&!o.concluido);
  const pron=orders.filter(o=>o.amostrasAprovada&&o.etapa==="Direcionamento"&&!o.concluido);
  return(
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:18}}>
      {pend.length>0&&(
        <div>
          <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,color:C.red,letterSpacing:0.5,background:C.red+"10",border:`1px solid ${C.red}25`,borderRadius:8,padding:"10px 14px",marginBottom:10}}>⚠️ AGUARDANDO APROVAÇÃO DE AMOSTRA ({pend.length})</div>
          {pend.map(o=>(
            <div key={o.id} onClick={()=>onOpenOrder(o)} style={{background:"#fffbeb",border:`1px solid ${C.amber}`,borderLeft:`4px solid ${C.amber}`,borderRadius:8,padding:12,cursor:"pointer",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                <div><span style={{fontWeight:700}}>{o.id}</span> <span style={{color:C.gray400,fontSize:13}}>{o.client}</span></div>
                <Badge label="⏳ Amostra Pendente" color="#92400e" bg="#fef3c7"/>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <div style={{fontFamily:"Oswald,sans-serif",fontSize:13,fontWeight:700,letterSpacing:0.5,marginBottom:12}}>PRONTOS PARA DIRECIONAR</div>
        {pron.length===0?<div style={{color:C.gray400,textAlign:"center",padding:40}}>Nenhum pedido aguardando.</div>
          :pron.map(o=>(
            <Card key={o.id} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div><span style={{fontWeight:700,fontSize:15}}>{o.id}</span> <span style={{color:C.gray400}}>{o.client}</span></div>
                <button onClick={()=>onOpenOrder(o)} style={{background:C.red,color:C.white,border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>Ver detalhes</button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:380}}>
                  <thead><tr style={{background:C.gray100}}>{["☐","SKU","Qtd","Destino"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:11,color:C.gray400,fontWeight:700}}>{h}</th>)}</tr></thead>
                  <tbody>{o.items.map((it,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`}}>
                      <td style={{padding:"7px 10px"}}><input type="checkbox"/></td>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:700,fontSize:12}}>{it.sku}</td>
                      <td style={{padding:"7px 10px"}}>{it.qty}</td>
                      <td style={{padding:"7px 10px"}}>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          <button style={{background:it.dest==="interno"?C.green:C.white,color:it.dest==="interno"?C.white:C.gray600,border:`1px solid ${C.green}`,borderRadius:5,padding:"4px 12px",fontSize:12,cursor:"pointer",fontWeight:600}}>🟢 Interno</button>
                          <button style={{background:it.dest==="externo"?C.purple:C.white,color:it.dest==="externo"?C.white:C.gray600,border:`1px solid ${C.purple}`,borderRadius:5,padding:"4px 12px",fontSize:12,cursor:"pointer",fontWeight:600}}>🟣 Externo</button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                <button style={{background:C.green,color:C.white,border:"none",borderRadius:6,padding:"8px 14px",cursor:"pointer",fontSize:13,fontWeight:700}}>Confirmar Direcionamento</button>
                <button style={{background:C.white,color:C.gray600,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",cursor:"pointer",fontSize:12}}>Todos → Interno</button>
                <button style={{background:C.white,color:C.gray600,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 12px",cursor:"pointer",fontSize:12}}>Todos → Externo</button>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  );
}

function UsersAdmin(){
  const[users,setUsers]=useState(USERS);const[show,setShow]=useState(false);const[form,setForm]=useState({name:"",email:"",role:"posvenda",password:""});
  const add=()=>{if(!form.name||!form.email)return;setUsers([...users,{...form,id:Date.now(),avatar:form.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}]);setShow(false);setForm({name:"",email:"",role:"posvenda",password:""});};
  return(
    <div style={{padding:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{fontFamily:"Oswald,sans-serif",fontSize:15,fontWeight:700,letterSpacing:0.5}}>GESTÃO DE USUÁRIOS</div>
        <button onClick={()=>setShow(!show)} style={{background:C.red,color:C.white,border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>+ Novo Usuário</button>
      </div>
      {show&&(
        <Card style={{marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,marginBottom:10}}>
            {[["name","Nome"],["email","E-mail"],["password","Senha"]].map(([k,p])=>(<input key={k} placeholder={p} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={{border:`1px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none"}}/>))}
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{border:`1px solid ${C.gray200}`,borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none"}}>
              {Object.entries(ROLE_LABELS).filter(([k])=>k!=="superadmin").map(([k,v])=><option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={add} style={{background:C.green,color:C.white,border:"none",borderRadius:6,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>Salvar</button>
            <button onClick={()=>setShow(false)} style={{background:C.white,border:`1px solid ${C.gray200}`,borderRadius:6,padding:"8px 14px",cursor:"pointer",fontSize:13,color:C.gray600}}>Cancelar</button>
          </div>
        </Card>
      )}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:480}}>
            <thead><tr style={{background:C.gray100}}>{["Usuário","E-mail","Perfil","Ações"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:11,color:C.gray400,fontWeight:700,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{users.map(u=>(
              <tr key={u.id} style={{borderBottom:`1px solid ${C.gray100}`}}>
                <td style={{padding:"11px 14px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar initials={u.avatar} size={28}/><span style={{fontWeight:600}}>{u.name}</span></div></td>
                <td style={{padding:"11px 14px",color:C.gray600,fontSize:12}}>{u.email}</td>
                <td style={{padding:"11px 14px"}}><Badge label={ROLE_LABELS[u.role]} color={u.role==="superadmin"?C.red:C.gray600} bg={u.role==="superadmin"?C.red+"15":C.gray100}/></td>
                <td style={{padding:"11px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button style={{background:"none",border:`1px solid ${C.gray200}`,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,color:C.gray600}}>Editar</button>
                    {u.role!=="superadmin"&&<button onClick={()=>setUsers(users.filter(x=>x.id!==u.id))} style={{background:"none",border:`1px solid ${C.red}30`,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontSize:11,color:C.red}}>Remover</button>}
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function NotifPanel({notifications,user,onClose}){
  const mine=notifications.filter(n=>n.toUserId===user.id);
  return(
    <div style={{position:"fixed",top:56,right:0,width:310,background:C.white,borderLeft:`1px solid ${C.gray200}`,boxShadow:"-4px 4px 16px rgba(0,0,0,0.1)",zIndex:200,maxHeight:"70vh",overflow:"auto"}}>
      <div style={{padding:"13px 16px",borderBottom:`1px solid ${C.gray200}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"Oswald,sans-serif",fontWeight:700,fontSize:14,letterSpacing:0.5}}>NOTIFICAÇÕES</span>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.gray400,fontSize:18}}>✕</button>
      </div>
      {mine.length===0?<div style={{padding:24,color:C.gray400,fontSize:13,textAlign:"center"}}>Nenhuma notificação.</div>
        :mine.map((n,i)=>(<div key={i} style={{padding:"12px 16px",borderBottom:`1px solid ${C.gray100}`,background:n.read?C.white:C.red+"08"}}><div style={{fontSize:13,fontWeight:n.read?400:600}}>{n.text}</div><div style={{fontSize:11,color:C.gray400,marginTop:3}}>{n.time} · {n.orderId}</div></div>))
      }
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const isMobile=useIsMobile();
  const[user,setUser]=useState(null);
  const[page,setPage]=useState("demandas");
  const[orders,setOrders]=useState(ORDERS_INIT);
  const[historico]=useState(HISTORICO_INIT);
  const[sel,setSel]=useState(null);
  const[collapsed,setCollapsed]=useState(false);
  const[showN,setShowN]=useState(false);
  const[slaConfig,setSlaConfig]=useState({...SLA_DEFAULTS});
  const[notifs,setNotifs]=useState([
    {toUserId:7,text:'Ana: "peças chegaram, pode direcionar."',orderId:"PED-2024-001",time:"11/06 09:00",read:false},
    {toUserId:3,text:"Rafael: JALECO-P com 30 un faltantes.",orderId:"PED-2024-002",time:"13/06 08:20",read:false},
    {toUserId:1,text:"PED-2024-004 entrou em Expedição",orderId:"PED-2024-004",time:"15/06 14:00",read:true},
  ]);
  const sendChat=(orderId,text,mentions)=>{
    const now=new Date();
    const t=`${now.getDate().toString().padStart(2,"0")}/${(now.getMonth()+1).toString().padStart(2,"0")} ${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    const upd=o=>o.id===orderId?{...o,chat:[...o.chat,{userId:user.id,text,time:t,mentions}]}:o;
    setOrders(prev=>prev.map(upd));
    setSel(prev=>prev?.id===orderId?upd(prev):prev);
    mentions.forEach(uid=>setNotifs(n=>[...n,{toUserId:uid,text:`${user.name}: "${text.slice(0,50)}..."`,orderId,time:t,read:false}]));
  };
  const TITLES={demandas:"Minhas Demandas",dashboard:"Dashboard",funil:"Funil em Tempo Real",gerencial:"Gerencial",historico:"Histórico",ranking:"Ranking / Premiação",pedidos:"Todos os Pedidos",programacao:"Programação",amostra_digital:"Amostra Digital",amostra_fisica:"Amostra Física",direcionamento:"Direcionamento",bordado_interno:"Bordado Interno",bordado_externo:"Bordado Externo",expedicao:"Expedição",faturamento:"Faturamento",sla:"Config. SLA",usuarios:"Usuários"};
  const nav=id=>{setPage(id);setShowN(false);};
  if(!user) return <LoginScreen onLogin={u=>{setUser(u);setPage("demandas");}}/>;
  const allOrders=[...orders,...historico];
  return(
    <div style={{display:"flex",height:"100dvh",fontFamily:"Montserrat,sans-serif",background:C.gray100,overflow:"hidden",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet"/>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {!isMobile&&<Sidebar user={user} active={page} onNav={nav} collapsed={collapsed} onToggle={()=>setCollapsed(!collapsed)}/>}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <Topbar user={user} title={TITLES[page]||""} notifications={notifs} onBell={()=>setShowN(!showN)} onLogout={()=>setUser(null)} isMobile={isMobile}/>
          {showN&&<NotifPanel notifications={notifs} user={user} onClose={()=>setShowN(false)}/>}
          <div style={{flex:1,overflowY:"auto",paddingBottom:isMobile?70:0}}>
            {page==="demandas"&&<MinhasDemandas user={user} orders={orders} onOpenOrder={setSel} slaConfig={slaConfig}/>}
            {page==="dashboard"&&<Dashboard orders={orders} onOpenOrder={setSel} slaConfig={slaConfig}/>}
            {page==="funil"&&<FunilTempoReal orders={orders} onOpenOrder={setSel} slaConfig={slaConfig}/>}
            {page==="historico"&&<Historico historico={historico} onOpenOrder={setSel} slaConfig={slaConfig}/>}
            {page==="ranking"&&<Ranking allOrders={allOrders} historico={historico}/>}
            {page==="pedidos"&&<Dashboard orders={orders} onOpenOrder={setSel} slaConfig={slaConfig}/>}
            {page==="direcionamento"&&<DirecionamentoModule orders={orders} onOpenOrder={setSel} slaConfig={slaConfig}/>}
            {page==="programacao"&&<QueueModule title="Fila de Programação" etapa="Programação" orders={orders} onOpenOrder={setSel} actionLabel="Marcar Programado" actionColor={C.amber} slaConfig={slaConfig}/>}
            {page==="amostra_digital"&&<QueueModule title="Amostra Digital" etapa="Amostra Digital" orders={orders} onOpenOrder={setSel} actionLabel="Enviar Amostra" actionColor="#8b5cf6" slaConfig={slaConfig}/>}
            {page==="amostra_fisica"&&<QueueModule title="Amostra Física" etapa="Amostra Física" orders={orders} onOpenOrder={setSel} actionLabel="Notificar Vendedor" actionColor="#ec4899" slaConfig={slaConfig}/>}
            {page==="bordado_interno"&&<QueueModule title="Bordado Interno" etapa="Bordado Interno" orders={orders} onOpenOrder={setSel} actionLabel="✓ Bordado Concluído" actionColor={C.green} slaConfig={slaConfig}/>}
            {page==="bordado_externo"&&<QueueModule title="Bordado Externo" etapa="Bordado Externo" orders={orders} onOpenOrder={setSel} actionLabel="Registrar Retorno" actionColor={C.purple} slaConfig={slaConfig}/>}
            {page==="expedicao"&&<QueueModule title="Expedição" etapa="Expedição" orders={orders} onOpenOrder={setSel} actionLabel="Enviar p/ Faturamento" actionColor={C.teal} slaConfig={slaConfig}/>}
            {page==="faturamento"&&<QueueModule title="Faturamento" etapa="Faturamento" orders={orders} onOpenOrder={setSel} actionLabel="✓ Faturar Pedido" actionColor={C.green} slaConfig={slaConfig}/>}
            {page==="sla"&&<SLAConfig slaConfig={slaConfig} onSave={setSlaConfig}/>}
            {page==="usuarios"&&<UsersAdmin/>}
          </div>
        </div>
      </div>
      {isMobile&&<BottomNav user={user} active={page} onNav={nav}/>}
      {sel&&<OrderModal order={sel} currentUser={user} onClose={()=>setSel(null)} onSendChat={sendChat} isMobile={isMobile} slaConfig={slaConfig}/>}
    </div>
  );
}
