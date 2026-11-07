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
| `assets/tailwind.css` | Built Tailwind CSS (generated — do not edit by hand) |
| `assets/tailwind.src.css` | Tailwind build input |
| `tailwind.config.js` | Tailwind content list (the pages that use Tailwind) |
| `assets/favicon.svg` | Site icon |
| `images/` | Hero + localized archive/walks media |

## Tailwind build

`index.html`, `archive.html`, `walks.html`, `syllable.html`, and `trisolaris.html` use Tailwind utility classes via a prebuilt stylesheet (no CDN). After adding or changing Tailwind classes in those pages, rebuild with the [Tailwind v3 standalone CLI](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17) (no Node needed):

```bash
# download once (macOS Apple Silicon; pick the binary for your OS)
curl -fsSL -o tailwindcss https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.17/tailwindcss-macos-arm64
chmod +x tailwindcss

# rebuild
./tailwindcss -c tailwind.config.js -i assets/tailwind.src.css -o assets/tailwind.css --minify
```

If a new page uses Tailwind, add it to `content` in `tailwind.config.js` and link `assets/tailwind.css`. Commit the regenerated `assets/tailwind.css`.

## Tools

Self-contained browser-side experiments across writing, darkroom optics, sound, space dynamics, generative life, and arcade — open `index.html` for the live list (filter search, drawer toggle, random jump, and favorites stored in `localStorage`).

Notable space tools: `orrery.html`, `lagrange.html`, `earth-orbit.html` (LEO/GEO + Moon + Lagrange), `earthrise.html`, `exomoon.html`, `vortex.html`.
