import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { EmojiChip, CiteChip, ConfidenceDot } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'

/**
 * TRUST — every date and amount shows the page it was read from.
 *
 * One wrong reminder is unrecoverable, so this act refuses to be believed on
 * its word: the source chip is tapped on camera and the claim is checked
 * against the document while the viewer watches. The third row is the other
 * half of the same promise — a figure Kitto could not read cleanly is marked
 * as unsure rather than printed as a fact.
 */
const BEAT = {
  rows: [0.3, 1.0], // two matters already on the plate: one read, one typed
  hint: 2.1, // the source chip starts asking to be tapped
  tapChip: 4.3,
  open: 4.5,
  highlight: 5.2, // the cited line is marked on the page
  // Three and a half seconds on the marked page — long enough to read the two
  // lines AND match them against the row the viewer just came from.
  closeTap: 8.6,
  close: 8.8,
  unsure: 9.5, // the honest half
  closing: 12.6,
} as const

/**
 * The page is a photograph of paper, not app chrome, so it stays warm white in
 * both palettes exactly as `ScanAct`'s bill does. A document that inverted with
 * the theme would read as a mock-up of a document.
 */
const PAPER = {
  sheet: 'rgb(252, 251, 249)',
  ink: 'rgb(42, 42, 42)',
  faint: 'rgb(150, 149, 146)',
  rule: 'rgb(230, 228, 224)',
} as const

/** The accent is identical in light and dark, so the mark on the page can be
 *  the same wash `QuoteCard` paints behind a phrase the user actually said. */
const MARK = 'rgba(250, 106, 90, 0.30)'

export const TrustAct: React.FC<{ display: string }> = ({ display }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const opening = spring({ frame: frame - s(BEAT.open), fps, config: SPRING.morph })
  const shutting = spring({ frame: frame - s(BEAT.close), fps, config: SPRING.morph })
  const open = Math.max(0, opening - shutting)

  const press = interpolate(
    frame,
    [s(BEAT.tapChip), s(BEAT.tapChip + 0.12), s(BEAT.open)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  // A ring breathes around the source chip until it is tapped. There is no
  // cursor in this footage, and the whole act depends on the viewer reading
  // that chip as a control rather than as a caption.
  const wave = (1 - Math.cos(((frame - s(BEAT.hint)) / fps) * Math.PI * 1.6)) / 2
  const halo =
    wave *
    interpolate(
      frame,
      [s(BEAT.hint), s(BEAT.hint + 0.3), s(BEAT.tapChip - 0.3), s(BEAT.tapChip)],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    )

  return (
    <Stage
      display={display}
      overlay={open > 0.001 ? <SourceViewer open={open} frame={frame} s={s} fps={fps} /> : null}
    >
      {frame >= s(BEAT.rows[0]) ? (
        <div
          style={{
            marginTop: px(22),
            display: 'flex',
            flexDirection: 'column',
            gap: px(9),
            // The list stays put under the sheet rather than fading out, so the
            // viewer keeps the row they are checking in mind while it morphs.
            opacity: 1 - open * 0.4,
          }}
        >
          <SourcedRow
            at={s(BEAT.rows[0])}
            emoji="🚗"
            tint={DOMAIN.car}
            title="Renew car insurance"
            meta="Due 30 September · EGP 4,120"
            source={
              <TapTarget press={press} halo={halo}>
                <CiteChip>📄 policy.pdf p.2</CiteChip>
              </TapTarget>
            }
          />

          {/* Nothing read it, so nothing is cited — the missing source line is
              the point, and the meta says plainly where the number came from. */}
          <SourcedRow
            at={s(BEAT.rows[1])}
            emoji="🏠"
            tint={DOMAIN.home}
            title="Pay the internet bill"
            meta="EGP 700 · you typed this"
          />

          <SourcedRow
            at={s(BEAT.unsure)}
            emoji="🚗"
            tint={DOMAIN.car}
            title="Renew car licence"
            meta={
              <>
                <ConfidenceDot level="medium" />
                <span style={{ color: T.warning, fontWeight: 800 }}>about EGP 1,150</span>
                <span>· not sure</span>
              </>
            }
            source={
              <>
                <CiteChip>📄 licence.pdf p.1</CiteChip>
                <CheckPill>Check this</CheckPill>
              </>
            }
          />
        </div>
      ) : null}

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Every number shows its page.
      </Closing>
    </Stage>
  )
}

/**
 * The app's list row with one line added under the meta for provenance.
 *
 * `TaskRow` puts its trailing slot beside the meta, and at 360 points a meta
 * carrying both a date and an amount leaves no room for a filename chip — the
 * title would ellipsis away. Provenance is this act's subject, so it gets a
 * line of its own instead of being shortened until it fits.
 */
const SourcedRow: React.FC<{
  at: number
  emoji: string
  tint: string
  title: string
  meta: React.ReactNode
  source?: React.ReactNode
}> = ({ at, emoji, tint, title, meta, source }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.list })

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-16), 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.97, 1],
        )})`,
        display: 'flex',
        alignItems: 'center',
        gap: px(14),
        padding: `${px(12)}px ${px(14)}px`,
        borderRadius: px(24),
        background: T.surface,
        boxShadow: T.shadowCard,
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: px(5),
            fontSize: px(12.5),
            fontWeight: 500,
            color: T.inkMuted,
            whiteSpace: 'nowrap',
          }}
        >
          {meta}
        </div>
        {source ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: px(6), marginTop: px(6) }}>
            {source}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/** The press-and-halo wrapper for the one thing in this act that is tapped. */
const TapTarget: React.FC<{ press: number; halo: number; children: React.ReactNode }> = ({
  press,
  halo,
  children,
}) => {
  const T = useT()
  return (
    <span
      style={{
        display: 'inline-flex',
        borderRadius: R.pill,
        transform: `scale(${1 - press * 0.08})`,
        boxShadow: halo > 0.001 ? `0 0 0 ${px(2.5 + halo * 5)}px ${T.accentSoft}` : undefined,
      }}
    >
      {children}
    </span>
  )
}

/** `Pill` carries only the two tones the app's list rows need; the warning tone
 *  belongs to this act alone, so it lives here rather than in the shared part. */
const CheckPill: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const T = useT()
  return (
    <span
      style={{
        flex: 'none',
        padding: `${px(4)}px ${px(10)}px`,
        borderRadius: R.pill,
        background: T.warningSoft,
        color: T.warning,
        fontSize: px(11),
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/**
 * The original, opened from the chip: the page as it was filed, the cited line
 * marked on it, and the matter's own words repeated underneath so the two can
 * be compared without leaving the screen.
 */
const SourceViewer: React.FC<{
  open: number
  frame: number
  s: (sec: number) => number
  fps: number
}> = ({ open, frame, s, fps }) => {
  const T = useT()
  const inset = interpolate(open, [0, 1], [px(60), 0])
  const radius = interpolate(open, [0, 1], [px(26), 0])
  const closePress = interpolate(
    frame,
    [s(BEAT.closeTap), s(BEAT.closeTap + 0.12), s(BEAT.close)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )

  return (
    <AbsoluteFill
      style={{
        top: inset,
        left: inset,
        right: inset,
        bottom: inset,
        borderRadius: radius,
        overflow: 'hidden',
        background: T.canvas,
        boxShadow: T.shadowElevated,
        opacity: open,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: px(12),
          padding: `${px(34)}px ${px(20)}px ${px(14)}px`,
        }}
      >
        <div
          style={{
            flex: 'none',
            width: px(34),
            height: px(34),
            borderRadius: R.pill,
            background: T.surfaceSunken,
            color: T.inkMuted,
            display: 'grid',
            placeItems: 'center',
            fontSize: px(14),
            fontWeight: 800,
            transform: `scale(${1 - closePress * 0.1})`,
          }}
        >
          ✕
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: px(15), fontWeight: 800, color: T.ink }}>policy.pdf</p>
          <p
            style={{
              margin: `${px(2)}px 0 0`,
              fontSize: px(11.5),
              fontWeight: 600,
              color: T.inkMuted,
            }}
          >
            Page 2 of 6
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: `0 ${px(20)}px` }}>
        <PolicyPage frame={frame} s={s} fps={fps} />
      </div>

      <div
        style={{
          margin: `${px(16)}px ${px(16)}px ${px(30)}px`,
          padding: `${px(13)}px ${px(15)}px`,
          borderRadius: px(20),
          background: T.surface,
          boxShadow: T.shadowCard,
        }}
      >
        <span
          style={{ fontSize: px(10), fontWeight: 800, letterSpacing: '0.1em', color: T.inkSubtle }}
        >
          WHAT KITTO READ
        </span>
        <div
          style={{
            marginTop: px(7),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: px(10),
          }}
        >
          <span style={{ fontSize: px(13.5), fontWeight: 800, color: T.ink, whiteSpace: 'nowrap' }}>
            Due 30 September · EGP 4,120
          </span>
          <CiteChip>📄 p.2</CiteChip>
        </div>
      </div>
    </AbsoluteFill>
  )
}

/** Page two of the policy, with the one line the matter was built from. */
const PolicyPage: React.FC<{ frame: number; s: (sec: number) => number; fps: number }> = ({
  frame,
  s,
  fps,
}) => {
  const T = useT()
  // The mark wipes in from the left like a highlighter rather than fading, so
  // it reads as someone pointing at the line and not as a decorative panel.
  const mark = spring({ frame: frame - s(BEAT.highlight), fps, config: SPRING.morph })

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: px(300),
        aspectRatio: '1 / 1.38',
        borderRadius: px(10),
        background: PAPER.sheet,
        padding: px(24),
        boxShadow: T.shadowElevated,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: px(10.5),
          fontWeight: 800,
          letterSpacing: '0.12em',
          color: PAPER.faint,
        }}
      >
        NILE INSURANCE
      </p>
      <p style={{ margin: `${px(9)}px 0 0`, fontSize: px(14), fontWeight: 800, color: PAPER.ink }}>
        Motor policy — schedule
      </p>

      <Rules widths={[94, 78]} top={16} />

      <div
        style={{
          position: 'relative',
          marginTop: px(20),
          marginLeft: px(-8),
          marginRight: px(-8),
          padding: `${px(7)}px ${px(8)}px`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: px(6),
            background: MARK,
            transformOrigin: 'left center',
            transform: `scaleX(${mark})`,
          }}
        />
        <PageLine label="Renewal date" value="30 September 2025" />
        <PageLine label="Annual premium" value="EGP 4,120" top={9} />
      </div>

      <Rules widths={[88, 96, 70]} top={20} />

      {/* Two more real fields, uncited, so the mark above reads as Kitto
          picking one line out of a page rather than as a decorated panel. */}
      <PageLine label="Policy number" value="MP-4417-2290" top={20} />
      <PageLine label="Vehicle" value="Hyundai Accent 2019" top={9} />

      <Rules widths={[92, 74, 84]} top={20} />

      <span
        style={{
          position: 'absolute',
          left: px(24),
          bottom: px(15),
          fontSize: px(9),
          fontWeight: 700,
          color: PAPER.faint,
        }}
      >
        2
      </span>
    </div>
  )
}

const PageLine: React.FC<{ label: string; value: string; top?: number }> = ({
  label,
  value,
  top = 0,
}) => (
  <div
    style={{
      position: 'relative',
      marginTop: px(top),
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: px(12),
    }}
  >
    <span style={{ fontSize: px(11), fontWeight: 700, color: PAPER.faint }}>{label}</span>
    <span style={{ fontSize: px(13), fontWeight: 800, color: PAPER.ink }}>{value}</span>
  </div>
)

/** The body copy of the page, which nobody needs to read. */
const Rules: React.FC<{ widths: number[]; top: number }> = ({ widths, top }) => (
  <>
    {widths.map((w, i) => (
      <div
        key={i}
        style={{
          marginTop: px(i === 0 ? top : 8),
          width: `${w}%`,
          height: px(5),
          borderRadius: px(3),
          background: PAPER.rule,
        }}
      />
    ))}
  </>
)
