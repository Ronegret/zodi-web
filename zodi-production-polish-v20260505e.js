const suspicious = /[\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd]/;

const directFixes = new Map([
  ["Firebase conectado", ""],
  ["firebase conectado", ""],
  ["FIREBASE CONECTADO", ""],
  ["Firebase", "ZODI"],
  ["firebase", "ZODI"],
  ["Sistema conectado", ""],
  ["SISTEMA_DE_CONEXIONES_V2.0", "COMUNIDAD ZODI"],
  ["CONEXIONES [1]", "Contactos"],
  ["BUSCAR_ALIAS", "Buscar alias"],
  ["TU CIRCULO C\u00d3SMICO", "Tu circulo astral"],
  ["TU C\u00cdRCULO C\u00d3SMICO", "Tu circulo astral"],
  ["C\uFFFDSMICO", "astral"],
  ["C\uFFFD SMICO", "astral"],
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

function runPolish(root) {
  repairTextNodes(root);
  repairAttributes(root instanceof Element ? root : document);
  normalizeImages(root instanceof Element ? root : document);
  cleanButtons(root instanceof Element ? root : document);
  polishMobileNavigation(root instanceof Element ? root : document);
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
