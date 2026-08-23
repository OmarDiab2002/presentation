import React from 'react'
import { AbsoluteFill } from 'remotion'
import { useT, R, px } from '../theme'
import { StatusBar } from './parts'
import { TabBar, MicButton } from './TabBar'

/**
 * The phone chrome every act shares: the veined canvas, the status bar, the
 * date and greeting, and the floating tab bar with its coral mic.
 *
 * Acts differ only in what happens in the content well and on the island, so
 * everything else lives here — three copies of a home screen is three chances
 * for one of them to drift.
 */
export const Stage: React.FC<{
  /** 0 = mic resting, 1 = the island has taken the bar's slot. */
  handover?: number
  micPress?: number
  display: string
  children: React.ReactNode
  /** Rendered above the tab bar, outside the content flow. */
  overlay?: React.ReactNode
}> = ({ handover = 0, micPress = 0, display, children, overlay }) => {
  const T = useT()
  return (
  <AbsoluteFill style={{ background: T.canvas }}>
    <AbsoluteFill
      style={{ backgroundImage: T.veil }}
    />

    <StatusBar />

    <div style={{ padding: `${px(6)}px ${px(18)}px 0` }}>
      <p
        style={{
          margin: 0,
          fontSize: px(11.5),
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: T.inkSubtle,
        }}
      >
        THURSDAY, 12 JUNE
      </p>
      <h1
        style={{
          margin: `${px(5)}px 0 0`,
          fontFamily: display,
          fontSize: px(28),
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: T.ink,
        }}
      >
        Good morning, Mina.
      </h1>

      {children}
    </div>

    <TabBar handover={handover} />
    <MicButton press={micPress} handover={handover} />
    {overlay}
  </AbsoluteFill>
  )
}

/** The "YOU SAID" card — the sentence, kept on screen as the source. */
export const QuoteCard: React.FC<{
  progress: number
  /** One entry per phrase: the words, the punctuation after them, and how
   *  strongly the phrase is currently marked (0..1). */
  phrases: { text: string; tail: string; mark: number }[]
  style?: React.CSSProperties
}> = ({ progress, phrases, style }) => {
  const T = useT()
  if (progress <= 0.001) return null
  const y = (1 - progress) * px(20)

  return (
    <div
      style={{
        marginTop: px(20),
        opacity: progress,
        transform: `translateY(${y}px)`,
        padding: `${px(13)}px ${px(15)}px`,
        borderRadius: px(22),
        background: T.surface,
        boxShadow: T.shadowCard,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: px(8), marginBottom: px(7) }}>
        <div
          style={{
            width: px(16),
            height: px(16),
            borderRadius: R.pill,
            background: T.accentSoft,
            display: 'grid',
            placeItems: 'center',
            fontSize: px(8),
            color: T.accentPressed,
          }}
        >
          ●
        </div>
        <span
          style={{
            fontSize: px(10),
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: T.inkSubtle,
          }}
        >
          YOU SAID
        </span>
      </div>

      <p style={{ margin: 0, fontSize: px(15), lineHeight: 1.5, fontWeight: 600, color: T.ink }}>
        {phrases.map((phrase) => (
          <span key={phrase.text}>
            <span
              style={{
                background: `rgba(250, 106, 90, ${phrase.mark * 0.3})`,
                color: phrase.mark > 0.2 ? T.accentPressed : T.ink,
                borderRadius: px(6),
                padding: `${px(2)}px ${px(1.5)}px`,
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
              }}
            >
              {phrase.text}
            </span>
            <span style={{ color: T.inkMuted }}>{phrase.tail}</span>
          </span>
        ))}
      </p>
    </div>
  )
}
