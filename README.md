# Marsko (`marsko.art`)

Personal site for **Marsko** — tanka and dark novels from the Tokyo suburbs, plus browser-side tools.

## Local preview

Static HTML only. From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

| Path | Role |
|------|------|
| `index.html` | Home — Note, Tools (search + favorites), Work |
| `archive.html` | Poems & short stories |
| `walks.html` | Tokyo walk photos |
| `*.html` | Self-contained tools (photo, sound, sims, arcade) |
| `assets/marsko-hud.css` | Shared lab HUD chrome |
| `assets/favicon.svg` | Site icon |
| `images/` | Hero + localized archive/walks media |

## Tools

Self-contained browser-side experiments across writing, darkroom optics, sound, space dynamics, generative life, and arcade — open `index.html` for the live list (filter search, drawer toggle, random jump, and favorites stored in `localStorage`).

Notable space tools: `orrery.html`, `lagrange.html`, `earth-orbit.html` (LEO/GEO + Moon + Lagrange), `vortex.html`.
