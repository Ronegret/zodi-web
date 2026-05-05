import{n as ReactImport,s as wrap,t as jsxRuntime}from"./jsx-runtime-2UHhqg_S.js";import{t as motion}from"./proxy-juyD3h56.js";var React=wrap(ReactImport(),1),jsx=jsxRuntime();
const SERVICES=[
  {id:"hoy",title:"Horoscopo diario",desc:"Lectura clara para tomar decisiones hoy.",group:"Hoy"},
  {id:"semana",title:"Semana",desc:"Amor, trabajo, dinero y energia de los proximos 7 dias.",group:"Hoy"},
  {id:"mes",title:"Mes completo",desc:"Panorama profundo para planificar con calma.",group:"Hoy"},
  {id:"transitos",title:"Transitos",desc:"Planetas en movimiento y como se sienten en tu vida.",group:"Hoy"},
  {id:"tarot",title:"Tarot IA",desc:"Preguntas concretas con respuesta simbolica y accionable.",group:"Oraculos"},
  {id:"roast",title:"Roast",desc:"Lectura directa para ver patrones sin maquillaje.",group:"Oraculos"},
  {id:"cotilla",title:"Modo cotilla",desc:"Lectura social para vinculos, ex y dinamicas cercanas.",group:"Oraculos"},
  {id:"compatibilidad",title:"Compatibilidad",desc:"Analisis de signos, elementos, deseo y comunicacion.",group:"Social"},
  {id:"amigos",title:"Contactos",desc:"Conecta con otros perfiles y compara energia astral.",group:"Social"},
  {id:"carta",title:"Carta natal",desc:"Identidad, emocion, vocacion y mapa personal.",group:"Identidad"},
  {id:"numerologia",title:"Numerologia",desc:"Numero de vida, ano personal, rasgos y compatibilidades.",group:"Identidad"},
  {id:"chino",title:"Zodiaco chino",desc:"Animal, elemento, sombra, fortuna y vinculos.",group:"Tradiciones"},
  {id:"vikingo",title:"Runas vikingas",desc:"Arquetipos nordicos aplicados a decisiones actuales.",group:"Tradiciones"},
  {id:"maya",title:"Horoscopo maya",desc:"Sincronizacion con ciclos y energia de nacimiento.",group:"Tradiciones"},
  {id:"celta",title:"Zodiaco celta",desc:"Arbol guardian, caracter y guia simbolica.",group:"Tradiciones"},
  {id:"biorritmo",title:"Biorritmos",desc:"Ciclos fisicos, emocionales y mentales.",group:"Energia"},
  {id:"cristales",title:"Cristales",desc:"Piedras recomendadas segun signo e intencion.",group:"Energia"},
  {id:"suenos",title:"Suenos",desc:"Interpretacion de imagenes oniricas y mensajes internos.",group:"Energia"}
];
function initials(title){return title.split(/\s+/).slice(0,2).map(word=>word[0]).join("").toUpperCase()}
function ExplorarPanel({showPanel}){const[query,setQuery]=React.useState(""),[group,setGroup]=React.useState("Todo"),groups=["Todo",...Array.from(new Set(SERVICES.map(item=>item.group)))],items=React.useMemo(()=>{const q=query.trim().toLowerCase();return SERVICES.filter(item=>(group==="Todo"||item.group===group)&&(!q||`${item.title} ${item.desc} ${item.group}`.toLowerCase().includes(q)))},[query,group]);return jsx.jsxs("div",{className:"z-panel-modern z-explore-clean",children:[jsx.jsxs("header",{className:"z-panel-head z-explore-head",children:[jsx.jsx("div",{className:"z-badge",children:"Explorar"}),jsx.jsxs("h1",{className:"z-title-lg",children:["Elige tu ",jsx.jsx("br",{}),jsx.jsx("strong",{children:"lectura"})]}),jsx.jsx("p",{className:"z-lead",children:"Todas las herramientas de ZODI en un espacio limpio, ordenado y facil de leer."})]}),jsx.jsxs("div",{className:"z-hub-toolbar",children:[jsx.jsx("input",{className:"z-hub-search",value:query,onChange:event=>setQuery(event.target.value),placeholder:"Buscar tarot, amor, carta, semana...",ariaLabel:"Buscar lecturas"}),jsx.jsx("div",{className:"z-hub-filters",children:groups.map(item=>jsx.jsx("button",{className:`mtab ${group===item?"on":""}`,onClick:()=>setGroup(item),children:item},item))})]}),jsx.jsx("div",{className:"z-service-grid z-service-grid-clean",children:items.map((item,index)=>jsx.jsxs(motion.div,{initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{delay:index*.025},whileTap:{scale:.99},onClick:()=>showPanel(item.id),onKeyDown:event=>{(event.key==="Enter"||event.key===" ")&&showPanel(item.id)},role:"button",tabIndex:0,className:"z-card z-service-card z-service-card-clean",children:[jsx.jsx("div",{className:"z-service-mark",children:initials(item.title)}),jsx.jsxs("div",{className:"z-service-copy",children:[jsx.jsx("div",{className:"flabel",children:item.group}),jsx.jsx("h3",{children:item.title}),jsx.jsx("p",{children:item.desc})]})]},item.id))}),items.length===0&&jsx.jsxs("div",{className:"z-card",children:[jsx.jsx("div",{className:"z-badge",children:"Sin resultados"}),jsx.jsx("p",{children:"Prueba con tarot, amor, carta, suenos o semana."})]})]})}
export{ExplorarPanel as default};
