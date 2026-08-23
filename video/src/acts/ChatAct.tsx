import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, SPRING, R, px } from '../theme'
import { CiteChip } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'

/**
 * CHAT — it can act, and it stops before anything large.
 *
 * The confirmation card is the point of the act. The model proposes a tool
 * call; the app validates it and waits. `toolRunner` gating is invisible in a
 * demo, so the visible half — a card that will not proceed on its own — is
 * what has to be shown.
 */
const BEAT = {
  tapFab: 0.8,
  open: 1.05, // the medallion morphs into the panel
  ask1: 1.9,
  reply1: 3.0,
  ask2: 6.2,
  propose: 7.3, // the tool call, awaiting confirmation
  tapConfirm: 10.8,
  done: 11.3,
  closing: 12.4,
} as const

export const ChatAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const open = spring({ frame: frame - s(BEAT.open), fps, config: SPRING.morph })
  const press = interpolate(frame, [s(BEAT.tapFab), s(BEAT.tapFab + 0.12), s(BEAT.open)], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Stage display={display} overlay={<ChatPanel open={open} frame={frame} s={s} fps={fps} />}>
      <Prompt press={press} dimmed={open} />

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        It never changes anything on its own.
      </Closing>
    </Stage>
  )
}

/** The mascot medallion the panel grows out of. */
const Prompt: React.FC<{ press: number; dimmed: number }> = ({ press, dimmed }) => {
  const T = useT()
  return (
    <div
      style={{
        marginTop: px(26),
        opacity: 1 - dimmed * 0.75,
        transform: `scale(${1 - press * 0.03})`,
        display: 'flex',
        alignItems: 'center',
        gap: px(14),
        padding: `${px(16)}px`,
        borderRadius: px(24),
        background: T.surface,
        boxShadow: T.shadowCard,
      }}
    >
      <div
        style={{
          width: px(44),
          height: px(44),
          borderRadius: R.pill,
          background: T.accent,
          display: 'grid',
          placeItems: 'center',
          fontSize: px(22),
        }}
      >
        👻
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: px(15), fontWeight: 800, color: T.ink }}>Ask Kitto</p>
        <p style={{ margin: `${px(2)}px 0 0`, fontSize: px(12.5), fontWeight: 500, color: T.inkMuted }}>
          Speak or type.
        </p>
      </div>
    </div>
  )
}

/** The panel, morphing out of the medallion and holding the conversation. */
const ChatPanel: React.FC<{
  open: number
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ open, frame, s, fps }) => {
  const T = useT()
  if (open <= 0.001) return null

  const height = interpolate(open, [0, 1], [px(60), px(560)])

  return (
    <div
      style={{
        position: 'absolute',
        left: px(16),
        right: px(16),
        bottom: px(110),
        height,
        borderRadius: px(30),
        background: T.surface,
        boxShadow: T.shadowElevated,
        overflow: 'hidden',
        opacity: open,
      }}
    >
      <div
        style={{
          padding: `${px(16)}px ${px(18)}px ${px(12)}px`,
          display: 'flex',
          alignItems: 'center',
          gap: px(10),
          borderBottom: `${px(1)}px solid ${T.borderHair}`,
        }}
      >
        <div
          style={{
            width: px(26),
            height: px(26),
            borderRadius: R.pill,
            background: T.accent,
            display: 'grid',
            placeItems: 'center',
            fontSize: px(14),
          }}
        >
          👻
        </div>
        <span style={{ fontSize: px(14), fontWeight: 800, color: T.ink }}>Kitto</span>
      </div>

      <div
        style={{
          padding: px(16),
          display: 'flex',
          flexDirection: 'column',
          gap: px(10),
          opacity: interpolate(open, [0.55, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <Bubble side="user" at={s(BEAT.ask1)} frame={frame} fps={fps}>
          What do I have on Thursday?
        </Bubble>

        <Bubble side="kitto" at={s(BEAT.reply1)} frame={frame} fps={fps}>
          <span>Two things — the dentist at three, and the referral letter before it.</span>
          <span style={{ display: 'inline-flex', gap: px(5), marginTop: px(8) }}>
            <CiteChip>Dentist appointment</CiteChip>
            <CiteChip>Referral letter</CiteChip>
          </span>
        </Bubble>

        <Bubble side="user" at={s(BEAT.ask2)} frame={frame} fps={fps}>
          Move the dentist to next Tuesday.
        </Bubble>

        <ToolCallCard frame={frame} s={s} fps={fps} />
      </div>
    </div>
  )
}

const Bubble: React.FC<{
  side: 'user' | 'kitto'
  at: number
  frame: number
  fps: number
  children: React.ReactNode
}> = ({ side, at, frame, fps, children }) => {
  const T = useT()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.step })
  const mine = side === 'user'

  return (
    <div
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        maxWidth: '86%',
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(8), 0])}px)`,
        padding: `${px(10)}px ${px(14)}px`,
        borderRadius: px(20),
        background: mine ? T.solid : T.surfaceSunken,
        color: mine ? T.solidInk : T.ink,
        fontSize: px(13.5),
        lineHeight: 1.45,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  )
}

/**
 * The proposed change, and the wait.
 *
 * It shows what would happen — the field, the old value, the new one — because
 * "Confirm?" over an unnamed action is not consent.
 */
const ToolCallCard: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ frame, s, fps }) => {
  const T = useT()
  if (frame < s(BEAT.propose)) return null

  const enter = spring({ frame: frame - s(BEAT.propose), fps, config: SPRING.morph })
  const done = frame >= s(BEAT.done)
  const press = interpolate(
    frame,
    [s(BEAT.tapConfirm), s(BEAT.tapConfirm + 0.12), s(BEAT.done)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <div
      style={{
        alignSelf: 'stretch',
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(10), 0])}px)`,
        padding: px(14),
        borderRadius: px(20),
        background: T.surface,
        boxShadow: T.shadowElevated,
        borderTop: `${px(3)}px solid ${done ? T.success : T.accent}`,
      }}
    >
      <span
        style={{
          fontSize: px(10),
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: done ? T.success : T.accentPressed,
        }}
      >
        {done ? 'UPDATED' : 'NEEDS YOUR OK'}
      </span>

      <p style={{ margin: `${px(8)}px 0 0`, fontSize: px(14), fontWeight: 800, color: T.ink }}>
        Move “Dentist appointment”
      </p>
      <p style={{ margin: `${px(5)}px 0 0`, fontSize: px(12.5), fontWeight: 600, color: T.inkMuted }}>
        Thursday 3:00 PM{'  →  '}
        <span style={{ color: done ? T.success : T.accentPressed }}>Tuesday 3:00 PM</span>
      </p>

      {done ? null : (
        <div style={{ display: 'flex', gap: px(8), marginTop: px(12) }}>
          <div
            style={{
              padding: `${px(8)}px ${px(14)}px`,
              borderRadius: R.pill,
              background: T.surfaceSunken,
              color: T.inkMuted,
              fontSize: px(12.5),
              fontWeight: 800,
            }}
          >
            Cancel
          </div>
          <div
            style={{
              padding: `${px(8)}px ${px(16)}px`,
              borderRadius: R.pill,
              background: T.solid,
              color: T.solidInk,
              fontSize: px(12.5),
              fontWeight: 800,
              transform: `scale(${1 - press * 0.06})`,
            }}
          >
            Confirm
          </div>
        </div>
      )}
    </div>
  )
}
