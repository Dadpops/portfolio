# Kit Cabena — Dual-Layer Portfolio

A data-driven personal portfolio whose signature is a **per-project dual-layer
flip**: every project card reads as a **Product story** (problem → decision →
outcome) or flips to a **Technical build** (architecture, stack, hard calls).
Same work, translated for whoever's reading.

- **Product face** — warm, amber, human outcome-language, screenshot-first.
- **Technical face** — cool, phosphor-cyan, mono type, a real stack line.
- Click any card for the full modal (both layers side by side, all links).

Built as **vanilla HTML/CSS/JS** on purpose: forkable, dependency-free, and
alive for years. **The whole site renders from one file — [`src/projects.js`](src/projects.js).**
Adding a project is one object and one screenshot. No markup to touch.

---

## Run it locally

No build step. Because `projects.js` is loaded as an ES module, open it through a
local server (not `file://`, which blocks module imports):

```bash
# from the project root — pick whichever you have
python -m http.server 8080
#   or
npx serve .
```

Then open <http://localhost:8080>.

---

## ➕ How to add a project (the whole point)

1. Open [`src/projects.js`](src/projects.js).
2. Copy the template below, paste it into the `projects` array, fill it in.
3. Drop a screenshot in [`assets/`](assets/) matching the `screenshot` path.
4. Save. Reload the page. Done — it's in the grid, the filters, and (if
   `featured`) the "Now building" strip automatically.

```js
{
  id: "my-project",                    // stable slug (used for #project/my-project deep-links)
  name: "My Project",
  role: "One-line description",
  tags: ["tooling", "shipped"],        // any tags; the filter row builds itself from these
  featured: false,                     // true → shows in "Now building" + sorts first

  screenshot: "assets/my-project.png", // 16:10 image. Omit → tasteful auto-placeholder
  screenshotAlt: "What the screenshot shows",

  link: {                              // the smart button — see table below
    type: "repo",                      // "demo" | "repo" | "prototype" | "none"
    url: "https://github.com/you/my-project"
  },
  // link2: { type: "demo", url: "" }, // optional; appears only in the modal

  product: {                           // the warm / PM reading (required)
    problem:  "The pain, in the user's terms.",
    decision: "The key call you made and why.",
    outcome:  "What shipped / what changed."
  },
  tech: {                              // the cool / engineer reading (required)
    arch:  "How it's put together.",
    stack: ["Thing", "Thing", "Thing"],
    calls: "The hard tradeoffs you owned."
  },

  detail: {                            // optional richer modal content
    body: "2–4 short paragraphs. Blank lines separate paragraphs.",
    gallery: [],                       // reserved for future gallery use
    metrics: [ { label: "Users", value: "700+" }, { label: "Output", value: "5×" } ]
  }
}
```

### The smart link button

The card's primary button derives entirely from `link.type` — you never wire a
dead link:

| `link.type` | Button           | Behavior                                            |
|-------------|------------------|-----------------------------------------------------|
| `demo`      | **Live demo ↗**  | opens `url` in a new tab                             |
| `repo`      | **View source ↗**| opens repo `url` in a new tab                        |
| `prototype` | **🔒 Prototype** | quiet, non-clickable label ("Not yet public")       |
| `none`      | *(hidden)*       | no button rendered                                  |

If `type` is `demo`/`repo` but `url` is empty, the button is simply omitted —
so a stubbed project never shows a link that goes nowhere.

### Graceful degradation

Everything except `id`, `name`, `product`, and `tech` is optional:

- **No `screenshot`** → an on-brand placeholder (project name + accent gradient)
  renders, so a new project looks intentional before its image exists.
- **No `detail.body`** → the modal narrative falls back to the three product beats.
- **No `metrics` / `link2` / `tags`** → those sections just don't render.

---

## 🖼 Screenshot guidance (keep the site fast)

Images are the #1 reason "continuously updated" portfolios rot. Keep them light:

- **Aspect ratio:** 16:10. The card crops with `object-fit: cover`, so any 16:10
  image fits without breaking the layout.
- **Size:** ~**1600 × 1000 px**.
- **Format:** compressed **PNG** or **WebP**. Aim for **under ~250 KB** each.
- **Location:** `assets/`, filename matching the `screenshot` field.
- Images are lazy-loaded with explicit dimensions, so they never cause layout shift.
- Broken/missing file? The card auto-falls back to the placeholder — nothing breaks.

---

## Identity & résumé links

Two spots hold "fill once, applies everywhere" values:

- **GitHub / LinkedIn:** set them once in the `IDENTITY` object near the bottom of
  [`src/app.js`](src/app.js). Until a URL is filled in, the header/footer/contact
  links render as visibly "coming" and are non-clickable (never a dead link).
- **Résumé:** replace [`assets/kit-cabena-resume.pdf`](assets/kit-cabena-resume.pdf).
  The hero and contact buttons already point at it.
- **Email:** `dadpopsdev@gmail.com`, wired as the primary contact CTA.

---

## Project structure

```
Portfolio/
├─ index.html            # sections + the single modal shell (no project content lives here)
├─ assets/
│  ├─ kit-cabena-resume.pdf
│  ├─ favicon.svg
│  ├─ og.png             # Open Graph social image (1200×630)
│  └─ *.png              # project screenshots
├─ src/
│  ├─ styles.css         # design system (dual-signal palette, the flip, responsive)
│  ├─ app.js             # render, flip, filter, modal, deep-links
│  └─ projects.js        # ← THE content file you edit to add projects
└─ README.md
```

---

## Deploy — GitHub Pages

Once the repo is on GitHub:

1. Push `main`.
2. GitHub → **Settings → Pages → Build and deployment**.
3. **Source:** *Deploy from a branch*. **Branch:** `main` / `root`. Save.
4. Live in ~1 minute at `https://<username>.github.io/<repo>/`.

No build step, so nothing else to configure. Every future update is: edit
`projects.js`, commit, push — Pages redeploys automatically.

---

## Accessibility & quality floor

Responsive to mobile · visible keyboard focus · `prefers-reduced-motion`
respected · semantic HTML · alt text on images · lazy images with no layout
shift · modal with focus-trap, Esc/click-out close, and focus restore.
