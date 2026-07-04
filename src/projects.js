/* =============================================================================
 * projects.js: THE content file.
 *
 * This is the single source of truth for the whole site. To add a project,
 * copy one object below, fill it in, and drop a screenshot in assets/.
 * Nothing about a project is hand-coded in the HTML; it all renders from here.
 *
 * ── Field reference ─────────────────────────────────────────────────────────
 *   id            (required)  stable slug, used for deep-links (#project/<id>)
 *   name          (required)  display name
 *   role          short one-liner under the name
 *   tags          array of strings; the union of all tags drives the filter row
 *   featured      true → shown in the "Now building" strip and sorted first
 *
 *   screenshot    path to an image in assets/. Absent → tasteful placeholder.
 *                 Shown on the card (16:10 cover) and as the modal gallery hero.
 *   screenshotAlt alt text for the screenshot (accessibility)
 *
 *   link          the smart button. type: "demo" | "repo" | "prototype" | "none"
 *                 - demo      → "Live demo ↗"    opens url in new tab
 *                 - repo      → "View source ↗"  opens url in new tab
 *                 - prototype → quiet "Prototype" pill, opens the modal
 *                 - none      → no button rendered
 *   link2         optional secondary link, shown ONLY in the modal
 *
 *   product       { problem, decision, outcome }  the warm / PM reading (required)
 *   tech          { arch, stack:[], calls }       the cool / engineer reading (required)
 *
 *   detail        optional richer modal content:
 *                 { body, gallery:[], metrics:[{label,value}] }
 *                 Falls back gracefully to product/tech when absent.
 *
 * Every field except id / name / product / tech degrades gracefully when absent.
 * =========================================================================== */

export const projects = [
  {
    id: "shortpath",
    name: "ShortPath",
    role: "Open-source desktop app for support teams",
    tags: ["tooling", "shipped", "product"],
    featured: true,

    screenshot: "assets/screens/shortpath/main.webp",
    screenshotAlt: "ShortPath desktop app, main saved-replies view",

    link: {
      type: "repo",
      url: "https://github.com/Dadpops/ShortPath"
    },
    caseStudy: "shortpath.html",   // flagship deep-dive page

    product: {
      problem:
        "Support reps burn minutes every ticket hunting for the right saved reply, SOP, or doc. Every lookup means context-switching out of the conversation to find something they already know exists.",
      decision:
        "Scope hard to one job: a global-hotkey fuzzy-search popup, nothing else. Validated the pain and the shape through rep interviews before writing app code, then shipped it open-source with a full PRD and case study.",
      outcome:
        "A local-first tool reps actually keep open, with resources one keystroke away instead of a tab-hunt. Released publicly with the product thinking documented, not just the code."
    },
    tech: {
      arch:
        "Local-first Electron shell with a React overlay bound to a global hotkey; a fuzzy index sits in front of a flat content store imported from CSV, with nested subfolders preserved as hierarchy.",
      stack: ["Electron", "React", "Fuse.js", "Node", "CSV import"],
      calls:
        "Local-first over a hosted service: reps' data stays on their machine and the tool works offline, at the cost of building a sync path later. Kept the content model a portable CSV so teams can own and version their library without a database."
    },

    detail: {
      body:
        "ShortPath started as a support-team frustration: the knowledge exists, but the retrieval tax is real. Rather than build a sprawling knowledge base, I scoped to the single highest-frequency action ('get me the right snippet, now') and treated everything else as out of scope on purpose.\n\nThe build is deliberately boring where it should be and sharp where it matters: a global hotkey summons an overlay, fuzzy search ranks results as you type, and CSV import means a team can seed its whole library in minutes and keep it in version control. Stream Deck export and a companion browser extension extend the same index to where reps already work.\n\nIt shipped open-source with the PRD and a written case study, because the point was to demonstrate product judgment (scoping, validation, tradeoffs) as much as the engineering.",
      gallery: [
        "assets/screens/shortpath/search-results.webp",
        "assets/screens/shortpath/onboarding.webp",
        "assets/screens/shortpath/tools.webp",
        "assets/screens/shortpath/favorites.webp",
        "assets/screens/shortpath/keyboard-shortcuts.webp",
        "assets/screens/shortpath/settings.webp",
        "assets/screens/shortpath/help.webp"
      ],
      metrics: [
        { label: "Time-to-snippet", value: "1 keystroke" },
        { label: "Content source", value: "Portable CSV" },
        { label: "Released", value: "Open source" }
      ]
    }
  },

  {
    id: "help-center-pipeline",
    name: "Help Center Pipeline",
    role: "AI-assisted documentation workflow at WhatConverts",
    tags: ["tooling", "shipped", "product"],
    featured: false,

    screenshot: "assets/screens/help-center/pipeline.webp",   // illustrative concept mockup (internal tool, no public UI)
    screenshotAlt: "Help Center Pipeline concept: ticket data to AI draft to human review to published",

    link: {
      type: "none",
      url: "" // internal WhatConverts work, no public link
    },

    product: {
      problem:
        "Documentation couldn't keep pace with the product, so the same questions came back as tickets over and over, a support cost that compounded every release.",
      decision:
        "Reframed docs as a deflection lever, not a chore: identify the highest-repeat questions from ticket data and answer them at the source, all drafted against a strict, fixed article framework so quality stayed consistent at volume.",
      outcome:
        "700+ articles produced at roughly 5× the prior output, turning the help center from a backlog into an active ticket-deflection surface."
    },
    tech: {
      arch:
        "Pipeline: mine repeat questions from Zoho Desk ticket data → AI drafts against a fixed article framework (structure, tone, required sections) → human review and edit → publish. A RAG layer grounds drafts in existing docs and ticket history so answers stay accurate.",
      stack: ["RAG", "LLM drafting", "Zoho Desk data", "Content framework"],
      calls:
        "A rigid framework over free-form generation: it caps how clever any single article can be, but it makes 700+ of them consistent and reviewable. Kept a human in the loop on every publish rather than chasing full automation, trading throughput for trust."
    },

    detail: {
      body:
        "The insight here was economic, not editorial: every repeat ticket is a doc that doesn't exist yet. So I instrumented which questions actually recurred, then built a pipeline that turned that signal into publishable articles at scale.\n\nThe hard part wasn't the writing. It was consistency. A fixed framework (every article the same shape, same required sections, same voice) meant AI drafting could be fast without going off the rails, and a human review gate kept accuracy honest. The result reads like one author wrote all 700+ pieces.",
      gallery: [],
      metrics: [
        { label: "Articles", value: "700+" },
        { label: "Output", value: "5×" },
        { label: "Human review", value: "Every article" }
      ]
    }
  },

  {
    id: "rift-protocol",
    name: "Rift Protocol",
    role: "Browser 2v2 real-time card battler",
    tags: ["game", "product"],
    featured: true,

    screenshot: "assets/screens/rift/battle.webp",
    screenshotAlt: "Rift Protocol, a 2v2 battle in progress",

    link: {
      type: "demo",
      url: "https://genrefighters-production.up.railway.app/rift_protocol.html"
    },
    // source shown as a secondary link, in the modal only:
    link2: { type: "repo", url: "https://github.com/Dadpops/RiftProtocol" },

    product: {
      problem:
        "Most hobby card games die on retention: a fun first match, then nothing pulling players back. I wanted depth that rewards mastery, not just a novelty.",
      decision:
        "Bet the roadmap on progression over content: mastery tracks and a Daily Rift loop before piling on more cards. Balance was treated as a data problem, tuned across 17,000+ simulated matches rather than by gut feel.",
      outcome:
        "Six operative classes balanced against each other, a real reason to come back tomorrow, and a live multiplayer build with an Escalations mode and a mobile UI overhaul."
    },
    tech: {
      arch:
        "Authoritative real-time server over Socket.io on Railway drives 2v2 matches; a persistence layer tracks progression, mastery, and daily state. Six operative classes share one rules engine, with an Escalations mode layered on top.",
      stack: ["Socket.io", "Node", "Railway", "Real-time multiplayer"],
      calls:
        "Server-authoritative over client-trust, non-negotiable for a competitive PvP game, at the cost of latency-hiding work on the client. Used 17,000+ simulated matches as a balance harness so class tuning was evidence-driven instead of vibes."
    },

    detail: {
      body:
        "Rift Protocol is where I got to treat game design as product design. The core question was retention, and the answer wasn't 'more cards,' it was giving players a ladder to climb. Mastery tracks and a Daily Rift gave the game a tomorrow.\n\nTechnically it's a real-time, server-authoritative multiplayer game: the server owns the truth, clients render it. Six operative classes had to be balanced against each other, which I approached as a simulation problem: 17,000+ automated matches surfaced dominant strategies far faster than human playtesting could. An Escalations mode and a full mobile UI pass followed once the core loop held up.",
      gallery: [
        "assets/screens/rift/rift-cards.webp",
        "assets/screens/rift/multiplayer-lobby.webp",
        "assets/screens/rift/escalations.webp",
        "assets/screens/rift/menu.webp"
      ],
      metrics: [
        { label: "Simulated matches", value: "17,000+" },
        { label: "Operative classes", value: "6" },
        { label: "Mode", value: "2v2 real-time" }
      ]
    }
  },

  {
    id: "storyframe-studio",
    name: "Storyframe Studio",
    role: "Guided worldbuilding tool for writers (no AI)",
    tags: ["tooling", "product"],
    featured: false,

    screenshot: "assets/screens/storyframe/01-worlds.webp",
    screenshotAlt: "Storyframe Studio, worlds overview",

    link: {
      type: "demo",
      url: "https://dadpops.github.io/storyframe-studio/"
    },
    // source shown as a secondary link, in the modal only:
    link2: { type: "repo", url: "https://github.com/Dadpops/storyframe-studio" },

    product: {
      problem:
        "Writers don't struggle to generate ideas. They struggle to organize them, pick a direction, and learn craft. That's a structure problem, and AI generation solves the wrong half of it.",
      decision:
        "Built a guided authoring tool with a shareable 'world card' as the hero output, deliberately without AI generation. Architected the data model to grow from a single-file tool into a full app without a rewrite.",
      outcome:
        "A local-first, offline tool that gives writers scaffolding and a thing to show for it: a portable world they own, with a foundation designed to scale into something bigger."
    },
    tech: {
      arch:
        "Single-file, offline, no-backend app. A portable world-JSON is the contract at the center; the UI is decoupled from it, so the same data can outlive any given interface. File save/load plus CSV export keep everything user-owned.",
      stack: ["Vanilla JS", "Portable JSON model", "CSV export", "jsdom (tests)"],
      calls:
        "No backend and no AI, controversial for the category, but it keeps the tool private, free to run forever, and honest about solving structure not generation. Made world-JSON the stable contract so the UI can be rebuilt without breaking anyone's saved work; tested the core with jsdom to keep that contract trustworthy."
    },

    detail: {
      body:
        "Storyframe Studio is a thesis about what writers actually need: not a generation engine, but a structured way to think and something concrete to share. So the hero output is a 'world card,' a shareable artifact, and the whole flow is guided authoring, not autocomplete.\n\nThe architecture is the interesting product decision. It ships as a single offline file, but the data model (a portable world-JSON) is designed as a contract that can grow into a real app. The UI is decoupled from that contract and covered by jsdom tests, so I can rebuild the interface later without invalidating anyone's saved worlds. It's a small tool built with a big tool's data discipline.",
      gallery: [
        "assets/screens/storyframe/02-dashboard.webp",
        "assets/screens/storyframe/03-wizard-lesson.webp",
        "assets/screens/storyframe/04-character-card.webp",
        "assets/screens/storyframe/05-setting-card.webp",
        "assets/screens/storyframe/06-framework-walk.webp",
        "assets/screens/storyframe/07-framework-summary.webp"
      ],
      metrics: [
        { label: "Backend", value: "None (offline)" },
        { label: "Data contract", value: "Portable JSON" },
        { label: "Core", value: "jsdom-tested" }
      ]
    }
  },

  {
    id: "support-rag-assistant",
    name: "Support RAG Assistant",
    role: "Voice-matched response drafting at WhatConverts",
    tags: ["tooling", "shipped"],
    featured: false,

    screenshot: "assets/screens/rag/assistant.webp",   // illustrative concept mockup (internal tool, no public UI)
    screenshotAlt: "Support RAG Assistant concept: retrieved precedents and a voice-matched draft reply",

    link: {
      type: "none",
      url: "" // internal WhatConverts work, no public link
    },

    product: {
      problem:
        "Reps rewrote the same kinds of replies constantly, and the house voice drifted from person to person: repetitive work and inconsistent output at the same time.",
      decision:
        "Aim for consistency at scale: draft replies in the established house voice from the team's own ticket history, with a human always in the loop to approve and adjust before anything is sent.",
      outcome:
        "Faster, more consistent replies. Reps edit instead of writing from scratch, and the brand voice holds steady across the team."
    },
    tech: {
      arch:
        "RAG over historical Zoho Desk tickets: embed past resolved tickets, retrieve the closest precedents for an incoming issue, and condition the reply on both the retrieved context and the house-voice guidelines. Exposed to tooling via MCP.",
      stack: ["RAG", "Embeddings", "MCP", "Zoho Desk data", "LLM"],
      calls:
        "Grounded generation over a raw prompt: retrieval from real past tickets keeps replies accurate and on-voice instead of plausible-but-wrong. Kept humans in the loop by design; the assistant drafts, it never sends."
    },

    detail: {
      body:
        "This one is about consistency as a feature. Support voice is a brand asset, and it erodes quietly when every rep writes from scratch. The assistant retrieves the team's own best past answers and writes in that established voice, so the output is grounded in what actually worked before, not a generic model's guess.\n\nBuilt on RAG over historical Zoho Desk tickets with embeddings for retrieval and exposed through MCP so it plugs into the tools reps already use. The human-in-the-loop boundary is deliberate: it accelerates the reply, the rep owns the send.",
      gallery: [],
      metrics: [
        { label: "Grounding", value: "Real past tickets" },
        { label: "Voice", value: "House-matched" },
        { label: "Send", value: "Human-approved" }
      ]
    }
  },

  {
    id: "cobbies",
    name: "Cobbies",
    role: "Mobile-first pixel-art creature collector",
    tags: ["game", "product"],
    featured: false,

    screenshot: "assets/screens/cobbies/logo-card.webp",
    screenshotAlt: "Cobbies, logo and title art",

    link: {
      type: "demo",
      url: "https://dadpops.github.io/Cobbies/"
    },
    // source shown as a secondary link, in the modal only:
    link2: { type: "repo", url: "https://github.com/Dadpops/Cobbies" },

    product: {
      problem:
        "Most collector games either respect your time or hook you with a deep loop, rarely both. I wanted a warm, approachable creature-collector that fit into mobile-sized moments.",
      decision:
        "Locked the core design early to protect scope: a two-currency economy, five starters, and a tutorial guide, all decided up front so the build couldn't sprawl. Design discipline before content.",
      outcome:
        "A working prototype with the full core loop and a pixel-art showcase, built clean enough to hand off to a production build."
    },
    tech: {
      arch:
        "Mobile-first game loop around a two-currency economy and a collection-progression system, structured so state and content are cleanly separated for a clean build handoff.",
      stack: ["Mobile game loop", "Two-currency economy", "Pixel art"],
      calls:
        "Froze the core design early rather than iterating endlessly. It constrains creative options, but it's what keeps a solo game project shippable. Prioritized a clean handoff structure over a polished single build, since the goal was a foundation someone can take to production."
    },

    detail: {
      body:
        "Cobbies is a scope-discipline story disguised as a cute creature-collector. Collector games are famous for ballooning, so I locked the pillars up front (a two-currency economy, five starters, a guided tutorial) and treated those as fixed constraints rather than open questions. That decision is the reason a prototype exists at all.\n\nThe result is a working core loop with a pixel-art showcase, architected so state and content are separable and the whole thing is ready for a proper production handoff. It's a small game that demonstrates a big habit: decide the shape early, then execute inside it.",
      gallery: [
        "assets/screens/cobbies/02-welcome.webp",
        "assets/screens/cobbies/03-ranch.webp",
        "assets/screens/cobbies/04-minigame-hub.webp",
        "assets/screens/cobbies/05-choose-runner.webp",
        "assets/screens/cobbies/06-run-results.webp",
        "assets/screens/cobbies/07-the-barn.webp",
        "assets/screens/cobbies/08-shop.webp",
        "assets/screens/cobbies/09-hatchery.webp"
      ],
      metrics: [
        { label: "Economy", value: "Two-currency" },
        { label: "Starters", value: "5" },
        { label: "Status", value: "Handoff-ready" }
      ]
    }
  }
];

export default projects;
