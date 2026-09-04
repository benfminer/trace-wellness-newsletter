# TRACE Wellness Newsletter

A monthly staff wellness newsletter for TRACE Schools (San Diego), built by the
staff wellness committee. Each issue is a hand-crafted interactive web page —
oversized type, scroll animations, breathing tools, a scaling recipe with a
print button — designed for certificated and classified staff, not students.

**Live site:** https://benfminer.github.io/trace-wellness-newsletter/

Earlier issues lived on Canva; as of September 2026 they are hand-built HTML so
they can do real interactivity (localStorage-backed checklists, servings
sliders, guided breathing timers, and more).

## Where the project is at

Nine issues are planned, September 2026 through May 2027.

| Issue | Status |
|---|---|
| September 2026 | **Live** on this site |
| October 2026 ("The Long Middle") | Built, in committee review |
| November 2026 ("Enough") | Built, in committee review |
| December 2026 ("Low Light") | Built, in committee review |
| January – May 2027 | Planned |

Only September is published here so far. The other built issues are being
reviewed privately and will be added to this repo (and the site) one at a time
as they're finalized.

## How the site works

This repo is served directly by GitHub Pages — no build step, no framework, no
server.

```
index.html                          Landing page (hero, roadmap of all 9 months)
assets/hero.jpg                     Landing page hero photo
trace-wellness-september/
  index.html                        The September issue
```

Every issue is a single self-contained `index.html`: all CSS and JavaScript
inline, photos embedded as base64. That's a deliberate constraint so an issue
can be shared as one file, previewed anywhere, and hosted with zero setup.

## Making changes

1. Edit the relevant `index.html` (each issue's file is the single source of truth).
2. Open it in a browser to check it — it works straight from a local file.
3. Commit and push to `main`. GitHub Pages redeploys automatically, usually
   within a minute or two.

To publish a new month: remove its folder from `.gitignore`, add the folder,
push, and update the roadmap grid on the landing page from "Drafting" to
"Live" with a link.

## Design notes

- Warm teal-and-dusk palette; Fraunces, IBM Plex Mono, and Public Sans type.
- Each issue has its own structural concept rather than a shared template
  (September is a school bell schedule with seven "periods").
- Scroll-triggered reveals and light parallax, with full
  `prefers-reduced-motion` support.
- Photography is used sparingly and only from properly licensed sources.

---

*Bright Minds. Healthy Suns. Fully Supported.*
