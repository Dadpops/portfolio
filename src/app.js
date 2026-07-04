/* =============================================================================
 * app.js — render, flip, filter, modal.
 *
 * Everything visible in "Now building" and "Selected work" is generated here
 * from projects.js. No project content is hand-written in the HTML.
 * =========================================================================== */

import { projects } from "./projects.js?v=9";

/* ── tiny helpers ──────────────────────────────────────────────────────── */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Escape user/content strings before injecting as HTML. */
function esc(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── smart link → { label, href, quiet, render } ───────────────────────── */
function resolveLink(link) {
  if (!link || link.type === "none") return null;
  const url = (link.url || "").trim();
  switch (link.type) {
    case "demo":
      return url ? { label: "Live demo ↗", href: url } : null;
    case "repo":
      return url ? { label: "View source ↗", href: url } : null;
    case "prototype":
      // quiet, non-navigating control; opening the modal is handled by card click
      return { label: "Prototype", quiet: true, title: "Not yet public" };
    default:
      return null;
  }
}

/** Build the primary smart-link button HTML for a card face (never a dead link). */
function smartLinkHTML(project) {
  const resolved = resolveLink(project.link);
  if (!resolved) return ""; // type:"none" or missing url → render nothing
  if (resolved.quiet) {
    return `<span class="smart-link smart-link--quiet" title="${esc(resolved.title)}">
              🔒 ${esc(resolved.label)}
            </span>`;
  }
  return `<a class="smart-link" href="${esc(resolved.href)}" target="_blank"
             rel="noopener noreferrer" data-stop>
            ${esc(resolved.label)}
          </a>`;
}

/* ── screenshot or graceful placeholder ────────────────────────────────── */
function shotHTML(project) {
  if (project.screenshot) {
    return `<img src="${esc(project.screenshot)}"
                 alt="${esc(project.screenshotAlt || project.name + " screenshot")}"
                 width="1600" height="1000"
                 onerror="this.replaceWith(makePlaceholder('${esc(project.name)}'))" />`;
  }
  return placeholderMarkup(project.name);
}
function placeholderMarkup(name) {
  return `<div class="shot-placeholder"><span>${esc(name)}<small>screenshot soon</small></span></div>`;
}
// used by the <img onerror> fallback so a broken/absent file still looks intentional
window.makePlaceholder = function (name) {
  const div = document.createElement("div");
  div.className = "shot-placeholder";
  div.innerHTML = `<span>${esc(name)}<small>screenshot soon</small></span>`;
  return div;
};

/* the two-tone control bar at the top of every card */
function tabsHTML(active) {
  return `
        <div class="card-tabs">
          <button class="tab tab--product${active === "product" ? " is-active" : ""}" type="button" data-face="product">Product</button>
          <button class="tab tab--tech${active === "tech" ? " is-active" : ""}" type="button" data-face="tech">Technical</button>
          <button class="tab-flip" type="button" data-flip aria-label="Switch reading"><span aria-hidden="true">⇄</span></button>
        </div>`;
}

/* ── a full project card (product / technical, swapped via the top bar) ──── */
function cardHTML(project) {
  const p = project.product || {};
  const t = project.tech || {};
  const stack = (t.stack || []).map((s) => `<span class="chip">${esc(s)}</span>`).join("");
  const link = smartLinkHTML(project);
  const foot = link ? `<div class="face-foot">${link}</div>` : "";

  return `
  <div class="card-item reveal" data-id="${esc(project.id)}" data-tags="${esc((project.tags || []).join(" "))}">
    <article class="card" tabindex="0" role="button"
             aria-label="${esc(project.name)}, open details">
      <div class="card-inner">

        <!-- Product face -->
        <div class="face face--product">
          ${tabsHTML("product")}
          <div class="shot">${shotHTML(project)}</div>
          <div class="body">
            <h3>${esc(project.name)}</h3>
            ${project.role ? `<p class="role">${esc(project.role)}</p>` : ""}
            <div class="pdo">
              ${p.problem ? `<p class="pdo-row"><b>Problem</b>${esc(p.problem)}</p>` : ""}
              ${p.decision ? `<p class="pdo-row"><b>Decision</b>${esc(p.decision)}</p>` : ""}
              ${p.outcome ? `<p class="pdo-row"><b>Outcome</b>${esc(p.outcome)}</p>` : ""}
            </div>
            ${foot}
          </div>
        </div>

        <!-- Technical face -->
        <div class="face face--tech">
          ${tabsHTML("tech")}
          <div class="body">
            <h3>${esc(project.name)}</h3>
            ${t.arch ? `<div><div class="tech-label">architecture</div><p class="tech-block">${esc(t.arch)}</p></div>` : ""}
            ${stack ? `<div><div class="tech-label">stack</div><div class="stackline">${stack}</div></div>` : ""}
            ${t.calls ? `<div><div class="tech-label">hard calls</div><p class="calls">${esc(t.calls)}</p></div>` : ""}
            ${foot}
          </div>
        </div>

      </div>
    </article>
  </div>`;
}

/* ── Background showcase: two slow vertical screenshot carousels ────────── */
// Hand-picked, most-visual screenshots. Left track scrolls up, right scrolls down.
const SHOWCASE = {
  up: [
    "assets/screens/cobbies/01-title.webp",
    "assets/screens/rift/battle.webp",
    "assets/screens/storyframe/04-character-card.webp",
    "assets/screens/cobbies/07-the-barn.webp",
    "assets/screens/shortpath/main.webp",
    "assets/screens/rift/rift-cards.webp",
    "assets/screens/cobbies/08-shop.webp"
  ],
  down: [
    "assets/screens/storyframe/01-worlds.webp",
    "assets/screens/cobbies/03-ranch.webp",
    "assets/screens/rift/menu.webp",
    "assets/screens/storyframe/05-setting-card.webp",
    "assets/screens/cobbies/09-hatchery.webp",
    "assets/screens/shortpath/search-results.webp",
    "assets/screens/cobbies/04-minigame-hub.webp"
  ]
};
function renderShowcase() {
  $$(".showcase-track").forEach((track) => {
    const imgs = SHOWCASE[track.dataset.track === "down" ? "down" : "up"] || [];
    // duplicate the set so the -50% translate loop is seamless
    track.innerHTML = [...imgs, ...imgs]
      .map((src) => `<img src="${esc(src)}" alt="" aria-hidden="true" />`)
      .join("");
  });
}

/* ── grid + filters ────────────────────────────────────────────────────── */
let activeFilter = "all";

function renderGrid() {
  const grid = $("#grid");
  // featured first, otherwise stable order
  const ordered = [...projects].sort((a, b) => (b.featured === true) - (a.featured === true));
  grid.innerHTML = ordered.map(cardHTML).join("");
  observeReveals();
}

function renderFilters() {
  const row = $("#filters");
  const counts = new Map();
  projects.forEach((p) => (p.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  const tags = [...counts.keys()].sort();

  const btn = (key, label, count) =>
    `<button class="filter-btn" type="button" data-filter="${esc(key)}"
             aria-pressed="${key === activeFilter}">
       ${esc(label)}<span class="count">${count}</span>
     </button>`;

  row.innerHTML =
    btn("all", "All", projects.length) +
    tags.map((tag) => btn(tag, tag, counts.get(tag))).join("");
}

function applyFilter(filter) {
  activeFilter = filter;
  $$("#filters .filter-btn").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.filter === filter))
  );

  let visible = 0;
  $$(".card-item").forEach((item) => {
    const tags = (item.dataset.tags || "").split(" ");
    const show = filter === "all" || tags.includes(filter);
    item.classList.toggle("is-hidden", !show);
    if (show) visible++;
  });
  $("#grid-empty").hidden = visible !== 0;
}

/* ── flip ──────────────────────────────────────────────────────────────── */
function flipCard(card) {
  card.classList.toggle("flipped");
}

/* =============================================================================
 * Modal — accessible: focus trap, Esc / click-out / ✕, restore focus
 * =========================================================================== */
const modalRoot = $("#modal-root");
const modalDialog = $(".modal", modalRoot);
const modalContent = $("#modal-content");
let lastFocused = null;

function stackChips(arr = []) {
  return arr.map((s) => `<span class="chip">${esc(s)}</span>`).join("");
}

function modalHTML(project) {
  const p = project.product || {};
  const t = project.tech || {};
  const d = project.detail || {};
  const tags = (project.tags || []).map((x) => `<span class="chip">${esc(x)}</span>`).join("");

  // narrative: detail.body (split on blank lines) or fall back to the three product beats
  let narrative = "";
  if (d.body) {
    narrative = d.body
      .split(/\n\s*\n/)
      .map((para) => `<p>${esc(para.trim())}</p>`)
      .join("");
  } else {
    narrative = [p.problem, p.decision, p.outcome]
      .filter(Boolean)
      .map((x) => `<p>${esc(x)}</p>`)
      .join("");
  }

  const metrics = (d.metrics || [])
    .map(
      (m) => `<div class="metric"><div class="metric-value">${esc(m.value)}</div>
              <div class="metric-label">${esc(m.label)}</div></div>`
    )
    .join("");

  // all links (primary + optional secondary) — modal is the one place both live
  const links = [project.link, project.link2]
    .map(resolveLink)
    .filter((r) => r && !r.quiet && r.href)
    .map(
      (r) => `<a class="btn btn--ghost" href="${esc(r.href)}" target="_blank" rel="noopener noreferrer">${esc(r.label)}</a>`
    )
    .join("");

  // media: hero screenshot + gallery, aspect-preserving; placeholder when image-less
  const galleryImgs = [project.screenshot, ...(d.gallery || [])].filter(Boolean);
  const media = galleryImgs.length
    ? `<div class="modal-gallery">${galleryImgs.map((src, i) => `
        <a href="${esc(src)}" target="_blank" rel="noopener noreferrer"
           aria-label="View ${esc(project.name)} screenshot ${i + 1} at full size">
          <img src="${esc(src)}" ${i === 0 ? 'loading="eager"' : 'loading="lazy"'} decoding="async"
               alt="${esc(project.screenshotAlt || project.name)} screenshot ${i + 1}" />
        </a>`).join("")}</div>`
    : `<div class="modal-hero">${placeholderMarkup(project.name)}</div>`;

  return `
    ${media}
    <div class="modal-body">
      <span class="modal-eyebrow">Project</span>
      <h2 id="modal-title">${esc(project.name)}</h2>
      ${project.role ? `<p class="modal-role">${esc(project.role)}</p>` : ""}
      ${tags ? `<div class="modal-tags">${tags}</div>` : ""}

      <div class="modal-narrative">${narrative}</div>

      ${metrics ? `<div class="modal-metrics">${metrics}</div>` : ""}

      <div class="modal-layers">
        <div class="layer-panel layer-panel--product">
          <h4><span class="dot"></span> Product reading</h4>
          ${p.problem ? `<div class="layer-row"><b>Problem</b>${esc(p.problem)}</div>` : ""}
          ${p.decision ? `<div class="layer-row"><b>Decision</b>${esc(p.decision)}</div>` : ""}
          ${p.outcome ? `<div class="layer-row"><b>Outcome</b>${esc(p.outcome)}</div>` : ""}
        </div>
        <div class="layer-panel layer-panel--tech">
          <h4><span class="dot"></span> Technical reading</h4>
          ${t.arch ? `<div class="layer-row"><b>Architecture</b>${esc(t.arch)}</div>` : ""}
          ${t.stack ? `<div class="layer-row"><b>Stack</b><div class="stackline">${stackChips(t.stack)}</div></div>` : ""}
          ${t.calls ? `<div class="layer-row"><b>Hard calls</b>${esc(t.calls)}</div>` : ""}
        </div>
      </div>

      ${links ? `<div class="modal-links">${links}</div>` : ""}
    </div>`;
}

function openModal(id, trigger) {
  const project = projects.find((p) => p.id === id);
  if (!project) return;
  lastFocused = trigger || document.activeElement;

  modalContent.innerHTML = modalHTML(project);
  modalRoot.hidden = false;
  document.body.classList.add("modal-open");

  // deep-link without a jump
  history.replaceState(null, "", `#project/${project.id}`);

  // focus the dialog for screen readers / keyboard
  modalDialog.focus();
  document.addEventListener("keydown", onModalKeydown);
}

/* résumé viewer — reuses the modal shell (focus trap, Esc, click-out, restore) */
function resumeHTML() {
  const pdf = "assets/kit-cabena-resume.pdf";
  return `
    <div class="modal-body">
      <span class="modal-eyebrow">Résumé</span>
      <h2 id="modal-title">Kit Cabena — Résumé</h2>
      <div class="resume-frame">
        <iframe src="${pdf}#view=FitH" title="Kit Cabena résumé (PDF)" loading="lazy"></iframe>
      </div>
      <div class="modal-links">
        <a class="btn btn--primary" href="${pdf}" download>Download PDF ↓</a>
        <a class="btn btn--ghost" href="${pdf}" target="_blank" rel="noopener noreferrer">Open in new tab ↗</a>
      </div>
    </div>`;
}
function openResumeModal(trigger) {
  lastFocused = trigger || document.activeElement;
  modalContent.innerHTML = resumeHTML();
  modalRoot.hidden = false;
  document.body.classList.add("modal-open");
  history.replaceState(null, "", "#resume");
  modalDialog.focus();
  document.addEventListener("keydown", onModalKeydown);
}

function closeModal() {
  if (modalRoot.hidden) return;
  modalRoot.hidden = true;
  document.body.classList.remove("modal-open");
  document.removeEventListener("keydown", onModalKeydown);
  if (location.hash.startsWith("#project/") || location.hash === "#resume") history.replaceState(null, "", location.pathname + location.search);
  if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
  lastFocused = null;
}

function onModalKeydown(e) {
  if (e.key === "Escape") { closeModal(); return; }
  if (e.key !== "Tab") return;

  // focus trap
  const focusable = $$(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    modalRoot
  ).filter((el) => el.offsetParent !== null || el === modalDialog);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ── scroll reveal (respects reduced motion) ───────────────────────────── */
let revealObserver = null;
function observeReveals() {
  const items = $$(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger for a considered feel
            setTimeout(() => entry.target.classList.add("in"), (i % 3) * 80);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }
  items.forEach((el) => revealObserver.observe(el));
}

/* =============================================================================
 * Wiring
 * =========================================================================== */
function wireEvents() {
  // click delegation across the whole document
  document.addEventListener("click", (e) => {
    // flip button
    const flip = e.target.closest("[data-flip]");
    if (flip) {
      e.stopPropagation();
      flipCard(flip.closest(".card"));
      return;
    }
    // card tab (Product / Technical) → turn to that reading
    const face = e.target.closest("[data-face]");
    if (face) {
      e.stopPropagation();
      const card = face.closest(".card");
      const wantTech = face.dataset.face === "tech";
      if (card.classList.contains("flipped") !== wantTech) flipCard(card);
      return;
    }
    // real smart-links inside a card should navigate, not open the modal
    if (e.target.closest("[data-stop]")) { e.stopPropagation(); return; }

    // résumé viewer trigger (hero / contact / footer)
    const resumeBtn = e.target.closest("[data-resume]");
    if (resumeBtn) { e.preventDefault(); openResumeModal(resumeBtn); return; }

    // interactive hero demo card → flip on click
    const demo = e.target.closest(".demo-card");
    if (demo) { flipCard(demo); return; }

    // project card body → open modal
    const card = e.target.closest(".card");
    if (card) {
      const id = card.closest(".card-item")?.dataset.id;
      if (id) openModal(id, card);
      return;
    }

    // filter buttons
    const filter = e.target.closest("[data-filter]");
    if (filter) { applyFilter(filter.dataset.filter); return; }

    // modal close (backdrop or ✕)
    if (e.target.closest("[data-close]")) { closeModal(); return; }
  });

  // keyboard: Enter/Space on a focused card opens it; keep flip on its own button
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card || e.target !== card) return;
    e.preventDefault();
    if (card.classList.contains("demo-card")) { flipCard(card); return; }
    const id = card.closest(".card-item")?.dataset.id;
    if (id) openModal(id, card);
  });

  // wire the [ASK ME] identity links from a single config (kept in one place)
  applyIdentityLinks();
}

/* ── identity links: fill real URLs here once, applies everywhere ──────── */
// [ASK ME] — set these two once and both header/footer/contact update.
const IDENTITY = {
  github: "https://github.com/Dadpops",
  linkedin: "https://www.linkedin.com/in/kitcabena/"
};
function applyIdentityLinks() {
  ["github", "linkedin"].forEach((key) => {
    const url = (IDENTITY[key] || "").trim();
    $$(`[data-ask="${key}"]`).forEach((el) => {
      if (url) {
        el.href = url;
        const hint = $("[data-ask-hint]", el);
        if (hint) hint.textContent = "open ↗";
      } else {
        // no dead link: disable navigation, keep it visibly "coming"
        el.setAttribute("aria-disabled", "true");
        el.addEventListener("click", (e) => e.preventDefault());
        el.removeAttribute("target");
      }
    });
  });
}

/* ── open a modal if the URL is a deep-link on load ────────────────────── */
function openFromHash() {
  if (location.hash === "#resume") { openResumeModal(null); return; }
  const m = location.hash.match(/^#project\/(.+)$/);
  if (m) openModal(decodeURIComponent(m[1]), null);
}

/* ── boot ──────────────────────────────────────────────────────────────── */
function init() {
  $("#year").textContent = new Date().getFullYear();
  renderShowcase();
  renderFilters();
  renderGrid();
  wireEvents();
  openFromHash();
}

document.addEventListener("DOMContentLoaded", init);
