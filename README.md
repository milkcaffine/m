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
| `index.html` | Home — Interactive Fiction (carousel + drawer), Tools (search + favorites) |
| `cards.html` | Short story card viewer (data-driven, `STORIES` array inside) |
| `swamp.html`, `mita.html`, `sluice4.html`, `rojiura.html` | Interactive fiction pages (canvas + novel text / exploration) |
| `*.html` | Other self-contained tools (photo, sound, sims, arcade) |
| `assets/marsko-hud.css` | Shared lab HUD chrome |
| `assets/tailwind.css` | Built Tailwind CSS (generated — do not edit by hand) |
| `assets/tailwind.src.css` | Tailwind build input |
| `tailwind.config.js` | Tailwind content list (the pages that use Tailwind) |
| `assets/favicon.svg` | Site icon |
| `images/` | Hero media |

## Tailwind build

`index.html`, `syllable.html`, and `trisolaris.html` use Tailwind utility classes via a prebuilt stylesheet (no CDN). After adding or changing Tailwind classes in those pages, rebuild with the [Tailwind v3 standalone CLI](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17) (no Node needed):

```bash
# download once (macOS Apple Silicon; pick the binary for your OS)
curl -fsSL -o tailwindcss https://github.com/tailwindlabs/tailwindcss/releases/download/v3.4.17/tailwindcss-macos-arm64
chmod +x tailwindcss

# rebuild
./tailwindcss -c tailwind.config.js -i assets/tailwind.src.css -o assets/tailwind.css --minify
```

If a new page uses Tailwind, add it to `content` in `tailwind.config.js` and link `assets/tailwind.css`. Commit the regenerated `assets/tailwind.css`.

## Stories (Interactive Fiction)

The unit is the **work**, not the format. One work can have an interactive page, a card version, or both.

| Work | Interactive | Cards (`cards.html#id`) |
|------|-------------|-------------------------|
| The Martian Swamp: Orphan Process | `swamp.html` | `#swamp` |
| Urainari alley / new manager | `rojiura.html` | `#urainari` |
| Mita: the seam of the city | `mita.html` | `#mita` |
| Shibaura sluice no. 4 | `sluice4.html` | `#sluice4` |

### Add a new work

1. **Cards** (text-first story): append an object to the `STORIES` array at the top of the script in `cards.html`:
   ```js
   { id: "new-id", series: "SERIES #04", title: "...", location: "...", desc: "one line",
     cards: [`page 1 (blank line = new paragraph)`, `page 2`] }
   ```
   `'quoted'` lines render as emphasized dialogue. The `id` doubles as the deep link `cards.html#new-id`.
2. **Interactive** (optional): add a standalone page like `mita.html`; link `index.html` back from it. Put the real-world origin photo in `images/<name>-origin.jpg` and show it at the end of the story text (see the `.story-origin-box` block in `mita.html` / `sluice4.html`).
3. **Home page** (`index.html`, Interactive Fiction section):
   - Put the newest/featured works in the carousel (`.fiction-card`), newest first. One card per work; add a `▶` button for the interactive page and a `📖` button (`.is-alt`) linking `cards.html#id`. Older cards can drop out of the carousel.
   - Add one line per work to the drawer list (`.fiction-list`) with `interactive` / `cards` tag links. Every work belongs here. The `all · N` count is computed from these lines.
4. Add new pages to `sitemap.xml`.

Keep the carousel to a few cards; the drawer is the full catalog.

### Styling gotcha

`assets/tailwind.css` is prebuilt, so Tailwind classes that are not already in it silently do nothing. For new UI either rebuild Tailwind (see above) or write plain CSS in the page's `<style>` block, as the `.fiction-*` styles do.

## Tools

Self-contained browser-side experiments across writing, darkroom optics, sound, space dynamics, generative life, and arcade — open `index.html` for the live list (filter search, drawer toggle, random jump, and favorites stored in `localStorage`).

Notable space tools: `orrery.html`, `orbit.html` (Solar & Earth Kepler orbits + Hohmann + Lagrange), `earthrise.html`, `exomoon.html`, `massdriver.html`, `debris.html`, `vortex.html`.

Notable narrative & arcade: `rojiura.html` (non-Euclidean Tokyo alley exploration), `lander.html`, `tunnel.html`, `snake.html`.
