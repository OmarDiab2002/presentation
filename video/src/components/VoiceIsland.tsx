import React from 'react'
import { interpolate } from 'remotion'
import { useT, R, px } from '../theme'
import { MicGlyph } from './TabBar'

/**
 * The recording surface, morphing out of the coral mic exactly as
 * `components/voice/VoiceIsland.tsx` does: it grows from the button's own rect
 * and collapses back into it. A panel that slides up from nowhere is the bug;
 * the morph is the house style.
 */
export const VoiceIsland: React.FC<{
  /** 0 = collapsed onto the mic, 1 = fully open. */
  open: number
  /** Frame count since recording started — drives the waveform. */
  recordingFrame: number
  /** How much of the sentence has been transcribed, 0..1. */
  transcript: number
  /** The sentence being spoken. */
  text: string
  /** 0 = idle, 1 = the save button is pressed. */
  savePress?: number
}> = ({ open, recordingFrame, transcript, text, savePress = 0 }) => {
  const T = useT()
  // Collapsed, the island IS the mic: same 52pt circle, same coral.
  const width = interpolate(open, [0, 1], [px(52), px(320)])
  const height = interpolate(open, [0, 1], [px(52), px(210)])
  const radius = interpolate(open, [0, 1], [R.pill, px(30)])

  // Content fades in only once the shape is most of the way there — the app's
  // MORPH_CONTENT_VARIANTS does the same, so text never scales with the box.
  const content = interpolate(open, [0.55, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const shown = Math.round(text.length * transcript)

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: px(40),
        transform: 'translateX(-50%)',
        width,
        height,
        borderRadius: radius,
        background: interpolateColor(open, T.accent, T.surface),
        boxShadow: T.shadowElevated,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* The mic glyph rides the collapsed state, so the first and last frames
          of the morph are indistinguishable from the resting button. */}
      <div style={{ position: 'absolute', opacity: 1 - content }}>
        <MicGlyph size={px(22)} color={T.accentInk} />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: px(22),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: content,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: px(10) }}>
          <RecordingDot frame={recordingFrame} />
          <span style={{ fontSize: px(13), fontWeight: 800, color: T.inkMuted, letterSpacing: '0.08em' }}>
            LISTENING
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: px(18),
            lineHeight: 1.35,
            fontWeight: 600,
            color: T.ink,
            minHeight: px(74),
          }}
        >
          {text.slice(0, shown)}
          <Caret frame={recordingFrame} />
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: px(14) }}>
          <Waveform frame={recordingFrame} />
          <div
            style={{
              flex: 'none',
              padding: `${px(9)}px ${px(18)}px`,
              borderRadius: R.pill,
              background: T.solid,
              color: T.solidInk,
              fontSize: px(14),
              fontWeight: 800,
              transform: `scale(${1 - savePress * 0.06})`,
            }}
          >
            Save
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Coral while collapsed (it is the mic), surface once it is a panel. The two
 * endpoints come from the palette so the dark render lands on the dark surface
 * rather than on white.
 */
const interpolateColor = (open: number, from: string, to: string) => {
  const t = interpolate(open, [0, 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const rgb = (c: string) => (c.match(/\d+/g) ?? ['0', '0', '0']).map(Number)
  const [r1, g1, b1] = rgb(from)
  const [r2, g2, b2] = rgb(to)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t)
  return `rgb(${mix(r1, r2)}, ${mix(g1, g2)}, ${mix(b1, b2)})`
}

const RecordingDot: React.FC<{ frame: number }> = ({ frame }) => {
  const T = useT()
  // A slow breath rather than a blink. The app never flashes at you.
  const pulse = 0.55 + 0.45 * Math.sin(frame / 7)
  return (
    <div
      style={{
        width: px(9),
        height: px(9),
        borderRadius: R.pill,
        background: T.accent,
        opacity: pulse,
      }}
    />
  )
}

const Caret: React.FC<{ frame: number }> = ({ frame }) => {
  const T = useT()
  return (
  <span
    style={{
      display: 'inline-block',
      width: px(2),
      height: px(19),
      marginLeft: px(2),
      verticalAlign: 'text-bottom',
      background: T.accent,
        opacity: frame % 16 < 9 ? 1 : 0,
      }}
    />
  )
}

/**
 * The live level meter. Deterministic per bar and per frame — a random walk
 * would render differently on every frame of the same render.
 */
const Waveform: React.FC<{ frame: number }> = ({ frame }) => {
  const T = useT()
  const bars = 22
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: px(3.5),
        height: px(34),
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const wave =
          Math.sin(frame / 4 + i * 0.7) * 0.5 +
          Math.sin(frame / 2.3 + i * 1.9) * 0.3 +
          Math.sin(frame / 9 + i * 0.3) * 0.2
        const h = px(6) + Math.abs(wave) * px(26)
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: R.pill,
              background: T.accent,
              opacity: 0.35 + Math.abs(wave) * 0.65,
            }}
          />
        )
      })}
    </div>
  )
}
