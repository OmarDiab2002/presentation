import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill } from '../components/parts'
import { Stage, QuoteCard } from '../components/Stage'
import { VoiceIsland } from '../components/VoiceIsland'
import { useSpeakBeat, markAt } from './shared'
import { Closing } from './CaptureAct'

/**
 * ACT THREE — the conflict is found before the matter is saved.
 *
 * The check runs while the user is still choosing, and it does not merely
 * complain: it offers free times chosen for the KIND of matter. A refusal the
 * user cannot act on is just an obstacle.
 */
const PHRASES = [{ text: 'Book the car service Thursday at three', tail: '.' }] as const
const SPOKEN = 'Book the car service Thursday at three.'

const BEAT = {
  tap: 0.7,
  open: 0.95,
  speakFrom: 1.6,
  speakTo: 4.7,
  savePress: 5.4,
  close: 5.65,
  quote: 6.1,
  mark: 6.7,
  notice: 7.1, // the conflict surfaces
  tapSlot: 10.5, // a free time is taken
  placed: 11.0, // the matter lands there instead
  closing: 12.0,
} as const

export const ConflictAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const beat = useSpeakBeat(frame, fps, BEAT)
  const quote = spring({ frame: frame - s(BEAT.quote), fps, config: SPRING.morph })
  const phrases = PHRASES.map((p) => ({ ...p, mark: markAt(frame, s(BEAT.mark)) }))

  const placed = frame >= s(BEAT.placed)
  const placedEnter = spring({ frame: frame - s(BEAT.placed), fps, config: SPRING.list })

  return (
    <Stage
      display={display}
      handover={beat.open}
      micPress={beat.micPress}
      overlay={
        beat.open > 0.001 ? (
          <VoiceIsland
            open={beat.open}
            recordingFrame={frame - s(BEAT.open)}
            transcript={beat.transcript}
            text={SPOKEN}
            savePress={beat.savePress}
          />
        ) : null
      }
    >
      {/* The matter it would collide with is already on the list. */}
      <div style={{ marginTop: px(20) }}>
        <TaskRow
          emoji="🌱"
          tint={DOMAIN.health}
          title="Dentist appointment"
          meta="Thursday, 3:00 PM"
          trailing={<Pill tone="accent">Reminder</Pill>}
        />
      </div>

      <QuoteCard progress={quote} phrases={phrases} style={{ marginTop: px(14) }} />

      <ConflictNotice frame={frame} s={s} fps={fps} />

      {placed ? (
        <div
          style={{
            marginTop: px(14),
            opacity: placedEnter,
            transform: `translateY(${interpolate(placedEnter, [0, 1], [px(-16), 0])}px)`,
          }}
        >
          <TaskRow
            emoji="🚗"
            tint={DOMAIN.car}
            title="Car service"
            meta="Friday, 10:00 AM"
            trailing={<Pill tone="accent">Reminder</Pill>}
          />
        </div>
      ) : null}

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Moved, not refused.
      </Closing>
    </Stage>
  )
}

/**
 * The warning and the way out, together. Times are chosen for the kind of
 * matter — a garage gets working hours, not an evening.
 */
const ConflictNotice: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ frame, s, fps }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.notice), fps, config: SPRING.morph })
  const leave = interpolate(frame, [s(BEAT.placed), s(BEAT.placed + 0.45)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const shown = Math.max(0, enter - leave)
  if (shown <= 0.001) return null

  const press = interpolate(
    frame,
    [s(BEAT.tapSlot), s(BEAT.tapSlot + 0.12), s(BEAT.placed)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const taken = frame >= s(BEAT.tapSlot)

  return (
    <div
      style={{
        marginTop: px(14),
        opacity: shown,
        transform: `translateY(${(1 - shown) * px(16)}px)`,
        padding: `${px(14)}px ${px(15)}px`,
        borderRadius: px(22),
        background: T.surface,
        boxShadow: T.shadowElevated,
        borderTop: `${px(3)}px solid ${T.warning}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: px(8), marginBottom: px(8) }}>
        <span style={{ fontSize: px(14) }}>⚠️</span>
        <span
          style={{ fontSize: px(10), fontWeight: 800, letterSpacing: '0.1em', color: T.warning }}
        >
          THAT TIME IS TAKEN
        </span>
      </div>

      <p style={{ margin: 0, fontSize: px(15), lineHeight: 1.4, fontWeight: 700, color: T.ink }}>
        You are at the dentist Thursday at three.
      </p>
      <p
        style={{
          margin: `${px(5)}px 0 ${px(12)}px`,
          fontSize: px(13),
          fontWeight: 500,
          color: T.inkMuted,
        }}
      >
        The garage is open these times instead:
      </p>

      <div style={{ display: 'flex', gap: px(8) }}>
        {['Fri 10:00', 'Fri 14:00', 'Sat 09:00'].map((label, i) => {
          const isChoice = i === 0
          const active = isChoice && taken
          return (
            <div
              key={label}
              style={{
                padding: `${px(9)}px ${px(14)}px`,
                borderRadius: R.pill,
                background: active ? T.solid : T.surfaceSunken,
                color: active ? T.solidInk : T.inkMuted,
                fontSize: px(13),
                fontWeight: 800,
                transform: `scale(${isChoice ? 1 - press * 0.06 : 1})`,
              }}
            >
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
