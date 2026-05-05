const SIGNS=[
  {id:"aries",em:"\u2648",name:"Aries",dates:"21 mar - 19 abr",el:"Fuego",planet:"Marte",color:"#ff6b35",desc:"Arranca primero y pregunta despues."},
  {id:"tauro",em:"\u2649",name:"Tauro",dates:"20 abr - 20 may",el:"Tierra",planet:"Venus",color:"#d9a66a",desc:"Terco, sensual y mas fuerte de lo que parece."},
  {id:"geminis",em:"\u264a",name:"Geminis",dates:"21 may - 20 jun",el:"Aire",planet:"Mercurio",color:"#f2f2ea",desc:"Dos ideas por segundo y ninguna aburrida."},
  {id:"cancer",em:"\u264b",name:"Cancer",dates:"21 jun - 22 jul",el:"Agua",planet:"Luna",color:"#54e6f3",desc:"Corazon gigante, memoria peligrosa."},
  {id:"leo",em:"\u264c",name:"Leo",dates:"23 jul - 22 ago",el:"Fuego",planet:"Sol",color:"#ff9b2f",desc:"Brilla aunque diga que no quiere atencion."},
  {id:"virgo",em:"\u264d",name:"Virgo",dates:"23 ago - 22 sep",el:"Tierra",planet:"Mercurio",color:"#c79b7b",desc:"Ve el fallo antes que nadie y lo arregla mejor."},
  {id:"libra",em:"\u264e",name:"Libra",dates:"23 sep - 22 oct",el:"Aire",planet:"Venus",color:"#f4f0ea",desc:"Busca paz, pero atrae drama con estilo."},
  {id:"escorpio",em:"\u264f",name:"Escorpio",dates:"23 oct - 21 nov",el:"Agua",planet:"Pluton",color:"#54e6f3",desc:"Intenso, leal y con detector de mentiras."},
  {id:"sagitario",em:"\u2650",name:"Sagitario",dates:"22 nov - 21 dic",el:"Fuego",planet:"Jupiter",color:"#ff7b32",desc:"Libre, directo y dificil de encerrar."},
  {id:"capricornio",em:"\u2651",name:"Capricornio",dates:"22 dic - 19 ene",el:"Tierra",planet:"Saturno",color:"#d0a37d",desc:"Nacio con agenda, plan y cara de jefe."},
  {id:"acuario",em:"\u2652",name:"Acuario",dates:"20 ene - 18 feb",el:"Aire",planet:"Urano",color:"#f5f1e8",desc:"Raro, brillante y orgulloso de serlo."},
  {id:"piscis",em:"\u2653",name:"Piscis",dates:"19 feb - 20 mar",el:"Agua",planet:"Neptuno",color:"#54e6f3",desc:"Suena fuerte, siente mas fuerte todavia."}
];

const CHINESE_ZODIAC=[
  {id:"rata",em:"",name:"Rata",years:[1924,1936,1948,1960,1972,1984,1996,2008,2020],traits:"Inteligente, adaptable, estrategica"},
  {id:"buey",em:"",name:"Buey",years:[1925,1937,1949,1961,1973,1985,1997,2009,2021],traits:"Paciente, constante, fiable"},
  {id:"tigre",em:"",name:"Tigre",years:[1926,1938,1950,1962,1974,1986,1998,2010,2022],traits:"Valiente, magnetico, impulsivo"},
  {id:"conejo",em:"",name:"Conejo",years:[1927,1939,1951,1963,1975,1987,1999,2011,2023],traits:"Elegante, sensible, diplomatico"},
  {id:"dragon",em:"",name:"Dragon",years:[1928,1940,1952,1964,1976,1988,2000,2012,2024],traits:"Poderoso, carismatico, ambicioso"},
  {id:"serpiente",em:"",name:"Serpiente",years:[1929,1941,1953,1965,1977,1989,2001,2013,2025],traits:"Intuitiva, misteriosa, sabia"},
  {id:"caballo",em:"",name:"Caballo",years:[1930,1942,1954,1966,1978,1990,2002,2014,2026],traits:"Libre, veloz, apasionado"},
  {id:"cabra",em:"",name:"Cabra",years:[1931,1943,1955,1967,1979,1991,2003,2015],traits:"Creativa, sensible, artistica"},
  {id:"mono",em:"",name:"Mono",years:[1932,1944,1956,1968,1980,1992,2004,2016],traits:"Ingenioso, versatil, curioso"},
  {id:"gallo",em:"",name:"Gallo",years:[1933,1945,1957,1969,1981,1993,2005,2017,2029],traits:"Franco, trabajador, orgulloso"},
  {id:"perro",em:"",name:"Perro",years:[1934,1946,1958,1970,1982,1994,2006,2018,2030],traits:"Leal, honesto, protector"},
  {id:"cerdo",em:"",name:"Cerdo",years:[1935,1947,1959,1971,1983,1995,2007,2019,2031],traits:"Generoso, sincero, calido"}
];

const VIKING_HOROSCOPE=[
  {id:"freya",em:"",name:"Freya",dates:"21 ene - 19 feb",desc:"Amor, guerra y poder personal."},
  {id:"thor",em:"",name:"Thor",dates:"20 feb - 20 mar",desc:"Proteccion, fuerza y honestidad."},
  {id:"odin",em:"",name:"Odin",dates:"21 mar - 19 abr",desc:"Sabiduria, vision y sacrificio."},
  {id:"skadi",em:"",name:"Skadi",dates:"20 abr - 20 may",desc:"Objetivo claro y temple frio."},
  {id:"balder",em:"",name:"Balder",dates:"21 may - 20 jun",desc:"Luz, carisma y alegria."},
  {id:"heimdall",em:"",name:"Heimdall",dates:"21 jun - 22 jul",desc:"Percepcion y vigilancia."},
  {id:"tyr",em:"",name:"Tyr",dates:"23 jul - 22 ago",desc:"Honor, justicia y decision."},
  {id:"idun",em:"",name:"Idun",dates:"23 ago - 22 sep",desc:"Renovacion y juventud interior."},
  {id:"njord",em:"",name:"Njord",dates:"23 sep - 22 oct",desc:"Calma, riqueza y navegacion."},
  {id:"vidar",em:"",name:"Vidar",dates:"23 oct - 21 nov",desc:"Silencio, fuerza y destino."},
  {id:"ull",em:"",name:"Ull",dates:"22 nov - 21 dic",desc:"Precision y movimiento."},
  {id:"frigg",em:"",name:"Frigg",dates:"22 dic - 20 ene",desc:"Hogar, destino y estrategia."}
];

const NAME_MEANINGS={
  ana:{origin:"Hebreo",meaning:"Gracia y favor",energy:"Dulzura con caracter. Parece calma, pero tiene centro fuerte."},
  maria:{origin:"Hebreo/Arameo",meaning:"La elegida, la amada",energy:"Nombre clasico con proteccion y memoria familiar."},
  carlos:{origin:"Germanico",meaning:"Persona libre",energy:"Autonomia, liderazgo y orgullo propio."},
  jose:{origin:"Hebreo",meaning:"El que suma y prospera",energy:"Constancia, trabajo y raiz familiar."},
  sofia:{origin:"Griego",meaning:"Sabiduria",energy:"Intuicion mental, mirada fina y calma aparente."},
  lucia:{origin:"Latino",meaning:"La que trae luz",energy:"Claridad, sensibilidad y presencia luminosa."},
  default:{origin:"Mixto",meaning:"Firma personal",energy:"Este nombre trae una energia propia: mezcla de historia familiar, sonido y caracter."}
};

const NUMEROLOGY_MEANINGS={1:{title:"El lider",street:"Independencia, iniciativa y fuego para abrir camino.",keywords:["Independencia","Coraje","Accion"]},2:{title:"El puente",street:"Sensibilidad, diplomacia y talento para leer ambientes.",keywords:["Intuicion","Union","Tacto"]},3:{title:"La voz creativa",street:"Expresion, humor y chispa social. Si no crea, se apaga.",keywords:["Creatividad","Alegria","Comunicacion"]},4:{title:"El constructor",street:"Orden, metodo y base solida. Va lento, pero va en serio.",keywords:["Disciplina","Raiz","Trabajo"]},5:{title:"El libre",street:"Movimiento, cambio y hambre de experiencias nuevas.",keywords:["Libertad","Cambio","Aventura"]},6:{title:"El protector",street:"Cuidado, familia, estetica y responsabilidad afectiva.",keywords:["Amor","Cuidado","Armonia"]},7:{title:"El buscador",street:"Analisis, misterio y necesidad de entender lo invisible.",keywords:["Misterio","Estudio","Verdad"]},8:{title:"El poder",street:"Ambicion, dinero, mando y capacidad de materializar.",keywords:["Poder","Abundancia","Gestion"]},9:{title:"El sabio",street:"Cierre de ciclos, compasion y mirada grande.",keywords:["Humanidad","Cierre","Servicio"]},11:{title:"El canal",street:"Numero maestro de intuicion, vision y nervio espiritual.",keywords:["Intuicion","Vision","Maestria"]},22:{title:"El arquitecto",street:"Numero maestro para construir algo grande y util.",keywords:["Legado","Construccion","Impacto"]},33:{title:"El maestro del corazon",street:"Servicio, sanacion y liderazgo desde el amor.",keywords:["Servicio","Compasion","Maestria"]}};
const PERSONAL_YEAR_MEANINGS={1:{title:"Arranque",street:"Ano para empezar de nuevo, tomar iniciativa y no pedir permiso."},2:{title:"Vinculos",street:"Ano para pactar, escuchar y elegir bien con quien caminas."},3:{title:"Expresion",street:"Ano para comunicar, crear y dejar que se note tu voz."},4:{title:"Estructura",street:"Ano para ordenar, trabajar y poner cimientos serios."},5:{title:"Cambio",street:"Ano movido: viajes, giros, decisiones y aire nuevo."},6:{title:"Cuidado",street:"Ano de hogar, amor, responsabilidad y belleza."},7:{title:"Busqueda",street:"Ano de introspeccion, estudio y verdades internas."},8:{title:"Poder",street:"Ano para dinero, autoridad y resultados visibles."},9:{title:"Cierre",street:"Ano para soltar, limpiar y terminar lo que ya cumplio."},11:{title:"Revelacion",street:"Ano maestro: intuicion alta, senales fuertes y decisiones finas."},22:{title:"Construccion mayor",street:"Ano maestro para materializar algo con impacto real."}};
const HOROSCOPE_TEXTS={fuerte:{aries:"Aries, hoy vas con el motor alto. Usalo para avanzar, no para atropellar conversaciones.",tauro:"Tauro, si algo ya no te suma, deja de llamarlo estabilidad.",geminis:"Geminis, tu mente trae veinte pestanas abiertas. Cierra diecinueve y gana el dia.",cancer:"Cancer, sentir mucho no es el problema. El problema es cargar con lo que no es tuyo.",leo:"Leo, brillas fuerte. Hoy toca escuchar antes de entrar con el reflector encendido.",virgo:"Virgo, lo perfecto te esta robando lo posible. Entrega, ajusta y sigue.",libra:"Libra, elegir tambien es cuidarte. No puedes quedar bien con todo el mundo.",escorpio:"Escorpio, tu intuicion esta fina. Usala para decidir, no para montar una pelicula completa.",sagitario:"Sagitario, la libertad no siempre es huir. A veces es quedarte donde por fin hay verdad.",capricornio:"Capricornio, descansa antes de convertirte en tu propia empresa toxica.",acuario:"Acuario, tu idea rara tiene futuro. Explicala simple y veras quien se sube.",piscis:"Piscis, hoy baja una nube y pisa tierra. Tu sueno necesita una accion concreta."}};
const ROAST_TEXTS={aries:["Impulso no siempre significa intuicion. Hoy toca frenar medio segundo."],tauro:["Cambiar no te mata, Tauro. A veces hasta te deja mas guapo."],geminis:["Geminis, decide una cosa antes de abrir otra conversacion mental."],cancer:["Cancer, no todo merece archivo emocional permanente."],leo:["Leo, el escenario sigue ahi aunque hoy compartas foco."],virgo:["Virgo, nadie pidio auditoria completa del universo. Respira."],libra:["Libra, decir que si por no molestar tambien molesta: a ti."],escorpio:["Escorpio, la sospecha no es un hobby sostenible."],sagitario:["Sagitario, otra aventura no arregla lo que evitas mirar."],capricornio:["Capricornio, productividad no es personalidad completa."],acuario:["Acuario, ser diferente no exige explicarlo cada cinco minutos."],piscis:["Piscis, romantizar senales mixtas sigue siendo autoengano con filtro bonito."]};
const STREET_GLYPHS=Object.fromEntries(SIGNS.map(sign=>[sign.id,`<img class="z-sign-glyph-img" src="/signs/${sign.id}.png" alt="${sign.name}" />`]));

function getNameMeaning(name=""){return NAME_MEANINGS[name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").split(/\s+/)[0]]||{...NAME_MEANINGS.default,meaning:`Nombre con fuerza propia: ${name||"sin revelar"}`};}
function getSignFromDate(value){if(!value)return null;const date=new Date(value),month=date.getMonth()+1,day=date.getDate();return month===3&&day>=21||month===4&&day<=19?SIGNS[0]:month===4&&day>=20||month===5&&day<=20?SIGNS[1]:month===5&&day>=21||month===6&&day<=20?SIGNS[2]:month===6&&day>=21||month===7&&day<=22?SIGNS[3]:month===7&&day>=23||month===8&&day<=22?SIGNS[4]:month===8&&day>=23||month===9&&day<=22?SIGNS[5]:month===9&&day>=23||month===10&&day<=22?SIGNS[6]:month===10&&day>=23||month===11&&day<=21?SIGNS[7]:month===11&&day>=22||month===12&&day<=21?SIGNS[8]:month===12&&day>=22||month===1&&day<=19?SIGNS[9]:month===1&&day>=20||month===2&&day<=18?SIGNS[10]:SIGNS[11];}
function getChineseZodiac(value){if(!value)return null;const year=new Date(value).getFullYear();return CHINESE_ZODIAC.find(sign=>sign.years.includes(year))||CHINESE_ZODIAC[((year-1900)%12+12)%12];}
function calcNumerology(value){if(!value)return{life:0,year:0};const reduce=input=>{let n=String(input).replace(/\D/g,"").split("").map(Number).reduce((sum,d)=>sum+d,0);while(n>9&&n!==11&&n!==22&&n!==33)n=String(n).split("").map(Number).reduce((sum,d)=>sum+d,0);return n;};const date=new Date(value);return{life:reduce(`${date.getDate()}${date.getMonth()+1}${date.getFullYear()}`),year:reduce(`${date.getDate()}${date.getMonth()+1}${new Date().getFullYear()}`)};}
function getVikingSign(value){if(!value)return null;const date=new Date(value),code=(date.getMonth()+1)*100+date.getDate();return code>=121&&code<=219?VIKING_HOROSCOPE[0]:code>=220&&code<=320?VIKING_HOROSCOPE[1]:code>=321&&code<=419?VIKING_HOROSCOPE[2]:code>=420&&code<=520?VIKING_HOROSCOPE[3]:code>=521&&code<=620?VIKING_HOROSCOPE[4]:code>=621&&code<=722?VIKING_HOROSCOPE[5]:code>=723&&code<=822?VIKING_HOROSCOPE[6]:code>=823&&code<=922?VIKING_HOROSCOPE[7]:code>=923&&code<=1022?VIKING_HOROSCOPE[8]:code>=1023&&code<=1121?VIKING_HOROSCOPE[9]:code>=1122&&code<=1221?VIKING_HOROSCOPE[10]:VIKING_HOROSCOPE[11];}

const data={SIGNS,CHINESE_ZODIAC,VIKING_HOROSCOPE,NAME_MEANINGS,NUMEROLOGY_MEANINGS,PERSONAL_YEAR_MEANINGS,HOROSCOPE_TEXTS,ROAST_TEXTS,STREET_GLYPHS,getSignFromDate,getChineseZodiac,getVikingSign,calcNumerology,getNameMeaning};
export{data as t};
