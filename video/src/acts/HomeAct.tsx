import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { EmojiChip, TaskRow } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'

/**
 * HOME — the screen answers one question: what needs me right now?
 *
 * The act is built so the viewer can do the arithmetic themselves: one focus
 * card, three rows, "4 more in Matters" — and a brief above them that says
 * eight. That is the whole claim about the numbers being computed rather than
 * written by the model, and it is far more convincing counted on screen than
 * asserted in a caption. Completing the focus matter re-runs the same sum in
 * front of the viewer: eight becomes seven, the section count seven becomes
 * six, and the promoted matter leaves the list it was promoted out of.
 *
 * Nothing new arrives after six seconds and nothing moves until nine. The point
 * of this screen is what is NOT on it, and a short screen only reads as
 * deliberate if the viewer is given long enough to notice the absence.
 */

const BEAT = {
  brief: 0.5,
  focus: 1.5, // alone on screen for over a second — it is the one thing
  alsoLabel: 2.9,
  rows: [3.25, 3.7, 4.15],
  more: 4.7,
  needsLabel: 5.2,
  needs: [5.5, 5.7, 5.9],
  press: 9.3,
  complete: 9.5,
  // The finished card and the promoted one never share the slot. Crossfading
  // two cards means two legible titles on top of each other for a third of a
  // second, and a viewer reading the wrong one loses the whole point of the
  // beat. So: the sums are re-run, the finished card leaves, the next arrives.
  recount: 10.0,
  clear: 10.25,
  promote: 10.6,
  closing: 11.8,
} as const

/**
 * The list row's box, fixed rather than measured. Promotion collapses the top
 * row's slot to nothing, and an animated height has to agree exactly with the
 * height it is animating away from or the rows below jump on the first frame.
 */
const ROW_H = 58
const ROW_GAP = 6

type Matter = {
  emoji: string
  tint: string
  title: string
  /** How a row states it — the workspace's short form. */
  meta: string
  /** How the focus card states it. The big card has room to be exact. */
  due: string
  estimate: string
}

const FOCUS: Matter = {
  emoji: '🚗',
  tint: DOMAIN.car,
  title: 'Renew the car insurance',
  meta: 'Today, 5:00 PM',
  due: 'Due today, 5:00 PM',
  estimate: '10 min',
}

/** The three that fit underneath. The first is the one that gets promoted. */
const ALSO: Matter[] = [
  {
    emoji: '💳',
    tint: DOMAIN.finance,
    title: 'Pay the nursery fee',
    meta: 'Today, 6:00 PM',
    due: 'Due today, 6:00 PM',
    estimate: '2 min',
  },
  {
    emoji: '🧸',
    tint: DOMAIN.family,
    title: 'Collect Noor at 3:15',
    meta: 'School gate',
    due: 'Today, 3:15 PM',
    estimate: '20 min',
  },
  {
    emoji: '🐾',
    tint: DOMAIN.pets,
    title: "Book Milo's vet visit",
    meta: 'Any day this week',
    due: 'This week',
    estimate: '5 min',
  },
]

/** The three inboxes that hold work Kitto cannot finish on its own. */
const NEEDS = [
  { emoji: '💭', tint: DOMAIN.family, title: 'A few guesses', body: 'to confirm' },
  { emoji: '📄', tint: DOMAIN.car, title: '1 scan', body: 'to review' },
  { emoji: '🌾', tint: DOMAIN.home, title: '2 matters', body: 'have slipped' },
] as const

type Segment = { text: string; strong?: boolean }

/**
 * The brief. Every figure in it is one the viewer can check against the rows
 * below, so the emphasised words are exactly the computed ones.
 */
const BRIEF_BEFORE: Segment[] = [
  { text: 'Eight', strong: true },
  { text: ' matters today. ' },
  { text: 'One', strong: true },
  { text: ' has a deadline, so it is the only one I am showing you.' },
]

const BRIEF_AFTER: Segment[] = [
  { text: 'Seven', strong: true },
  { text: ' left. The nursery fee is next, and it is due by ' },
  { text: 'six', strong: true },
  { text: '.' },
]

export const HomeAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const brief = spring({ frame: frame - s(BEAT.brief), fps, config: SPRING.morph })
  const enterFocus = spring({ frame: frame - s(BEAT.focus), fps, config: SPRING.morph })
  const enterNext = spring({ frame: frame - s(BEAT.promote), fps, config: SPRING.morph })

  const press = interpolate(
    frame,
    [s(BEAT.press), s(BEAT.press + 0.12), s(BEAT.complete)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const done = spring({ frame: frame - s(BEAT.complete), fps, config: SPRING.step })
  const leave = interpolate(frame, [s(BEAT.clear), s(BEAT.promote)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const promoted = frame >= s(BEAT.promote)
  // All three of the app's springs are critically damped, so this never
  // overshoots 1 and the collapsing row's height never goes negative.
  const collapse = spring({ frame: frame - s(BEAT.promote), fps, config: SPRING.morph })
  const recounted = frame >= s(BEAT.recount + 0.3)

  return (
    <Stage display={display}>
      <Brief
        shown={brief}
        recounted={recounted}
        // Out, then in — never both at once, for the same reason the two cards
        // do not overlap.
        opacity={
          recounted
            ? fadeBetween(frame, s(BEAT.recount + 0.3), s(BEAT.recount + 0.6), 0, 1)
            : fadeBetween(frame, s(BEAT.recount), s(BEAT.recount + 0.3), 1, 0)
        }
      />

      {/* One slot, one card. The finished card is fully gone on the frame the
          promoted one mounts, and the two are the same shape, so the handover
          costs nothing below it. */}
      <div style={{ marginTop: px(11) }}>
        {promoted ? (
          <FocusCard matter={ALSO[0]} enter={enterNext} rise={px(38)} />
        ) : frame >= s(BEAT.focus) ? (
          <FocusCard
            matter={FOCUS}
            enter={enterFocus}
            rise={px(18)}
            leave={leave}
            done={done}
            press={press}
          />
        ) : null}
      </div>

      {frame >= s(BEAT.alsoLabel) ? (
        <div style={{ marginTop: px(12), opacity: fade(frame, s(BEAT.alsoLabel), fps) }}>
          {/* This count follows the LIST, not the completion: it is what sits
              under the focus card, and that only changes once the next matter
              has been pulled up out of it. */}
          <SectionLabel count={promoted ? '6' : '7'} pop={countPop(frame, s(BEAT.promote), fps)}>
            ALSO TODAY
          </SectionLabel>
        </div>
      ) : null}

      {frame >= s(BEAT.rows[0]) ? (
        <div style={{ marginTop: px(9) }}>
          {ALSO.map((matter, i) => (
            <RowSlot
              key={matter.title}
              matter={matter}
              at={s(BEAT.rows[i])}
              last={i === ALSO.length - 1}
              collapse={i === 0 ? collapse : 0}
            />
          ))}
        </div>
      ) : null}

      {frame >= s(BEAT.more) ? (
        <MoreLine shown={fade(frame, s(BEAT.more), fps)} />
      ) : null}

      {frame >= s(BEAT.needsLabel) ? (
        <div style={{ marginTop: px(11), opacity: fade(frame, s(BEAT.needsLabel), fps) }}>
          <SectionLabel>NEEDS YOU</SectionLabel>
        </div>
      ) : null}

      {frame >= s(BEAT.needs[0]) ? (
        <div style={{ marginTop: px(7), display: 'flex', gap: px(6) }}>
          {NEEDS.map((item, i) => (
            <NeedsCell key={item.title} item={item} at={s(BEAT.needs[i])} />
          ))}
        </div>
      ) : null}

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        One at a time, on purpose.
      </Closing>
    </Stage>
  )
}

/** A plain hold-open fade, in seconds rather than frames. */
const fade = (frame: number, at: number, fps: number) =>
  interpolate(frame, [at, at + fps * 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const fadeBetween = (frame: number, from: number, to: number, a: number, b: number) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/** The count chip's nudge when it recomputes — small enough to notice, not read. */
const countPop = (frame: number, at: number, fps: number) =>
  interpolate(frame, [at, at + fps * 0.18, at + fps * 0.5], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/**
 * Kitto's line about the day.
 *
 * Both versions run to two lines, so swapping which one holds the flow keeps
 * the block exactly as tall as it was — nothing below it moves when the day's
 * arithmetic changes.
 */
const Brief: React.FC<{ shown: number; recounted: boolean; opacity: number }> = ({
  shown,
  recounted,
  opacity,
}) => {
  const T = useT()
  if (shown <= 0.001) return null

  return (
    <p
      style={{
        margin: `${px(10)}px 0 0`,
        opacity: shown * opacity,
        transform: `translateY(${(1 - shown) * px(10)}px)`,
        fontSize: px(14),
        lineHeight: 1.45,
        fontWeight: 500,
        color: T.inkMuted,
      }}
    >
      {(recounted ? BRIEF_AFTER : BRIEF_BEFORE).map((seg, i) => (
        <span key={i} style={seg.strong ? { color: T.ink, fontWeight: 800 } : undefined}>
          {seg.text}
        </span>
      ))}
    </p>
  )
}

/**
 * The one thing. Larger type, a larger chip and an elevated surface, so it
 * outranks the rows underneath before a word of it is read — and both of its
 * actions are on the card, because "Not today" being one tap away is what
 * stops an unfinished day turning into a debt.
 */
const FocusCard: React.FC<{
  matter: Matter
  enter: number
  /** How far below its slot the card starts — the promoted one travels further,
   *  because it is arriving from the list rather than from nowhere. */
  rise: number
  leave?: number
  done?: number
  press?: number
}> = ({ matter, enter, rise, leave = 0, done = 0, press = 0 }) => {
  const T = useT()
  // Deliberately no early return on a zero value: this card owns the height of
  // the slot, and dropping it for the single frame where its spring is still
  // at zero would bounce everything below it.
  const shown = enter * (1 - leave)

  return (
    <section
      style={{
        opacity: shown,
        transform: `translateY(${(1 - enter) * rise - leave * px(12)}px) scale(${
          0.96 + enter * 0.04 - leave * 0.04
        })`,
        padding: px(15),
        borderRadius: px(26),
        background: T.surface,
        boxShadow: T.shadowElevated,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: px(12) }}>
        <div style={{ position: 'relative', flex: 'none' }}>
          <div style={{ opacity: 1 - done }}>
            <EmojiChip emoji={matter.emoji} tint={matter.tint} size={46} />
          </div>
          {done > 0.001 ? <CheckBadge progress={done} /> : null}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: px(17.5),
              lineHeight: 1.3,
              fontWeight: 800,
              letterSpacing: '-0.015em',
              color: T.ink,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {matter.title}
          </h2>
          <p style={{ margin: `${px(3)}px 0 0`, fontSize: px(13), fontWeight: 800 }}>
            <span style={{ color: T.accent }}>{matter.due}</span>
            <span style={{ color: T.inkSubtle, fontWeight: 500 }}>{` · ${matter.estimate}`}</span>
          </p>
        </div>
      </div>

      {/* The actions are left alone through the completion beat. Fading them
          turns the solid button into a grey one, which reads as disabled rather
          than as finished — and the tick has already said it. */}
      <div style={{ marginTop: px(13), display: 'flex', gap: px(9) }}>
        <Action
          filled
          grow
          scale={1 - press * 0.06}
          label="✓  Done"
        />
        <Action label="Not today" />
      </div>
    </section>
  )
}

const Action: React.FC<{
  label: string
  filled?: boolean
  grow?: boolean
  scale?: number
}> = ({ label, filled = false, grow = false, scale = 1 }) => {
  const T = useT()
  return (
    <div
      style={{
        flex: grow ? 1 : 'none',
        height: px(42),
        padding: `0 ${px(18)}px`,
        borderRadius: R.pill,
        background: filled ? T.solid : T.surfaceSunken,
        color: filled ? T.solidInk : T.inkMuted,
        display: 'grid',
        placeItems: 'center',
        fontSize: px(14.5),
        fontWeight: 800,
        transform: `scale(${scale})`,
      }}
    >
      {label}
    </div>
  )
}

/** The completion beat: one tick, on the chip, where the matter's face was. */
const CheckBadge: React.FC<{ progress: number }> = ({ progress }) => {
  const T = useT()
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: R.pill,
        background: T.success,
        display: 'grid',
        placeItems: 'center',
        opacity: progress,
        transform: `scale(${0.72 + progress * 0.28})`,
        color: T.accentInk,
        fontSize: px(22),
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      ✓
    </div>
  )
}

const SectionLabel: React.FC<{
  children: React.ReactNode
  count?: string
  pop?: number
}> = ({ children, count, pop = 0 }) => {
  const T = useT()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: px(8) }}>
      <span
        style={{
          fontSize: px(11),
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: T.inkSubtle,
        }}
      >
        {children}
      </span>
      {count ? (
        <span
          style={{
            padding: `${px(2)}px ${px(7)}px`,
            borderRadius: R.pill,
            background: T.surfaceSunken,
            color: T.inkMuted,
            fontSize: px(11),
            fontWeight: 800,
            transform: `scale(${1 + pop * 0.16})`,
          }}
        >
          {count}
        </span>
      ) : null}
    </div>
  )
}

/**
 * One row of the capped list. The top row's slot is what collapses when its
 * matter is promoted, so the height is animated rather than left to the flow.
 */
const RowSlot: React.FC<{
  matter: Matter
  at: number
  last: boolean
  collapse: number
}> = ({ matter, at, last, collapse }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.list })
  const open = 1 - collapse

  return (
    <div
      style={{
        height: collapse > 0.001 ? px(ROW_H) * open : undefined,
        marginBottom: last ? 0 : px(ROW_GAP) * open,
        overflow: collapse > 0.001 ? 'hidden' : undefined,
        opacity: enter * open,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-14), 0])}px)`,
      }}
    >
      <TaskRow
        emoji={matter.emoji}
        tint={matter.tint}
        title={matter.title}
        meta={matter.meta}
        style={{ height: px(ROW_H), padding: `0 ${px(13)}px` }}
      />
    </div>
  )
}

/** The cap, stated out loud. The rest of the day is somewhere, just not here. */
const MoreLine: React.FC<{ shown: number }> = ({ shown }) => {
  const T = useT()
  return (
    <div
      style={{
        marginTop: px(7),
        display: 'flex',
        justifyContent: 'center',
        opacity: shown,
      }}
    >
      <span
        style={{
          padding: `${px(5)}px ${px(12)}px`,
          borderRadius: R.pill,
          background: T.accentSoft,
          color: T.accentPressed,
          fontSize: px(12.5),
          fontWeight: 800,
        }}
      >
        4 more in Matters
      </span>
    </div>
  )
}

/**
 * The strip runs across rather than down. Three stacked rows of it would push
 * the day's matters off the screen, which would make the act argue against
 * itself: the claim is that everything worth seeing fits on one screen.
 */
const NeedsCell: React.FC<{
  item: { emoji: string; tint: string; title: string; body: string }
  at: number
}> = ({ item, at }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.list })

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-10), 0])}px)`,
        padding: px(9),
        borderRadius: px(20),
        background: T.surface,
        boxShadow: T.shadowCard,
      }}
    >
      <EmojiChip emoji={item.emoji} tint={item.tint} size={24} />
      <div
        style={{
          marginTop: px(5),
          fontSize: px(11),
          fontWeight: 800,
          color: T.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.title}
      </div>
      <div
        style={{
          fontSize: px(10),
          fontWeight: 500,
          color: T.inkMuted,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.body}
      </div>
    </div>
  )
}
