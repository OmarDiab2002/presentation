import React from 'react'
import { useT, R, px } from '../theme'

/**
 * The signature mark of the system: an emoji inside a pastel circle. It tells
 * you which part of a life a row belongs to before you read a word of it.
 */
export const EmojiChip: React.FC<{ emoji: string; tint: string; size?: number }> = ({
  emoji,
  tint,
  size = 44,
}) => (
  <div
    style={{
      flex: 'none',
      width: px(size),
      height: px(size),
      borderRadius: R.pill,
      background: tint,
      display: 'grid',
      placeItems: 'center',
      fontSize: px(size * 0.5),
      lineHeight: 1,
    }}
  >
    {emoji}
  </div>
)

/**
 * The workhorse list row, matching `components/ui/TaskRow.tsx`: identity chip,
 * title, one line of quiet meta, and a trailing affordance.
 */
export const TaskRow: React.FC<{
  emoji: string
  tint: string
  title: string
  meta: string
  trailing?: React.ReactNode
  style?: React.CSSProperties
}> = ({ emoji, tint, title, meta, trailing, style }) => {
  const T = useT()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: px(14),
        padding: `${px(12)}px ${px(14)}px`,
        borderRadius: px(24),
        background: T.surface,
        boxShadow: T.shadowCard,
        ...style,
      }}
    >
      <EmojiChip emoji={emoji} tint={tint} size={40} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: px(1) }}>
        <span
          style={{
            fontSize: px(15),
            fontWeight: 800,
            color: T.ink,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </span>
        <span
          style={{ fontSize: px(12.5), fontWeight: 500, color: T.inkMuted, whiteSpace: 'nowrap' }}
        >
          {meta}
        </span>
      </div>
      {trailing}
    </div>
  )
}

/** A small status pill — "No date", "Reminder". */
export const Pill: React.FC<{ children: React.ReactNode; tone?: 'quiet' | 'accent' }> = ({
  children,
  tone = 'quiet',
}) => {
  const T = useT()
  return (
    <span
      style={{
        flex: 'none',
        padding: `${px(4.5)}px ${px(10)}px`,
        borderRadius: R.pill,
        background: tone === 'accent' ? T.accentSoft : T.surfaceSunken,
        color: tone === 'accent' ? T.accentPressed : T.inkMuted,
        fontSize: px(11),
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** The iOS-style status bar, so the screen reads as a real phone. */
export const StatusBar: React.FC = () => {
  const T = useT()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${px(16)}px ${px(28)}px ${px(4)}px`,
        color: T.ink,
        fontSize: px(15),
        fontWeight: 800,
      }}
    >
      <span>9:41</span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: px(6) }}>
        {[0.35, 0.6, 0.85, 1].map((h, i) => (
          <div
            key={i}
            style={{ width: px(3.5), height: px(11 * h), borderRadius: px(2), background: T.ink }}
          />
        ))}
        <div
          style={{
            marginLeft: px(4),
            width: px(24),
            height: px(12),
            borderRadius: px(3),
            border: `${px(1.5)}px solid ${T.ink}`,
            padding: px(1.5),
          }}
        >
          <div style={{ width: '75%', height: '100%', borderRadius: px(1), background: T.ink }} />
        </div>
      </div>
    </div>
  )
}

/**
 * The trust primitive: every value the AI read shows the page it came from.
 * `AGENTS.md` is blunt about this — a surface that renders an AI-derived value
 * without provenance is not done.
 */
export const CiteChip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const T = useT()
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: px(4),
        flex: 'none',
        padding: `${px(3)}px ${px(8)}px`,
        borderRadius: R.pill,
        background: T.surfaceField,
        color: T.inkMuted,
        fontSize: px(10),
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/**
 * How sure the extractor was about one field. Low confidence is rendered in
 * `warning` tone rather than hidden, because the whole point is that the user
 * can see which number to double-check.
 */
export const ConfidenceDot: React.FC<{ level: 'high' | 'medium' }> = ({ level }) => {
  const T = useT()
  return (
    <span
      style={{
        flex: 'none',
        width: px(7),
        height: px(7),
        borderRadius: R.pill,
        background: level === 'high' ? T.success : T.warning,
      }}
    />
  )
}
