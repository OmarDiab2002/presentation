import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill, EmojiChip } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'

/**
 * REMINDERS — how early to warn you is a property of the thing, not a setting.
 *
 * The slide already carries the whole table of lead times, so this act spends
 * its fourteen seconds on one obligation instead. A passport is the clearest
 * case: eight months out, four nudges, the first of them six months before the
 * date. Beside it sits the single alarm a plain reminder app would have fired,
 * drawn in the same geometry so the comparison needs no caption — an alarm on
 * the day a passport expires is not a warning, and that only lands if you can
 * see both schedules at once.
 */

/** The plan Kitto builds for a document with a six-month lead time. */
const NUDGES = [
  { date: '12 Aug', label: 'Six months before' },
  { date: '12 Jan', label: 'One month before' },
  { date: '5 Feb', label: 'One week before' },
  { date: '12 Feb', label: 'The day it expires' },
] as const

const BEAT = {
  row: 0.4, // the matter is created
  plan: 1.35, // Kitto states the lead time it chose, and why
  // Each nudge is one short line rather than a card, so they can arrive closer
  // together than full rows would — but all four have to be standing, and
  // still, well before the contrast beat draws the eye away.
  nudges: [3.0, 3.8, 4.6, 5.4],
  quiet: 5.9, // the night rule, and the row's summary of the plan
  contrast: 8.9, // what a plain reminder app would have done with the same date
  closing: 12.3,
} as const

export const RemindersAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const rowEnter = spring({ frame: frame - s(BEAT.row), fps, config: SPRING.list })

  // The trailing pill dips through zero so its label can change without a
  // visible cut: "Just added" on the way down, "4 nudges" on the way back up.
  const swap = interpolate(
    frame,
    [s(BEAT.quiet), s(BEAT.quiet + 0.14), s(BEAT.quiet + 0.34)],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const planned = frame >= s(BEAT.quiet + 0.14)

  return (
    <Stage display={display}>
      {frame >= s(BEAT.row) ? (
        <div
          style={{
            marginTop: px(20),
            opacity: rowEnter,
            transform: `translateY(${interpolate(rowEnter, [0, 1], [px(-16), 0])}px)`,
          }}
        >
          <TaskRow
            emoji="🛂"
            tint={DOMAIN.finance}
            title="Renew passport"
            meta="Due 12 February"
            trailing={
              <span style={{ flex: 'none', display: 'inline-flex', opacity: swap }}>
                {planned ? <Pill tone="accent">4 nudges</Pill> : <Pill>Just added</Pill>}
              </span>
            }
          />
        </div>
      ) : null}

      <PlanCard frame={frame} s={s} fps={fps} />
      <PlainApp frame={frame} s={s} fps={fps} />

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Warned in August, not in February.
      </Closing>
    </Stage>
  )
}

/**
 * The hero: the schedule Kitto just built, stated as a rule and then as dates.
 * The rule comes first because the dates are only surprising if you already
 * know they were derived from what the thing IS.
 */
const PlanCard: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ frame, s, fps }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.plan), fps, config: SPRING.morph })
  const quiet = spring({ frame: frame - s(BEAT.quiet), fps, config: SPRING.step })
  if (enter <= 0.001) return null

  return (
    <div
      style={{
        marginTop: px(14),
        opacity: enter,
        transform: `translateY(${(1 - enter) * px(16)}px)`,
        padding: `${px(14)}px ${px(15)}px`,
        borderRadius: px(22),
        background: T.surface,
        boxShadow: T.shadowElevated,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: px(10), marginBottom: px(10) }}>
        <EmojiChip emoji="👻" tint={T.accentSoft} size={28} />
        <span
          style={{ fontSize: px(10), fontWeight: 800, letterSpacing: '0.1em', color: T.inkSubtle }}
        >
          REMINDER PLAN
        </span>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: px(15),
          lineHeight: 1.35,
          fontWeight: 700,
          color: T.ink,
        }}
      >
        A passport takes months to replace.
      </p>
      <p
        style={{
          margin: `${px(5)}px 0 ${px(12)}px`,
          fontSize: px(12.5),
          lineHeight: 1.35,
          fontWeight: 500,
          color: T.inkMuted,
        }}
      >
        So the first warning lands six months out.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {NUDGES.map((nudge, i) => (
          <NudgeRow
            key={nudge.date}
            index={i}
            date={nudge.date}
            label={nudge.label}
            frame={frame}
            s={s}
            fps={fps}
          />
        ))}
      </div>

      {quiet > 0.001 ? (
        <p
          style={{
            margin: `${px(11)}px 0 0`,
            paddingTop: px(9),
            borderTop: `${px(1)}px solid ${T.borderHair}`,
            opacity: quiet,
            fontSize: px(11.5),
            lineHeight: 1.3,
            fontWeight: 600,
            color: T.inkSubtle,
          }}
        >
          Nudges land in the morning. Never at night.
        </p>
      ) : null}
    </div>
  )
}

/**
 * One planned nudge. The connector is drawn by the row BELOW the dot it hangs
 * from, so each row owns every pixel it adds and the rail grows downward as
 * the plan is built rather than appearing whole.
 */
const NudgeRow: React.FC<{
  index: number
  date: string
  label: string
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ index, date, label, frame, s, fps }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.nudges[index]), fps, config: SPRING.list })
  if (enter <= 0.001) return null

  const first = index === 0

  return (
    <div style={{ display: 'flex', gap: px(11) }}>
      <div
        style={{
          flex: 'none',
          width: px(9),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Negative offset so the segment meets the previous dot exactly. */}
        {first ? null : (
          <div
            style={{
              marginTop: px(-4),
              width: px(1.5),
              height: px(16),
              background: T.accentSoft,
              transform: `scaleY(${enter})`,
              transformOrigin: 'top',
            }}
          />
        )}
        <div
          style={{
            marginTop: px(first ? 4 : 0),
            width: px(9),
            height: px(9),
            borderRadius: R.pill,
            background: T.accent,
            transform: `scale(${enter})`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: px(first ? 0 : 8),
          display: 'flex',
          alignItems: 'baseline',
          gap: px(10),
          opacity: enter,
          transform: `translateX(${(1 - enter) * px(8)}px)`,
        }}
      >
        <span
          style={{
            flex: 'none',
            width: px(52),
            fontSize: px(12.5),
            lineHeight: 1.35,
            fontWeight: 800,
            color: T.ink,
          }}
        >
          {date}
        </span>
        <span
          style={{
            fontSize: px(12.5),
            lineHeight: 1.35,
            fontWeight: 600,
            color: T.inkMuted,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}

/**
 * The same due date, handled by an ordinary reminder app — one dot, on the
 * date itself. It borrows the timeline's exact geometry and gives up only its
 * colour, so the eye compares four coral dots against one grey one instead of
 * reading two unrelated designs.
 */
const PlainApp: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ frame, s, fps }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.contrast), fps, config: SPRING.morph })
  if (enter <= 0.001) return null

  return (
    <div
      style={{
        marginTop: px(12),
        opacity: enter,
        transform: `translateY(${(1 - enter) * px(12)}px)`,
      }}
    >
      <span
        style={{
          display: 'block',
          marginBottom: px(8),
          fontSize: px(10),
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: T.inkSubtle,
        }}
      >
        A PLAIN REMINDER APP
      </span>

      <div
        style={{
          padding: `${px(13)}px ${px(15)}px`,
          borderRadius: px(22),
          background: T.surfaceSunken,
          border: `${px(1)}px solid ${T.borderHair}`,
        }}
      >
        <div style={{ display: 'flex', gap: px(11) }}>
          <div style={{ flex: 'none', width: px(9) }}>
            <div
              style={{
                marginTop: px(4),
                width: px(9),
                height: px(9),
                borderRadius: R.pill,
                background: T.inkSubtle,
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: px(10) }}>
            <span
              style={{
                flex: 'none',
                width: px(52),
                fontSize: px(12.5),
                lineHeight: 1.35,
                fontWeight: 800,
                color: T.inkMuted,
              }}
            >
              12 Feb
            </span>
            <span
              style={{
                fontSize: px(12.5),
                lineHeight: 1.35,
                fontWeight: 600,
                color: T.inkSubtle,
                whiteSpace: 'nowrap',
              }}
            >
              The day it expires
            </span>
          </div>
        </div>

        <p
          style={{
            margin: `${px(7)}px 0 0`,
            paddingLeft: px(20),
            fontSize: px(12),
            lineHeight: 1.3,
            fontWeight: 500,
            color: T.inkSubtle,
          }}
        >
          One alarm. Nothing before it.
        </p>
      </div>
    </div>
  )
}
