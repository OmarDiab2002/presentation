import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill, CiteChip, ConfidenceDot } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'
import { fadeIn } from './shared'

/**
 * SCAN — the part of a life that arrives on paper.
 *
 * The beat that matters is the review: nothing is saved until the user has
 * seen every extracted value, how sure Kitto was about each one, and the page
 * it came from. A scan that wrote straight through would be the exact failure
 * `principles.md` calls unrecoverable.
 */
const BEAT = {
  tapScan: 0.9,
  open: 1.15, // the capture surface takes over the screen
  shutter: 3.4,
  processing: 3.7,
  review: 6.0,
  fields: [6.6, 7.4, 8.2], // each extracted value lands in turn
  accept: 11.0,
  close: 11.4, // the capture surface collapses
  row: 11.9,
  closing: 13.0,
} as const

export const ScanAct: React.FC<{ display: string }> = ({ display }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const opening = spring({ frame: frame - s(BEAT.open), fps, config: SPRING.morph })
  const closing = spring({ frame: frame - s(BEAT.close), fps, config: SPRING.morph })
  const open = Math.max(0, opening - closing)

  const tap = interpolate(frame, [s(BEAT.tapScan), s(BEAT.tapScan + 0.12), s(BEAT.open)], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Stage
      display={display}
      overlay={open > 0.001 ? <CaptureSurface open={open} frame={frame} s={s} fps={fps} /> : null}
    >
      <ScanTile press={tap} dimmed={open} />

      {frame >= s(BEAT.row) ? <ResultRow at={s(BEAT.row)} /> : null}

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Two values checked, one matter filed.
      </Closing>
    </Stage>
  )
}

/** The way in, sitting on the home screen where the app's quick links are. */
const ScanTile: React.FC<{ press: number; dimmed: number }> = ({ press, dimmed }) => {
  const T = useT()
  return (
    <div
      style={{
        marginTop: px(26),
        opacity: 1 - dimmed * 0.6,
        transform: `scale(${1 - press * 0.03})`,
        display: 'flex',
        alignItems: 'center',
        gap: px(14),
        padding: `${px(16)}px ${px(16)}px`,
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
          background: T.accentSoft,
          display: 'grid',
          placeItems: 'center',
          fontSize: px(20),
        }}
      >
        📷
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: px(15), fontWeight: 800, color: T.ink }}>Scan a document</p>
        <p style={{ margin: `${px(2)}px 0 0`, fontSize: px(12.5), fontWeight: 500, color: T.inkMuted }}>
          A bill, a letter, a form.
        </p>
      </div>
    </div>
  )
}

/**
 * Capture, processing and review as ONE continuous surface rather than three
 * screens — the same single-morph shape `DocumentCaptureFlow.tsx` uses.
 */
const CaptureSurface: React.FC<{
  open: number
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ open, frame, s, fps }) => {
  const T = useT()
  const inset = interpolate(open, [0, 1], [px(60), 0])
  const radius = interpolate(open, [0, 1], [px(24), 0])
  const reviewing = frame >= s(BEAT.review)

  return (
    <AbsoluteFill
      style={{
        top: inset,
        left: inset,
        right: inset,
        bottom: inset,
        borderRadius: radius,
        overflow: 'hidden',
        background: reviewing ? T.canvas : 'rgb(12, 12, 14)',
        boxShadow: T.shadowElevated,
        opacity: open,
      }}
    >
      {reviewing ? (
        <ReviewPane frame={frame} s={s} fps={fps} />
      ) : (
        <Viewfinder frame={frame} s={s} />
      )}
    </AbsoluteFill>
  )
}

/** The camera, with the page framed and then read. */
const Viewfinder: React.FC<{ frame: number; s: (sec: number) => number }> = ({ frame, s }) => {
  const T = useT()
  const captured = frame >= s(BEAT.shutter)
  const processing = frame >= s(BEAT.processing)

  // The shutter flash: one frame of white, gone before it registers as an effect.
  const flash = interpolate(
    frame,
    [s(BEAT.shutter) - 1, s(BEAT.shutter), s(BEAT.shutter + 0.12)],
    [0, 0.75, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill style={{ display: 'grid', placeItems: 'center', padding: px(28) }}>
      <BillPage scanned={processing} frame={frame} s={s} />

      {/* Corner brackets — the page is found, not merely photographed. */}
      {!captured ? <Brackets /> : null}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: px(34),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: px(14),
        }}
      >
        <p style={{ margin: 0, fontSize: px(13), fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
          {processing ? 'Reading the page…' : 'Hold the page in frame'}
        </p>
        {!captured ? <Shutter /> : null}
      </div>

      <AbsoluteFill style={{ background: '#fff', opacity: flash, pointerEvents: 'none' }} />
    </AbsoluteFill>
  )
}

const Brackets: React.FC = () => {
  const corners = [
    { top: px(40), left: px(28), borders: { borderTop: 1, borderLeft: 1 } },
    { top: px(40), right: px(28), borders: { borderTop: 1, borderRight: 1 } },
    { bottom: px(120), left: px(28), borders: { borderBottom: 1, borderLeft: 1 } },
    { bottom: px(120), right: px(28), borders: { borderBottom: 1, borderRight: 1 } },
  ]
  return (
    <>
      {corners.map((c, i) => {
        const { borders, ...pos } = c
        const style: React.CSSProperties = {
          position: 'absolute',
          width: px(30),
          height: px(30),
          borderColor: 'rgba(255,255,255,0.85)',
          borderStyle: 'solid',
          borderWidth: 0,
          ...pos,
        }
        if (borders.borderTop) style.borderTopWidth = px(3)
        if (borders.borderBottom) style.borderBottomWidth = px(3)
        if (borders.borderLeft) style.borderLeftWidth = px(3)
        if (borders.borderRight) style.borderRightWidth = px(3)
        return <div key={i} style={style} />
      })}
    </>
  )
}

const Shutter: React.FC = () => (
  <div
    style={{
      width: px(58),
      height: px(58),
      borderRadius: R.pill,
      border: `${px(3)}px solid rgba(255,255,255,0.9)`,
      padding: px(4),
    }}
  >
    <div style={{ width: '100%', height: '100%', borderRadius: R.pill, background: '#fff' }} />
  </div>
)

/** The document itself: a bill, with the two values that matter on it. */
const BillPage: React.FC<{ scanned: boolean; frame: number; s: (sec: number) => number }> = ({
  scanned,
  frame,
  s,
}) => {
  // The read sweeps down the page once, then the review takes over.
  const sweep = interpolate(frame, [s(BEAT.processing), s(BEAT.review)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '86%',
        aspectRatio: '1 / 1.35',
        borderRadius: px(8),
        background: 'rgb(252, 251, 249)',
        padding: px(26),
        overflow: 'hidden',
        transform: 'rotate(-1.2deg)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
      }}
    >
      <p style={{ margin: 0, fontSize: px(11), fontWeight: 800, letterSpacing: '0.1em', color: '#9b9b9b' }}>
        CITY ELECTRIC
      </p>
      <p style={{ margin: `${px(10)}px 0 0`, fontSize: px(15), fontWeight: 800, color: '#2a2a2a' }}>
        Statement of account
      </p>

      {[92, 74, 84, 60].map((w, i) => (
        <div
          key={i}
          style={{
            marginTop: px(i === 0 ? 18 : 8),
            width: `${w}%`,
            height: px(5),
            borderRadius: px(3),
            background: '#e6e4e0',
          }}
        />
      ))}

      <div style={{ marginTop: px(22), display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: px(12), fontWeight: 700, color: '#8a8a8a' }}>Amount due</span>
        <span style={{ fontSize: px(15), fontWeight: 800, color: '#2a2a2a' }}>EGP 842.50</span>
      </div>
      <div style={{ marginTop: px(8), display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: px(12), fontWeight: 700, color: '#8a8a8a' }}>Pay by</span>
        <span style={{ fontSize: px(15), fontWeight: 800, color: '#2a2a2a' }}>20 June</span>
      </div>

      {[88, 70].map((w, i) => (
        <div
          key={i}
          style={{
            marginTop: px(i === 0 ? 22 : 8),
            width: `${w}%`,
            height: px(5),
            borderRadius: px(3),
            background: '#e6e4e0',
          }}
        />
      ))}

      {scanned ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${sweep * 100}%`,
            height: px(3),
            background: 'rgb(250, 106, 90)',
            boxShadow: '0 0 24px rgba(250,106,90,0.9)',
          }}
        />
      ) : null}
    </div>
  )
}

/** What was read, before any of it becomes a matter. */
const ReviewPane: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ frame, s, fps }) => {
  const T = useT()
  const accepted = frame >= s(BEAT.accept)
  const press = interpolate(frame, [s(BEAT.accept), s(BEAT.accept + 0.12), s(BEAT.close)], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const FIELDS = [
    { label: 'Amount', value: 'EGP 842.50', confidence: 'high' as const, page: 'p.1' },
    { label: 'Due date', value: '20 June', confidence: 'high' as const, page: 'p.1' },
    { label: 'Account no.', value: '4417-2290', confidence: 'medium' as const, page: 'p.2' },
  ]

  return (
    <AbsoluteFill style={{ padding: `${px(30)}px ${px(20)}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: px(10), marginBottom: px(6) }}>
        <Pill tone="accent">Bill</Pill>
        <span style={{ fontSize: px(11), fontWeight: 800, letterSpacing: '0.1em', color: T.inkSubtle }}>
          CITY ELECTRIC
        </span>
      </div>

      <p style={{ margin: `${px(8)}px 0 ${px(4)}px`, fontSize: px(20), fontWeight: 800, color: T.ink }}>
        Here is what I read.
      </p>
      <p style={{ margin: 0, fontSize: px(13), fontWeight: 500, color: T.inkMuted }}>
        Nothing is saved until you say so.
      </p>

      <div style={{ marginTop: px(18), display: 'flex', flexDirection: 'column', gap: px(9) }}>
        {FIELDS.map((f, i) => (
          <FieldRow key={f.label} field={f} at={s(BEAT.fields[i])} frame={frame} fps={fps} />
        ))}
      </div>

      <div
        style={{
          marginTop: px(20),
          padding: `${px(13)}px ${px(16)}px`,
          borderRadius: R.pill,
          background: accepted ? T.accentSoft : T.solid,
          color: accepted ? T.accentPressed : T.solidInk,
          fontSize: px(15),
          fontWeight: 800,
          textAlign: 'center',
          transform: `scale(${1 - press * 0.04})`,
          opacity: fadeIn(frame, s(BEAT.fields[2]) + 10, 8),
        }}
      >
        {accepted ? 'Filed' : 'Create 1 matter'}
      </div>
    </AbsoluteFill>
  )
}

const FieldRow: React.FC<{
  field: { label: string; value: string; confidence: 'high' | 'medium'; page: string }
  at: number
  frame: number
  fps: number
}> = ({ field, at, frame, fps }) => {
  const T = useT()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.step })
  const low = field.confidence === 'medium'

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(10), 0])}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: px(10),
        padding: `${px(11)}px ${px(14)}px`,
        borderRadius: px(18),
        background: T.surface,
        boxShadow: T.shadowCard,
      }}
    >
      <ConfidenceDot level={field.confidence} />
      <span style={{ flex: 1, fontSize: px(12.5), fontWeight: 700, color: T.inkMuted }}>
        {field.label}
      </span>
      <span
        style={{
          fontSize: px(14),
          fontWeight: 800,
          color: low ? T.warning : T.ink,
          marginRight: px(6),
        }}
      >
        {field.value}
      </span>
      <CiteChip>📄 {field.page}</CiteChip>
    </div>
  )
}

const ResultRow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const enter = spring({ frame: frame - at, fps, config: SPRING.list })

  return (
    <div
      style={{
        marginTop: px(14),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-14), 0])}px)`,
      }}
    >
      <TaskRow
        emoji="🏠"
        tint={DOMAIN.home}
        title="Pay the electricity bill"
        meta="Due 20 June · EGP 842.50"
        trailing={<CiteChip>📄 p.1</CiteChip>}
      />
    </div>
  )
}
