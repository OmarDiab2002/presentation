# Kitto — Pitch Deck

The presentation for **Kitto**, a life-management assistant. ITI Graduation
Project, 2026.

Open `deck.html` in a browser. Arrow keys or space move a slide at a time; the
control at the bottom-right switches light and dark.

## What is here

| Path | What |
|---|---|
| `deck.html` | The deck — 31 slides, markup only |
| `theme.css` | The design system, ported 1:1 from the app's own tokens, both palettes |
| `deck.css` | Per-slide layout |
| `assets/video/` | 13 feature recordings, each rendered in light and dark |
| `video/` | The Remotion project those recordings come from |
| `kitto-in-plain-english.md` | The full product explanation the deck was written from |
| `archive/` | The original standalone slides, before they were merged into `deck.html` |

## Serving it

Opening `deck.html` from the filesystem works. If you serve it instead, use a
server that supports **Range requests** — Python's built-in `http.server` does
not, and video playback stalls without them.

## The videos

Every feature slide holds two files: `<name>.mp4` and `<name>-dark.mp4`. The page
swaps between them with the theme, so **a scene edited in one palette must be
re-rendered in both**, or a dark slide frames a glowing white phone.

```bash
cd video
npm ci
npm run dev                  # Remotion studio, to preview a scene
npm run render               # every scene, both palettes
npm run render -- Scan Chat  # just these
```

Scenes live in `video/src/acts/`. Read `video/CONVENTIONS.md` before writing a
new one — it carries the rules that are easy to get wrong (frame-driven
animation only, palette from `useT()`, nothing readable on screen for under
three seconds).

## A note on the slide surface

A slide is a fixed 1280×720 design surface written in `rem`, with the root font
size pinned to `min(1.25vw, 2.2222vh)`. That makes 1rem equal 16 design pixels,
so the deck fits any viewport at exact 16:9 with no JavaScript and no scaling
math — but it also means **content that overruns the 70×36.5rem body is hidden
rather than scrolled**. Check a slide after editing it.
