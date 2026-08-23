# Writing an act

An **act** is one self-contained ~14-second scene showing one Kitto feature on a
phone screen. Each act lives in `src/acts/<Name>Act.tsx` and exports exactly one
component: `export const <Name>Act: React.FC<{ display: string }>`.

**Read `src/acts/UncertaintyAct.tsx` first.** It is the reference act — short,
complete, and every convention below is visible in it. `src/acts/ScanAct.tsx`
shows the fullscreen-overlay variant.

## The rules that matter

1. **All animation is driven by `useCurrentFrame()`.** CSS transitions and CSS
   `@keyframes` do not render. Never use them.
2. **Timing lives in one `BEAT` object at the top of the file**, in seconds, and
   every animation reads from it. Convert with a local `const s = (sec) => sec * fps`.
3. **Readability is the constraint.** A card the viewer must read gets at least
   **3 seconds** of dwell before anything moves. Text typing runs no faster than
   ~15 characters per second. Assume the viewer has never seen the app.
4. **Springs come from `SPRING`** in `../theme` — `morph` for a surface growing
   or collapsing, `list` for a row arriving, `step` for something inside a card.
   These are the app's real physics; do not invent config values.
5. **Colour comes from `useT()`**, never a literal. The one exception is
   `DOMAIN` (the six pastel chips), which is theme-invariant and may be read at
   module level for static data. Radii come from `R`. Sizes come from `px(n)`,
   where `n` is a normal iOS point value — the screen is 360 points wide.
6. **The act must work in light AND dark.** You get this free by using `useT()`.
   Never hardcode `#fff`, `rgb(...)`, or a shadow.
7. **An element that has not happened yet returns `null`** — do not render it at
   `opacity: 0`. An invisible element still occupies its box and reserves a hole
   in the layout.
8. **No text may be cut off.** The screen is 360 points wide. Row titles are
   `nowrap` with ellipsis, so keep them under ~22 characters.
9. **Everything must fit above the tab bar.** The usable content column runs from
   about y=150 to y=690 in points. Long lists overflow silently — count your rows.

## What you are given

```tsx
import { Stage } from '../components/Stage'          // phone chrome: status bar,
                                                     // date, greeting, tab bar
import { QuoteCard } from '../components/Stage'      // the "YOU SAID" card
import { VoiceIsland } from '../components/VoiceIsland'
import { TaskRow, Pill, EmojiChip, CiteChip, ConfidenceDot } from '../components/parts'
import { Closing } from './CaptureAct'               // the one warm closing line
import { useSpeakBeat, markAt, fadeIn } from './shared'
import { useT, DOMAIN, SPRING, R, px } from '../theme'
```

`<Stage display={display} handover={n} micPress={n} overlay={node}>` renders the
phone chrome and puts `children` in the content well. **Anything fullscreen — a
camera, a chat panel, a sheet — must go in `overlay`, not in `children`**, or it
will paint underneath the tab bar and be clipped by the content padding.

If the act opens with the user speaking, use `useSpeakBeat(frame, fps, BEAT)`;
it returns `{ open, micPress, savePress, transcript }` for the mic-tap → island
→ transcript → save → collapse gesture. Your `BEAT` then needs the keys
`tap, open, speakFrom, speakTo, savePress, close`.

## The product's voice

Short and warm. It states what it did and moves on. No exclamation marks, at
most one emoji, never congratulates a routine action. `Closing` takes one line —
make it a small nod, not a summary. The product noun is **"matter"**, never
"task". Say "Kitto", never "the app" or "the AI".

## Checklist before you finish

- [ ] `npx tsc --noEmit` passes
- [ ] Every colour came from `useT()` or `DOMAIN`
- [ ] Every animated value came from `useCurrentFrame()`
- [ ] Nothing readable is on screen for less than 3 seconds
- [ ] No row title is long enough to be truncated
- [ ] The act reads correctly with no prior context — a viewer joining at frame 0
      understands what is being demonstrated
