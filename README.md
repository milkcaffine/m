# Marsko (`marsko.art`)

Personal site and night workshop for **Marsko** — Tokyo suburb walker writing tanka, dark novels, and browser-side tools.

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

## Tools (by category on the home page)

글 · 사진 · 이미지 · 공감각 · 우주 · 생명 · 놀이 — open `index.html` for the live list (favorites stored in `localStorage`).

Notable space tools: `orrery.html`, `lagrange.html`, `earth-orbit.html` (LEO/GEO + Moon + Lagrange).
