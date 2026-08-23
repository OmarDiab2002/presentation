import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { useT, SPRING, R, px } from '../theme'

/**
 * The card between acts, naming the case that follows.
 *
 * Without it the reel cuts from one screen to a nearly identical one and the
 * viewer has to work out for themselves that the subject changed — which was
 * exactly the complaint. A title costs a second and a half and removes the
 * guessing.
 */
export const TitleCard: React.FC<{
  index: number
  total: number
  title: string
  sub: string
  display: string
}> = ({ index, total, title, sub, display }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  const enter = spring({ frame, fps, config: SPRING.morph })
  // Leaves under the act that follows, so the cut is never hard.
  const leave = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const shown = enter - leave

  return (
    <AbsoluteFill style={{ background: T.canvas }}>
      <AbsoluteFill style={{ backgroundImage: T.veil }} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: `0 ${px(34)}px`,
          opacity: shown,
          transform: `translateY(${interpolate(enter, [0, 1], [px(14), 0])}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: px(10), marginBottom: px(20) }}>
          <div style={{ width: px(9), height: px(9), borderRadius: R.pill, background: T.accent }} />
          <span
            style={{
              fontSize: px(13),
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: T.inkSubtle,
            }}
          >
            {index} OF {total}
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontFamily: display,
            fontSize: px(40),
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: T.ink,
            // The card's line breaks are authored, not left to the measure.
            whiteSpace: 'pre-line',
          }}
        >
          {title}
        </h2>

        <div
          style={{
            width: px(56),
            height: px(4),
            borderRadius: R.pill,
            background: T.accent,
            margin: `${px(22)}px 0`,
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: px(18),
            lineHeight: 1.45,
            fontWeight: 500,
            color: T.inkMuted,
          }}
        >
          {sub}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
