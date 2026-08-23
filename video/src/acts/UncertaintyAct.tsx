import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill, EmojiChip } from '../components/parts'
import { Stage, QuoteCard } from '../components/Stage'
import { VoiceIsland } from '../components/VoiceIsland'
import { useSpeakBeat, markAt, fadeIn } from './shared'
import { Closing } from './CaptureAct'

/**
 * ACT TWO — it asks instead of guessing.
 *
 * A bill with no date is the case where being wrong is expensive, so Kitto
 * files the matter immediately and withholds only the reminder. The question it
 * asks is the one that decides the deadline — "when is it due" — never "when
 * would you like a reminder".
 */
const PHRASES = [{ text: 'Pay the electricity bill', tail: '.' }] as const
const SPOKEN = 'Pay the electricity bill.'

const BEAT = {
  tap: 0.7,
  open: 0.95,
  speakFrom: 1.6,
  speakTo: 4.1,
  savePress: 4.8,
  close: 5.05,
  quote: 5.5,
  mark: 6.1,
  row: 6.45, // filed at once, but with no date
  ask: 7.4, // the question card
  // Three seconds of dwell: the question and all three options have to be
  // readable before anything moves.
  tapOption: 10.8,
  resolved: 11.3, // the row becomes a reminder
  closing: 12.3,
} as const

export const UncertaintyAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const beat = useSpeakBeat(frame, fps, BEAT)
  const quote = spring({ frame: frame - s(BEAT.quote), fps, config: SPRING.morph })
  const phrases = PHRASES.map((p) => ({ ...p, mark: markAt(frame, s(BEAT.mark)) }))

  const resolved = frame >= s(BEAT.resolved)
  const rowEnter = spring({ frame: frame - s(BEAT.row), fps, config: SPRING.list })

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
      <QuoteCard progress={quote} phrases={phrases} />

      {frame >= s(BEAT.row) ? (
        <div
          style={{
            marginTop: px(16),
            opacity: rowEnter,
            transform: `translateY(${interpolate(rowEnter, [0, 1], [px(-16), 0])}px)`,
          }}
        >
          <TaskRow
            emoji="🏠"
            tint={DOMAIN.home}
            title="Pay the electricity bill"
            meta={resolved ? 'Due 20 June · warns 15 June' : 'Filed — waiting on a date'}
            trailing={
              resolved ? <Pill tone="accent">Reminder</Pill> : <Pill>No date</Pill>
            }
          />
        </div>
      ) : null}

      <QuestionCard frame={frame} s={s} fps={fps} />

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Filed straight away. Only the reminder waited.
      </Closing>
    </Stage>
  )
}

/**
 * The question, as the app renders it: the item is already saved, so the card
 * says so, and the options are pre-resolved dates the user can take in one tap.
 */
const QuestionCard: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ frame, s, fps }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.ask), fps, config: SPRING.morph })
  // The card leaves once its answer has been applied.
  const leave = interpolate(frame, [s(BEAT.resolved), s(BEAT.resolved + 0.45)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const shown = Math.max(0, enter - leave)
  if (shown <= 0.001) return null

  // The chosen chip presses in just before the card goes.
  const press = interpolate(
    frame,
    [s(BEAT.tapOption), s(BEAT.tapOption + 0.12), s(BEAT.resolved)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const chosen = frame >= s(BEAT.tapOption)

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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: px(10), marginBottom: px(10) }}>
        <EmojiChip emoji="👻" tint={T.accentSoft} size={28} />
        <span
          style={{ fontSize: px(10), fontWeight: 800, letterSpacing: '0.1em', color: T.inkSubtle }}
        >
          ONE QUESTION
        </span>
      </div>

      <p style={{ margin: 0, fontSize: px(16), lineHeight: 1.4, fontWeight: 700, color: T.ink }}>
        It is filed. When is the bill due?
      </p>
      <p
        style={{
          margin: `${px(5)}px 0 ${px(12)}px`,
          fontSize: px(13),
          fontWeight: 500,
          color: T.inkMuted,
        }}
      >
        A wrong date here costs you a late fee, so I would rather ask.
      </p>

      <div style={{ display: 'flex', gap: px(8) }}>
        {['The 20th', 'The 25th', 'Type a date'].map((label, i) => {
          const isChoice = i === 0
          const active = isChoice && chosen
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
