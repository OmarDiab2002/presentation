import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill, CiteChip } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'
import { fadeIn } from './shared'

/**
 * MATTERS — the workspace, for a list that keeps growing.
 *
 * Capture is only half the promise. A list that grows is worth nothing if
 * finding one thing in it costs a scroll, so this act shows the two tools that
 * do that work — a summary you can open, and a search you can talk to.
 *
 * Both run against the SAME five matters, deliberately. The viewer reads the
 * list once, then gets to check each answer against it. The counts in the
 * strip are the counts on screen for the same reason: a summary whose number
 * does not land on the rows it promised is decoration.
 */
const QUERY = 'car stuff next month'

const BEAT = {
  strip: 0.15,
  field: 0.32,
  rows: [0.5, 0.65, 0.8, 0.95, 1.1],
  // Three full seconds of stillness. The strip, the field and all five matters
  // have to be read cold before any of them is allowed to move.
  tapOverdue: 4.15,
  filtered: 4.5,
  clearOverdue: 7.6,
  restored: 7.95,
  tapField: 8.2,
  focus: 8.4,
  typeFrom: 8.6,
  typeTo: 10.6, // twenty characters over two seconds — read, not raced
  matched: 10.9,
  closing: 12.6,
} as const

type Matter = {
  id: string
  emoji: string
  tint: string
  title: string
  meta: string
  overdue: boolean
  /** Whether this matter answers QUERY. */
  matches: boolean
}

/**
 * Three overdue and two car matters, with no overlap between the sets — so the
 * two tools visibly return different answers rather than the same three rows
 * twice. Today is Thursday 12 June on the Stage, which is what makes the June
 * dates late and the July ones "next month".
 */
const MATTERS: Matter[] = [
  {
    id: 'power',
    emoji: '🏠',
    tint: DOMAIN.home,
    title: 'Electricity bill',
    meta: 'Was due 2 June',
    overdue: true,
    matches: false,
  },
  {
    id: 'service',
    emoji: '🚗',
    tint: DOMAIN.car,
    title: 'Car service',
    meta: 'Thu 3 July, 10:00 AM',
    overdue: false,
    matches: true,
  },
  {
    id: 'script',
    emoji: '🌱',
    tint: DOMAIN.health,
    title: 'Repeat prescription',
    meta: 'Was due 5 June',
    overdue: true,
    matches: false,
  },
  {
    id: 'jab',
    emoji: '🐾',
    tint: DOMAIN.pets,
    title: 'Vet vaccination',
    meta: 'Was due 8 June',
    overdue: true,
    matches: false,
  },
  {
    id: 'renew',
    emoji: '🚗',
    tint: DOMAIN.car,
    title: 'Renew car insurance',
    meta: 'Due 12 July',
    overdue: false,
    matches: true,
  },
]

/**
 * Every narrowing the list goes through, in order. A row derives its own
 * presence by folding these together, which means a row that leaves and comes
 * back is the same row springing twice rather than two mounts — the app
 * behaves that way and the motion has to agree.
 */
const VIEWS: { at: number; keep: (m: Matter) => boolean }[] = [
  { at: BEAT.filtered, keep: (m) => m.overdue },
  { at: BEAT.restored, keep: () => true },
  { at: BEAT.matched, keep: (m) => m.matches },
]

const presenceOf = (matter: Matter, frame: number, fps: number) =>
  VIEWS.reduce((present, view) => {
    const p = spring({ frame: frame - view.at * fps, fps, config: SPRING.list })
    return present + ((view.keep(matter) ? 1 : 0) - present) * p
  }, 1)

export const MattersAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  return (
    <Stage display={display}>
      <SummaryStrip frame={frame} fps={fps} />
      <SearchField frame={frame} fps={fps} />

      <div style={{ marginTop: px(12) }}>
        {MATTERS.map((matter, i) => (
          <ListRow key={matter.id} matter={matter} at={s(BEAT.rows[i])} />
        ))}
      </div>

      <QueryReading frame={frame} fps={fps} />

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Tap a number, or ask in your own words.
      </Closing>
    </Stage>
  )
}

/** A row is 64 points tall with 9 beneath it; the collapse animates both. */
const ROW_H = 64
const ROW_GAP = 9

/**
 * One matter, holding its own place in the list. Height carries the filtering
 * so the rows below close the gap, and opacity runs ahead of it so a leaving
 * row is gone before its box is.
 */
const ListRow: React.FC<{ matter: Matter; at: number }> = ({ matter, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = spring({ frame: frame - at, fps, config: SPRING.list })
  const present = presenceOf(matter, frame, fps)

  if (frame < at || present <= 0.002) return null

  const shown = interpolate(present, [0.35, 0.85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        height: px((ROW_H + ROW_GAP) * present),
        // Only while the box is mid-collapse, so the card's resting shadow is
        // never clipped by a wrapper that is not doing anything.
        overflow: present < 0.998 ? 'hidden' : 'visible',
      }}
    >
      <div
        style={{
          opacity: enter * shown,
          transform: `translate(${(1 - present) * px(-12)}px, ${interpolate(
            enter,
            [0, 1],
            [px(-14), 0],
          )}px) scale(${interpolate(enter, [0, 1], [0.97, 1])})`,
        }}
      >
        <TaskRow
          emoji={matter.emoji}
          tint={matter.tint}
          title={matter.title}
          meta={matter.meta}
          trailing={
            matter.overdue ? <Pill tone="accent">Overdue</Pill> : <Pill>Reminder</Pill>
          }
          style={{ height: px(ROW_H), boxSizing: 'border-box' }}
        />
      </div>
    </div>
  )
}

const CHIPS = [
  { count: '5', label: 'due', drills: false },
  { count: '3', label: 'overdue', drills: true },
  { count: '12', label: 'done', drills: false },
] as const

/**
 * The standing summary of the workspace — and the way into it. The overdue
 * number is the one that gets tapped, because it is the number a person
 * actually reacts to.
 */
const SummaryStrip: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const T = useT()
  const s = (sec: number) => sec * fps
  const enter = spring({ frame: frame - s(BEAT.strip), fps, config: SPRING.list })
  if (enter <= 0.001) return null

  const press =
    interpolate(
      frame,
      [s(BEAT.tapOverdue), s(BEAT.tapOverdue + 0.12), s(BEAT.filtered)],
      [0, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ) +
    interpolate(
      frame,
      [s(BEAT.clearOverdue), s(BEAT.clearOverdue + 0.12), s(BEAT.restored)],
      [0, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    )

  // The chip lights on the tap, not when the list has finished settling — a
  // filter that looks unresponsive for a third of a second reads as a bug.
  const active = frame >= s(BEAT.tapOverdue) && frame < s(BEAT.clearOverdue)

  return (
    <div
      style={{
        marginTop: px(18),
        display: 'flex',
        gap: px(8),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-10), 0])}px)`,
      }}
    >
      {CHIPS.map((chip) => {
        const on = chip.drills && active
        return (
          <div
            key={chip.label}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: px(6),
              padding: `${px(9)}px ${px(13)}px`,
              borderRadius: R.pill,
              background: on ? T.solid : T.surface,
              boxShadow: T.shadowCard,
              transform: `scale(${chip.drills ? 1 - press * 0.06 : 1})`,
            }}
          >
            <span
              style={{
                fontSize: px(15),
                fontWeight: 800,
                color: on ? T.solidInk : chip.drills ? T.warning : T.ink,
              }}
            >
              {chip.count}
            </span>
            <span
              style={{ fontSize: px(11.5), fontWeight: 700, color: on ? T.solidInk : T.inkMuted }}
            >
              {chip.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** The field, and the sentence going into it a character at a time. */
const SearchField: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const T = useT()
  const s = (sec: number) => sec * fps
  const enter = spring({ frame: frame - s(BEAT.field), fps, config: SPRING.list })
  if (enter <= 0.001) return null

  const press = interpolate(
    frame,
    [s(BEAT.tapField), s(BEAT.tapField + 0.12), s(BEAT.focus)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const focused = frame >= s(BEAT.focus)
  const typed = interpolate(frame, [s(BEAT.typeFrom), s(BEAT.typeTo)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const written = QUERY.slice(0, Math.round(QUERY.length * typed))
  const typing = frame >= s(BEAT.typeFrom) && frame < s(BEAT.typeTo)
  // A caret that blinks while characters are landing looks like a dropped
  // frame, so it only blinks when the field is idle.
  const caret = focused && (typing || Math.floor(frame / 15) % 2 === 0)
  const count = fadeIn(frame, s(BEAT.matched), 10)

  return (
    <div
      style={{
        marginTop: px(10),
        display: 'flex',
        alignItems: 'center',
        gap: px(10),
        padding: `${px(12)}px ${px(15)}px`,
        borderRadius: R.pill,
        background: T.surface,
        border: `${px(1.5)}px solid ${focused ? T.accent : 'transparent'}`,
        boxShadow: focused ? T.shadowElevated : T.shadowCard,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-10), 0])}px) scale(${
          1 - press * 0.02
        })`,
      }}
    >
      <span style={{ fontSize: px(14), lineHeight: 1 }}>🔍</span>

      <span
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          fontSize: px(13.5),
          fontWeight: 700,
          whiteSpace: 'nowrap',
          color: written ? T.ink : T.inkSubtle,
        }}
      >
        {written || (focused ? '' : 'Search your matters')}
        {caret ? (
          <span
            style={{
              display: 'inline-block',
              width: px(2),
              height: px(16),
              marginLeft: px(1.5),
              borderRadius: px(1),
              background: T.accent,
            }}
          />
        ) : null}
      </span>

      {count > 0.001 ? (
        <span
          style={{
            flex: 'none',
            opacity: count,
            fontSize: px(11.5),
            fontWeight: 800,
            color: T.inkMuted,
          }}
        >
          2 matches
        </span>
      ) : null}
    </div>
  )
}

/**
 * What Kitto took the sentence to mean, spelled out. "Next month" is a guess
 * about dates, and a guess the user cannot see is a guess they cannot correct.
 */
const QueryReading: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const T = useT()
  const s = (sec: number) => sec * fps
  const enter = spring({ frame: frame - s(BEAT.matched), fps, config: SPRING.step })
  if (enter <= 0.001) return null

  return (
    <div
      style={{
        marginTop: px(12),
        display: 'flex',
        alignItems: 'center',
        gap: px(7),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-8), 0])}px)`,
      }}
    >
      <span
        style={{
          fontSize: px(10),
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: T.inkSubtle,
        }}
      >
        READ AS
      </span>
      <CiteChip>🚗 Car</CiteChip>
      <CiteChip>1–31 July</CiteChip>
    </div>
  )
}
