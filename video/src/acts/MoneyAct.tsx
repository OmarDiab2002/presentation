import React from 'react'
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { EmojiChip } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'
import { fadeIn } from './shared'

/**
 * MONEY — what the admin costs, added up out of documents Kitto already read.
 *
 * The figure at the top is the hook, but the last two sentences are the act.
 * A total assembled by a machine is only worth something if it also says what
 * it could not see, so the page scrolls to the coverage line and stops there
 * rather than ending on the number.
 */

const BEAT = {
  head: 0.3, // controls, label and the figure's frame
  countFrom: 0.55,
  countTo: 2.0, // ~1.4s of counting: long enough to read as adding up
  delta: 2.2,
  tiles: [2.75, 2.95],
  trend: 3.8,
  areaTitle: 5.6,
  areas: [5.9, 6.25, 6.6],
  scroll: 7.2, // the page moves to its second half
  coverage: 9.9,
  currencies: 10.9,
  closing: 12.4,
} as const

/**
 * The page is taller than the screen, so it is built as a real scroll: fixed
 * section heights, one clipped viewport, one transform. Fixed heights are what
 * make the scroll target exact arithmetic instead of a measured guess — and
 * they keep a section that has not arrived yet from moving the ones below it.
 * All values are iOS points; the screen is 360 wide.
 */
const VIEWPORT = 510
const GAP = 22
const SECTION = { hero: 212, trend: 148, areas: 240, notes: 158 } as const
/** Lands the coverage note near the bottom of the viewport with a little air
 *  under it, which is where a thumb would have stopped. */
const SCROLL_TO = 338

/** Spending per month, oldest first. May is the figure the hero compares
 *  against, so the two are the same number in two places on purpose. */
const MONTHS = [
  { label: 'Jan', spent: 9200 },
  { label: 'Feb', spent: 14300 },
  { label: 'Mar', spent: 10600 },
  { label: 'Apr', spent: 12750 },
  { label: 'May', spent: 16050 },
  { label: 'Jun', spent: 17976 },
] as const

const THIS_MONTH = 17976
const LAST_MONTH = 16050
const DELTA = Math.round(((THIS_MONTH - LAST_MONTH) / LAST_MONTH) * 100)

/**
 * Only matters carry an area, so these deliberately do not add up to the
 * headline. Inventing an "Other" row to close the gap would be the exact lie
 * the coverage note at the bottom exists to prevent.
 */
const AREAS = [
  { emoji: '🏠', tint: DOMAIN.home, label: 'Home', spent: 7420, count: '5 matters' },
  { emoji: '🚗', tint: DOMAIN.car, label: 'Car', spent: 5180, count: '3 matters' },
  { emoji: '🩺', tint: DOMAIN.health, label: 'Health', spent: 2940, count: '4 matters' },
] as const

const egp = (n: number) => `EGP ${Math.round(n).toLocaleString('en-US')}`

export const MoneyAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const scrolled =
    spring({ frame: frame - s(BEAT.scroll), fps, config: SPRING.morph }) * SCROLL_TO

  return (
    <Stage display={display}>
      <div
        style={{
          marginTop: px(16),
          height: px(VIEWPORT),
          overflow: 'hidden',
          // The clip runs to the screen edges so a card's shadow has somewhere
          // to fall; the column inside keeps the app's 18pt gutter.
          marginLeft: px(-18),
          marginRight: px(-18),
          paddingLeft: px(18),
          paddingRight: px(18),
        }}
      >
        <div style={{ transform: `translateY(${-px(scrolled)}px)` }}>
          <Section height={SECTION.hero}>
            <Hero frame={frame} s={s} fps={fps} display={display} />
          </Section>
          <Section height={SECTION.trend}>
            <Trend frame={frame} s={s} fps={fps} display={display} />
          </Section>
          <Section height={SECTION.areas}>
            <Areas frame={frame} s={s} fps={fps} display={display} />
          </Section>
          <Section height={SECTION.notes}>
            <Notes frame={frame} s={s} display={display} />
          </Section>
        </div>
      </div>
    </Stage>
  )
}

const Section: React.FC<{ height: number; children: React.ReactNode }> = ({ height, children }) => (
  <div style={{ height: px(height), marginBottom: px(GAP) }}>{children}</div>
)

/** The figure the page exists to state, and the two obligations still open. */
const Hero: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
  display: string
}> = ({ frame, s, fps, display }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.head), fps, config: SPRING.morph })
  if (enter <= 0.001) return null

  // Eased rather than linear so the count slows into its final value instead of
  // stopping dead on a number the eye has not caught up with.
  const counted = interpolate(frame, [s(BEAT.countFrom), s(BEAT.countTo)], [0, THIS_MONTH], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div style={{ opacity: enter, transform: `translateY(${(1 - enter) * px(10)}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Segmented options={['3M', '6M', '12M']} active="6M" />
        <Segmented options={['EGP', 'USD']} active="EGP" />
      </div>

      <p
        style={{
          margin: `${px(12)}px 0 0`,
          fontSize: px(10),
          lineHeight: 1.2,
          fontWeight: 800,
          letterSpacing: '0.09em',
          color: T.inkMuted,
        }}
      >
        SPENT THIS MONTH
      </p>

      <p
        style={{
          margin: `${px(6)}px 0 0`,
          fontFamily: display,
          fontSize: px(44),
          lineHeight: 0.95,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: T.ink,
          // Without tabular figures every digit that ticks over shifts the
          // three to its right, and the whole number wobbles while it counts.
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {egp(counted)}
      </p>

      {frame >= s(BEAT.delta) ? (
        <p
          style={{
            margin: `${px(7)}px 0 0`,
            opacity: fadeIn(frame, s(BEAT.delta), 9),
            fontSize: px(13),
            lineHeight: 1.4,
            fontWeight: 500,
            color: T.inkMuted,
          }}
        >
          Up {DELTA}% on last month ({egp(LAST_MONTH)}).
        </p>
      ) : null}

      <div style={{ marginTop: px(14), display: 'flex', gap: px(12) }}>
        <Obligation
          amount={egp(2410)}
          label="OVERDUE"
          late
          at={s(BEAT.tiles[0])}
          frame={frame}
          fps={fps}
          display={display}
        />
        <Obligation
          amount={egp(6120)}
          label="STILL TO PAY"
          at={s(BEAT.tiles[1])}
          frame={frame}
          fps={fps}
          display={display}
        />
      </div>
    </div>
  )
}

/** Coral is kept for the figure that is actually late. Nothing overdue is not
 *  an alert, and a strip where every number shouts tells you nothing. */
const Obligation: React.FC<{
  amount: string
  label: string
  late?: boolean
  at: number
  frame: number
  fps: number
  display: string
}> = ({ amount, label, late = false, at, frame, fps, display }) => {
  const T = useT()
  if (frame < at) return null
  const enter = spring({ frame: frame - at, fps, config: SPRING.step })

  return (
    <div
      style={{
        flex: 1,
        opacity: enter,
        transform: `scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        padding: `${px(12)}px ${px(16)}px`,
        borderRadius: px(R['2xl']),
        background: late ? T.accentSoft : T.surfaceSunken,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: display,
          fontSize: px(22),
          lineHeight: 1,
          fontWeight: 500,
          color: late ? T.accentPressed : T.ink,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
        }}
      >
        {amount}
      </p>
      <p
        style={{
          margin: `${px(5)}px 0 0`,
          fontSize: px(10),
          lineHeight: 1.2,
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: T.inkMuted,
        }}
      >
        {label}
      </p>
    </div>
  )
}

/**
 * Six months as one shape. The bars are drawn at their final height and never
 * grow: a chart that animates on arrival makes the viewer watch the motion
 * instead of the trend, and the trend is the whole content of the picture.
 */
const Trend: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
  display: string
}> = ({ frame, s, fps, display }) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.trend), fps, config: SPRING.list })
  if (enter <= 0.001) return null

  const peak = Math.max(...MONTHS.map((m) => m.spent))

  return (
    <div style={{ opacity: enter, transform: `translateY(${(1 - enter) * px(14)}px)` }}>
      <Heading display={display}>Where it went</Heading>

      <div
        style={{
          marginTop: px(9),
          padding: px(13),
          borderRadius: px(R['2xl']),
          background: T.surface,
          boxShadow: T.shadowCard,
        }}
      >
        <div style={{ height: px(66), display: 'flex', alignItems: 'flex-end', gap: px(6) }}>
          {MONTHS.map((m) => (
            <div
              key={m.label}
              style={{
                flex: 1,
                height: px(66 * (m.spent / peak)),
                borderRadius: `${px(8)}px ${px(8)}px ${px(3)}px ${px(3)}px`,
                // The tallest bar is this month — the same number as the hero,
                // so the eye ties the picture to the figure above it.
                background: m.spent === peak ? T.accent : T.accentSoft,
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: px(7), display: 'flex', gap: px(6) }}>
          {MONTHS.map((m) => (
            <span
              key={m.label}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: px(10),
                lineHeight: 1.2,
                fontWeight: 500,
                color: T.inkMuted,
              }}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Which parts of a life the money went to, one row each. */
const Areas: React.FC<{
  frame: number
  s: (sec: number) => number
  fps: number
  display: string
}> = ({ frame, s, fps, display }) => {
  if (frame < s(BEAT.areaTitle)) return null
  const peak = Math.max(...AREAS.map((a) => a.spent))

  return (
    <div style={{ opacity: fadeIn(frame, s(BEAT.areaTitle), 9) }}>
      <Heading display={display}>By area</Heading>

      <div style={{ marginTop: px(9), display: 'flex', flexDirection: 'column', gap: px(8) }}>
        {AREAS.map((area, i) => (
          <AreaRow
            key={area.label}
            area={area}
            share={area.spent / peak}
            at={s(BEAT.areas[i])}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </div>
  )
}

const AreaRow: React.FC<{
  area: (typeof AREAS)[number]
  share: number
  at: number
  frame: number
  fps: number
}> = ({ area, share, at, frame, fps }) => {
  const T = useT()
  if (frame < at) return null
  const enter = spring({ frame: frame - at, fps, config: SPRING.list })

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-12), 0])}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: px(12),
        padding: `${px(10)}px ${px(14)}px`,
        borderRadius: px(R['2xl']),
        background: T.surface,
        boxShadow: T.shadowCard,
      }}
    >
      <EmojiChip emoji={area.emoji} tint={area.tint} size={34} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: px(13),
              lineHeight: 1.2,
              fontWeight: 700,
              color: T.ink,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {area.label}
          </span>
          <span
            style={{
              flex: 'none',
              fontSize: px(13),
              lineHeight: 1.2,
              fontWeight: 800,
              color: T.ink,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {egp(area.spent)}
          </span>
        </div>

        {/* Proportional to the largest row, not to the total — the comparison
            the eye actually makes here is row against row. */}
        <div
          style={{
            marginTop: px(6),
            height: px(5),
            borderRadius: R.pill,
            background: T.surfaceSunken,
            overflow: 'hidden',
          }}
        >
          <div
            style={{ width: `${share * 100}%`, height: '100%', borderRadius: R.pill, background: T.accent }}
          />
        </div>

        <p
          style={{
            margin: `${px(5)}px 0 0`,
            fontSize: px(10),
            lineHeight: 1.2,
            fontWeight: 500,
            color: T.inkMuted,
          }}
        >
          {area.count}
        </p>
      </div>
    </div>
  )
}

/**
 * The two things the page will not pretend about. Body copy under the totals,
 * not an icon or a tooltip — a caveat nobody opens is a caveat nobody was
 * given, so the scroll ends here and holds.
 */
const Notes: React.FC<{
  frame: number
  s: (sec: number) => number
  display: string
}> = ({ frame, s, display }) => {
  const T = useT()
  const note: React.CSSProperties = {
    fontSize: px(13),
    lineHeight: 1.45,
    fontWeight: 500,
    color: T.inkMuted,
  }

  return (
    <div>
      {frame >= s(BEAT.coverage) ? (
        <p style={{ ...note, margin: 0, opacity: fadeIn(frame, s(BEAT.coverage), 10) }}>
          Read from 8 of 12 documents. Anything paid outside Kitto is not counted.
        </p>
      ) : null}

      {frame >= s(BEAT.currencies) ? (
        <p
          style={{
            ...note,
            margin: `${px(8)}px 0 0`,
            opacity: fadeIn(frame, s(BEAT.currencies), 10),
          }}
        >
          Currencies stay separate. There is no exchange rate in the product, so a combined total
          could only be invented.
        </p>
      ) : null}

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Built from documents you already had.
      </Closing>
    </div>
  )
}

/** The serif section heading the money screen uses above each block. */
const Heading: React.FC<{ display: string; children: React.ReactNode }> = ({
  display,
  children,
}) => {
  const T = useT()
  return (
    <h2
      style={{
        margin: 0,
        fontFamily: display,
        fontSize: px(17),
        lineHeight: 1.2,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        color: T.ink,
      }}
    >
      {children}
    </h2>
  )
}

/** Sunken track, raised thumb — the app's own segmented control, static here
 *  because the point is only that the choice exists. */
const Segmented: React.FC<{ options: readonly string[]; active: string }> = ({
  options,
  active,
}) => {
  const T = useT()
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: px(4),
        borderRadius: R.pill,
        background: T.surfaceSunken,
      }}
    >
      {options.map((option) => {
        const on = option === active
        return (
          <span
            key={option}
            style={{
              padding: `${px(5)}px ${px(12)}px`,
              borderRadius: R.pill,
              background: on ? T.surface : 'transparent',
              boxShadow: on ? T.shadowCard : 'none',
              color: on ? T.ink : T.inkMuted,
              fontSize: px(12.5),
              lineHeight: 1.2,
              fontWeight: 800,
            }}
          >
            {option}
          </span>
        )
      })}
    </div>
  )
}
