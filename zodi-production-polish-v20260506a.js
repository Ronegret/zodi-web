const suspicious = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd\u00e1\u203a\u0161]/;

const directFixes = new Map([
  ["Firebase conectado", ""],
  ["firebase conectado", ""],
  ["FIREBASE CONECTADO", ""],
  ["Firebase", "ZODI"],
  ["firebase", "ZODI"],
  ["Sistema conectado", ""],
  ["ANLISIS", "ANALISIS"],
  ["Anlisis", "Analisis"],
  ["ANÁLISIS", "ANALISIS"],
  ["energtica", "energetica"],
  ["estn", "estan"],
  ["est quieto", "esta quieto"],
  ["ms antiguo", "mas antiguo"],
  ["nadie ms", "nadie mas"],
  ["Humor cido", "Humor acido"],
  ["verdades incmodas", "verdades incomodas"],
  ["DESTRUCCIN", "DESTRUCCION"],
  ["ORCULO_NRDICO", "ORACULO_NORDICO"],
  ["SISTEMA_DE_CONEXIONES_V2.0", "COMUNIDAD ZODI"],
  ["CONEXIONES [1]", "Contactos"],
  ["BUSCAR_ALIAS", "Buscar alias"],
  ["EMAIL O USUARIO", "Email o usuario"],
  ["CONTRASENA", "Contrasena"],
  ["ENTRAR A ZODI", "Entrar"],
  ["\u00bfSIN EXPEDIENTE? REG\u00cdSTRATE", "Registrate aqui"],
  ["TU CIRCULO C\u00d3SMICO", "Tu circulo astral"],
  ["TU C\u00cdRCULO C\u00d3SMICO", "Tu circulo astral"],
  ["TU C\u001cSMICO", "Tu circulo astral"],
  ["C\u001cSMICO", "ASTRAL"],
  ["C\uFFFDSMICO", "astral"],
  ["C\uFFFD SMICO", "astral"],
  ["EL VACO C\u001cSMICO", "Tu circulo esta esperando"],
  ["EL VACIO C\u001cSMICO", "Tu circulo esta esperando"],
  ["INICIAR BASQUEDA X", "Buscar amigos"],
  ["INICIAR BUSQUEDA X", "Buscar amigos"],
  ["VER TRNSITOS ACTIVOS X:\u000f", "Ver transitos activos"],
  ["VER TRANSITOS ACTIVOS X:\u000f", "Ver transitos activos"],
  ["VER TRNSITOS ACTIVOS X", "Ver transitos activos"],
  ["VER TRANSITOS ACTIVOS X", "Ver transitos activos"],
  ["GENERAR VERDICTO NEGRO X\u0019", "Generar lectura"],
  ["GENERAR VERDICTO NEGRO X", "Generar lectura"],
  ["TIRAR LAS RUNAS A\uFFFD", "Tirar las runas"],
  ["X& SUAVE", "Suave"],
  ["XR MEDIO", "Medio"],
  ["X\u0019 BRUTAL", "Brutal"],
  ["xRR", ""],
  ["\u00e1\u203a\u0178 \u00e1\u0161\u00a6 \u00e1\u0161", "Runas listas"],
  ["GUARDAR_CAMBIOS \uFFFDS\uFFFD", "Guardar cambios"],
  ["\uFFFDS\uFFFD", ""],
  ["\uFFFDX-\uFFFD", ""],
  ["\uFFFD", ""],
  ["ZODI_USER_PROFILE", "Mi perfil"],
  ["SISTEMA_VITAL", "Datos personales"],
  ["N\uFFFDaCLEO_ASTRAL", "Lectura base"],
  ["N\uFFFDaCLEO_DE_DATOS", "Datos del perfil"],
  ["SISTEMA_DE_PAGO", "Plan y acceso"],
  ["MATRIZ_SIGNOS", "Signo zodiacal"],
  ["VIBRACI\uFFFDN_DESTINO", "Numero de vida"],
  ["EDITAR_PERFIL", "Editar perfil"],
  ["SUSCRIPCI\uFFFDN", "Plan"],
  ["BIOMETR\u00cdA", "Resumen"],
  ["BIOMETRIA", "Resumen"],
  ["contrase\u00c3\u00b1a", "contrasena"],
  ["HOR\u00c3\u0192\u00e2\u20ac\u0153SCOPO", "HOROSCOPO"],
  ["ZOD\u00c3\u0192\u00c2\u008dACO", "ZODIACO"],
  ["SABIDUR\u00c3\u0192\u00c2\u008dA", "SABIDURIA"],
  ["OR\u00c3\u0192\u00c2\u0081CULO", "ORACULO"],
  ["REVELACI\u00c3\u0192\u00e2\u20ac\u0153N", "REVELACION"],
  ["Predicci\u00c3\u00b3n", "Prediccion"],
  ["Predicci\u00c3\u0192\u00c2\u00b3n", "Prediccion"],
  ["Pron\u00c3\u00b3stico", "Pronostico"],
  ["Pron\u00c3\u0192\u00c2\u00b3stico", "Pronostico"],
  ["d\u00c3\u00adas", "dias"],
  ["d\u00c3\u0192\u00c2\u00adas", "dias"],
  ["m\u00c3\u00adstico", "mistico"],
  ["m\u00c3\u0192\u00c2\u00adstico", "mistico"],
  ["energ\u00c3\u00ada", "energia"],
  ["energ\u00c3\u0192\u00c2\u00ada", "energia"],
  ["a\u00c3\u00b1o", "ano"],
  ["a\u00c3\u0192\u00c2\u00b1o", "ano"],
  ["Drag\u00c3\u00b3n", "Dragon"],
  ["Drag\u00c3\u0192\u00c2\u00b3n", "Dragon"],
  ["C\u00c3\u00a1ncer", "Cancer"],
  ["G\u00c3\u00a9minis", "Geminis"],
  ["J\u00c3\u00bapiter", "Jupiter"],
  ["Plut\u00c3\u00b3n", "Pluton"],
  ["Picis", "Piscis"],
  ["\u00e2\u2122\u02c6", "Aries"],
  ["\u00e2\u2122\u2030", "Tauro"],
  ["\u00e2\u2122\u0160", "Geminis"],
  ["\u00e2\u2122\u2039", "Cancer"],
  ["\u00e2\u2122\u0152", "Leo"],
  ["\u00e2\u2122\u008d", "Virgo"],
  ["\u00e2\u2122\u017d", "Libra"],
  ["\u00e2\u2122\u008f", "Escorpio"],
  ["\u00e2\u2122\u0090", "Sagitario"],
  ["\u00e2\u2122\u2018", "Capricornio"],
  ["\u00e2\u2122\u2019", "Acuario"],
  ["\u00e2\u2122\u201c", "Piscis"]
]);

function decodeOnce(text) {
  if (!suspicious.test(text)) return text;
  try {
    const bytes = Uint8Array.from(Array.from(text), char => char.charCodeAt(0) & 255);
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return text;
  }
}

function repairText(text) {
  let next = text;
  for (const [from, to] of directFixes) next = next.replaceAll(from, to);
  for (let i = 0; i < 2 && suspicious.test(next); i += 1) {
    const decoded = decodeOnce(next);
    if (decoded === next) break;
    next = decoded;
  }
  for (const [from, to] of directFixes) next = next.replaceAll(from, to);
  next = next
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\ufffd]/g, "")
    .replace(/\bC\s*SMICO\b/gi, "ASTRAL")
    .replace(/\bTRNSITOS\b/gi, "TRANSITOS")
    .replace(/\bBASQUEDA\b/gi, "BUSQUEDA")
    .replace(/\s{2,}/g, " ");
  return next;
}

function repairTextNodes(root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const repaired = repairText(node.nodeValue);
    if (repaired !== node.nodeValue) node.nodeValue = repaired;
  }
}

function repairAttributes(root = document) {
  const scope = root instanceof Element ? root : document;
  scope.querySelectorAll("[placeholder], [aria-label], [title], [alt]").forEach(node => {
    ["placeholder", "aria-label", "title", "alt"].forEach(attr => {
      const value = node.getAttribute(attr);
      if (!value) return;
      const repaired = repairText(value);
      if (repaired !== value) node.setAttribute(attr, repaired);
    });
  });
}

function normalizeImages(root = document) {
  root.querySelectorAll('img[src*="/signs/"], img[src*="zodi-logo"], .z-sidebar-logo img').forEach(img => {
    img.decoding = "async";
    img.loading = img.closest(".z-today-hero, .z-onboarding-card, .z-sidebar-brand") ? "eager" : "lazy";
    img.style.objectFit = "contain";
    img.style.height = "auto";
  });
}

function cleanButtons(root = document) {
  root.querySelectorAll("button").forEach(button => {
    const text = button.textContent.trim();
    if (/^\W{1,4}$/.test(text) || /[\ufffd]/.test(text)) {
      if (button.closest(".z-profile-avatar")) button.textContent = "Editar";
      else if (/guardar/i.test(text)) button.textContent = "Guardar cambios";
      else button.setAttribute("aria-label", "Accion");
    }
    const repaired = repairText(text);
    if (repaired && repaired !== text) button.textContent = repaired;
    if (/^entrar a zodi$/i.test(button.textContent.trim())) button.textContent = "Entrar";
    if (/ver transitos activos/i.test(button.textContent)) button.textContent = "Ver transitos activos";
    if (/generar veredicto|generar verdict/i.test(button.textContent)) button.textContent = "Generar lectura";
    if (/tirar las runas/i.test(button.textContent)) button.textContent = "Tirar las runas";
    if (/iniciar busqueda/i.test(button.textContent)) button.textContent = "Buscar amigos";
  });
}

const signImageMap = {
  acuario: "/signs/acuario.png",
  aries: "/signs/aries.png",
  cancer: "/signs/cancer.png",
  capricornio: "/signs/capricornio.png",
  escorpio: "/signs/escorpio.png",
  geminis: "/signs/geminis.png",
  leo: "/signs/leo.png",
  libra: "/signs/libra.png",
  piscis: "/signs/piscis.png",
  sagitario: "/signs/sagitario.png",
  tauro: "/signs/tauro.png",
  virgo: "/signs/virgo.png"
};

function currentSign(root = document) {
  const text = (root.textContent || document.body.textContent || "").toLowerCase();
  return Object.keys(signImageMap).find(sign => text.includes(sign)) || "escorpio";
}

function setTextIfMatches(selector, matcher, value, root = document) {
  root.querySelectorAll(selector).forEach(node => {
    const text = node.textContent || "";
    if (text.trim().length < 140 && node.children.length <= 1 && matcher(text, node)) node.textContent = value;
  });
}

function normalizeKnownCopy(root = document) {
  const scope = root instanceof Element ? root : document;

  scope.querySelectorAll(".z-panel-modern h1, .z-title-lg, h1").forEach(title => {
    const raw = title.textContent || "";
    const lower = raw.toLowerCase();
    if (lower.includes("clima") && (lower.includes("smico") || /c\s+smico/i.test(raw))) {
      title.textContent = "CLIMA ASTRAL";
    }
    if ((lower.includes("circulo") || lower.includes("círculo")) && (lower.includes("smico") || /c\s+smico/i.test(raw))) {
      title.textContent = "TU CIRCULO ASTRAL";
    }
  });

  setTextIfMatches("span, div, p, strong, em, button, h2, h3", text => /el vac|vaco|vacio|xrr/i.test(text), "Tu circulo esta esperando", scope);
  setTextIfMatches("button", text => /iniciar bus|buscar/i.test(text) && /x$/i.test(text.trim()), "Buscar amigos", scope);

  scope.querySelectorAll("button.mtab, .mtab").forEach(button => {
    const text = repairText(button.textContent || "").toLowerCase();
    if (text.includes("suave")) button.innerHTML = '<span class="z-clean-icon">Brisa</span><strong>Suave</strong>';
    if (text.includes("medio")) button.innerHTML = '<span class="z-clean-icon">Rayo</span><strong>Medio</strong>';
    if (text.includes("brutal")) button.innerHTML = '<span class="z-clean-icon">Fuego</span><strong>Brutal</strong>';
  });

  scope.querySelectorAll("span, div").forEach(node => {
    const text = node.textContent || "";
    if (/[\u00e1\u203a\u0161]/.test(text) || /Runas listas/.test(text)) {
      if (node.children.length === 0) node.textContent = "Runas listas";
    }
    if (node.closest(".z-card") && node.children.length === 0 && /^x$/i.test(text.trim())) {
      node.textContent = "";
      node.setAttribute("aria-hidden", "true");
    }
  });

  scope.querySelectorAll(".z-connected-symbol").forEach(node => {
    if (node.querySelector("img")) return;
    const sign = currentSign(document);
    node.textContent = "";
    const img = document.createElement("img");
    img.className = "z-sign-logo";
    img.src = signImageMap[sign];
    img.alt = sign;
    node.appendChild(img);
  });

  scope.querySelectorAll(".z-login-shell button").forEach(button => {
    const text = button.textContent.trim();
    if (/^volver$/i.test(text)) button.textContent = "Volver";
    if (/entrar/i.test(text) && /zodi/i.test(text)) button.textContent = "Entrar";
  });
  scope.querySelectorAll(".z-login-shell span, .z-login-shell a, .z-login-shell div").forEach(node => {
    const text = node.textContent.trim();
    if (/sin expediente|registr/i.test(text) && text.length < 60) node.textContent = "Registrate aqui";
  });

  scope.querySelectorAll(".z-horoscope-quote").forEach(node => {
    if ((node.textContent || "").length < 260) {
      node.textContent = "Escorpio, tu intuicion esta fina y hoy funciona como una antena: percibes cambios antes de que otros los nombren. Usa esa claridad para ordenar prioridades, hablar con honestidad y proteger tu energia sin encerrarte. Si aparece una duda emocional, no la conviertas en pelicula completa; pregunta, escucha y decide con calma. El dia favorece conversaciones pendientes, ajustes de rutina y una decision pequena que puede desbloquear algo grande durante la semana.";
    }
  });

  scope.querySelectorAll(".z-oracle-card p, .z-today-aside .acid p").forEach(node => {
    if ((node.textContent || "").length < 230) {
      node.textContent = "Hoy el cosmos te pide intensidad con direccion. No se trata de apagar tu fuego, sino de elegir donde ponerlo: una tarea concreta, una conversacion necesaria o un limite sano. Evita leer senales donde solo hay cansancio y observa los hechos. Si actuas desde calma, tu magnetismo sube y la gente correcta entiende tu mensaje sin que tengas que perseguir respuestas.";
    }
  });
}

function enhancePalmReading(root = document) {
  const panel = document.querySelector(".z-panel-modern");
  if (!panel || panel.querySelector(".z-palm-widget")) return;
  const text = (panel.textContent || "").toLowerCase();
  if (!/carta natal|numerologia|nombres|explorar|horoscopo hoy|escorpio estado actual/.test(text)) return;

  const widget = document.createElement("section");
  widget.className = "z-card z-palm-widget";
  widget.innerHTML = `
    <div class="z-widget-kicker">Quiromancia visual</div>
    <h2>Lectura de manos</h2>
    <p>Sube una foto clara de la palma izquierda y otra de la derecha. La lectura combina linea de vida, mente, corazon, montes y equilibrio entre pasado y accion presente.</p>
    <div class="z-palm-grid">
      <label><span>Palma izquierda</span><input type="file" accept="image/*" data-palm="left"><img alt=""></label>
      <label><span>Palma derecha</span><input type="file" accept="image/*" data-palm="right"><img alt=""></label>
    </div>
    <button class="z-btn z-btn-acid" type="button" data-palm-read>Generar lectura de manos</button>
    <div class="z-palm-result" aria-live="polite">Cuando subas tus imagenes, ZODI preparara una lectura extensa y facil de leer.</div>
  `;
  panel.appendChild(widget);

  widget.querySelectorAll("input[type=file]").forEach(input => {
    input.addEventListener("change", event => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      const img = event.currentTarget.closest("label").querySelector("img");
      if (file && img) {
        img.src = URL.createObjectURL(file);
        img.style.display = "block";
      }
    });
  });

  widget.querySelector("[data-palm-read]").addEventListener("click", () => {
    const hasLeft = widget.querySelector('[data-palm="left"]').files.length > 0;
    const hasRight = widget.querySelector('[data-palm="right"]').files.length > 0;
    widget.querySelector(".z-palm-result").textContent = hasLeft || hasRight
      ? "Lectura preliminar: la mano izquierda habla de tu base emocional y memoria intuitiva; la derecha muestra como estas usando esa energia ahora. ZODI observa un patron de voluntad fuerte, necesidad de autonomia y sensibilidad alta ante cambios de ambiente. Si la linea del corazon aparece marcada, conviene expresar afecto sin medir tanto el riesgo. Si la linea de la mente domina, tu desafio es bajar la exigencia y confiar en decisiones simples. Para una lectura mas fina, sube ambas palmas con buena luz y sin sombras fuertes."
      : "Sube al menos una foto de la palma para generar la lectura.";
  });
}

function enhanceFriendsCommunity(root = document) {
  const panel = document.querySelector(".z-panel-modern");
  if (!panel || panel.querySelector(".z-community-wall")) return;
  const text = (panel.textContent || "").toLowerCase();
  if (!/circulo|círculo|comunidad|amigos|contactos/.test(text)) return;

  const empty = Array.from(panel.querySelectorAll(".z-card, section")).find(card => /tu circulo esta esperando|aun no tienes conexiones|vacio/i.test(card.textContent || ""));
  if (empty) {
    empty.innerHTML = `
      <div class="z-widget-kicker">Comunidad ZODI</div>
      <h2>Tu circulo esta esperando</h2>
      <p>Agrega amigos por alias, publica tu energia del dia y compara compatibilidad sin exponer datos privados.</p>
      <button class="z-btn z-btn-acid" type="button">Buscar amigos</button>
    `;
  }

  const wall = document.createElement("section");
  wall.className = "z-card z-community-wall";
  wall.innerHTML = `
    <div class="z-widget-kicker">Muro de amigos</div>
    <h2>Estado del dia</h2>
    <textarea placeholder="Cuenta como viene tu energia hoy, una sincronia rara o una broma de compatibilidad..."></textarea>
    <button class="z-btn z-btn-acid" type="button" data-z-post>Publicar estado</button>
    <div class="z-post-list">
      <article><strong>@luna</strong><p>Hoy mi carta dice calma, pero mi compatibilidad con Aries dice drama elegante.</p></article>
      <article><strong>@sol</strong><p>Vibracion 7: desaparezco, vuelvo con cafe y una teoria nueva.</p></article>
    </div>
  `;

  const compat = document.createElement("section");
  compat.className = "z-card z-friend-compat";
  compat.innerHTML = `
    <div class="z-widget-kicker">Compatibilidad general</div>
    <h2>Analiza un amigo</h2>
    <div class="z-compat-grid">
      <input placeholder="Alias de la otra persona">
      <select>
        <option>Aries</option><option>Tauro</option><option>Geminis</option><option>Cancer</option><option>Leo</option><option>Virgo</option><option>Libra</option><option>Escorpio</option><option>Sagitario</option><option>Capricornio</option><option>Acuario</option><option>Piscis</option>
      </select>
      <input type="date">
    </div>
    <button class="z-btn" type="button" data-z-compat>Calcular compatibilidad</button>
    <div class="z-compat-result">ZODI comparara signo solar, numero de vida, tono emocional y ritmo social.</div>
  `;
  panel.appendChild(wall);
  panel.appendChild(compat);

  wall.querySelector("[data-z-post]").addEventListener("click", () => {
    const textarea = wall.querySelector("textarea");
    const value = textarea.value.trim();
    if (!value) return;
    const article = document.createElement("article");
    article.innerHTML = `<strong>@tu</strong><p>${value.replace(/[<>]/g, "")}</p>`;
    wall.querySelector(".z-post-list").prepend(article);
    textarea.value = "";
  });

  compat.querySelector("[data-z-compat]").addEventListener("click", () => {
    const alias = compat.querySelector("input").value.trim() || "esa persona";
    const sign = compat.querySelector("select").value;
    compat.querySelector(".z-compat-result").textContent = `Compatibilidad con ${alias}: tu energia busca profundidad y ${sign} aporta una frecuencia distinta que puede activar aprendizaje. En horoscopo se revisa atraccion, comunicacion y manejo de conflicto; en numerologia se compara ritmo de vida y forma de tomar decisiones. Resultado general: buena conexion si ambos respetan tiempos, hablan claro y no usan el silencio como prueba.`;
  });
}

function polishMobileNavigation(root = document) {
  const header = document.querySelector(".mobile-header");
  if (header) {
    const shell = header.firstElementChild;
    if (shell) shell.setAttribute("data-z-mobile-header-shell", "true");
    const logo = header.querySelector('img[src*="zodi-logo"]');
    if (logo) logo.setAttribute("data-z-mobile-logo", "true");
    const menuButton = Array.from(header.querySelectorAll("div")).find(node => {
      const style = getComputedStyle(node);
      return style.cursor === "pointer" && style.flexDirection === "column" && style.gap !== "normal";
    });
    if (menuButton) {
      menuButton.setAttribute("data-z-mobile-menu-button", "true");
      menuButton.setAttribute("role", "button");
      menuButton.setAttribute("aria-label", "Abrir menu");
    }
  }

  document.querySelectorAll("div").forEach(node => {
    const style = node.style;
    if (style.position === "fixed" && style.zIndex === "1001" && style.width) {
      node.setAttribute("data-z-mobile-drawer", "true");
      const closeButton = node.querySelector("button");
      if (closeButton && closeButton.textContent.trim() === "\u00d7") {
        closeButton.setAttribute("aria-label", "Cerrar menu");
      }
    }
    if (style.position === "fixed" && style.zIndex === "1000" && style.background.includes("rgba")) {
      node.setAttribute("data-z-mobile-scrim", "true");
    }
  });
}

const planDetails = {
  gratis: [
    "30 dias de acceso completo mientras activamos pagos.",
    "Horoscopo diario, semana y mes.",
    "Numerologia base y significado de nombres.",
    "Compatibilidad simple y perfil editable.",
    "Notificaciones basicas cuando el modulo este activo."
  ],
  pro: [
    "Todo lo del plan Gratis durante la prueba.",
    "Lecturas largas y explicadas en cada resultado.",
    "Carta natal, compatibilidades y ciclos numerologicos avanzados.",
    "Historial de consultas y tono personalizado.",
    "Notificaciones astrales prioritarias cuando se activen."
  ],
  eterno: [
    "Pago unico futuro, sin mensualidad.",
    "Acceso permanente a funciones premium actuales.",
    "Nuevos modulos incluidos cuando se publiquen.",
    "Perfil, datos y preferencias siempre editables.",
    "Soporte prioritario para incidencias de acceso."
  ]
};

function planKeyFromText(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("cosmos pro") || normalized.includes("5")) return "pro";
  if (normalized.includes("eterno") || normalized.includes("49")) return "eterno";
  if (normalized.includes("gratis") || normalized.includes("0")) return "gratis";
  return "";
}

function enhancePlanDetails(root = document) {
  const scope = root instanceof Element ? root : document;
  scope.querySelectorAll(".z-final-plan, .z-plan-card, .z-plan-clean").forEach(card => {
    if (card.querySelector(".z-plan-detail-list")) return;
    const key = planKeyFromText(card.textContent || "");
    if (!key) return;
    const list = document.createElement("ul");
    list.className = "z-plan-detail-list";
    planDetails[key].forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    const note = document.createElement("p");
    note.className = "z-plan-payment-note";
    note.textContent = "Cobro no activo: por ahora todos los servicios se entregan gratis durante 30 dias.";
    card.appendChild(list);
    card.appendChild(note);
  });
}

function runPolish(root) {
  repairTextNodes(root);
  repairAttributes(root instanceof Element ? root : document);
  normalizeImages(root instanceof Element ? root : document);
  cleanButtons(root instanceof Element ? root : document);
  normalizeKnownCopy(root instanceof Element ? root : document);
  polishMobileNavigation(root instanceof Element ? root : document);
  enhancePlanDetails(root instanceof Element ? root : document);
  enhancePalmReading(root instanceof Element ? root : document);
  enhanceFriendsCommunity(root instanceof Element ? root : document);
}

const observer = new MutationObserver(records => {
  for (const record of records) {
    record.addedNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const repaired = repairText(node.nodeValue);
        if (repaired !== node.nodeValue) node.nodeValue = repaired;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        runPolish(node);
      }
    });
  }
});

function start() {
  runPolish(document.body);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setInterval(() => runPolish(document.body), 1600);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
