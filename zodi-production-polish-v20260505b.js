const suspicious = /[\u00c3\u00c2\u00e2\u00f0\u00ef\ufffd]/;

const directFixes = new Map([
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

function normalizeImages(root = document) {
  root.querySelectorAll('img[src*="/signs/"], img[src*="zodi-logo"], .z-sidebar-logo img').forEach(img => {
    img.decoding = "async";
    img.loading = img.closest(".z-today-hero, .z-onboarding-card, .z-sidebar-brand") ? "eager" : "lazy";
    img.style.objectFit = "contain";
    img.style.height = "auto";
  });
}

function runPolish(root) {
  repairTextNodes(root);
  normalizeImages(root instanceof Element ? root : document);
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
