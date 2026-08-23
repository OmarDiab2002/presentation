import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { loadFont as loadCairo } from '@remotion/google-fonts/Cairo'
import { loadFont as loadNaskh } from '@remotion/google-fonts/NotoNaskhArabic'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { EmojiChip, Pill } from '../components/parts'
import { MicButton } from '../components/TabBar'
import { Stage } from '../components/Stage'
import { Row } from './CaptureAct'
import { fadeIn } from './shared'

/**
 * ARABIC — the same screen, not a translated one.
 *
 * The claim is easy to make and easy to fake, so the act is built to be checked
 * frame by frame: the two halves carry the same three matters, in the same
 * order, at the same heights, so the dissolve between them lands every row on
 * its own twin. What moves is the direction — chips cross to the right edge,
 * the tab bar reverses, the selected segment stays under the reader's thumb.
 *
 * Arabic gets its own faces rather than the Latin ones with the glyphs missing:
 * Cairo carries the interface where Nunito does, and a Naskh book face carries
 * the greeting where Fraunces does. A half-localised screen is exactly what
 * this act denies.
 */
const { fontFamily: arabicSans } = loadCairo('normal', {
  weights: ['500', '700', '800'],
  subsets: ['arabic', 'latin'],
})
// Amiri is the prettier Naskh and cannot be used: its required lam-kha ligature
// renders without the kha's dot, which turns الخير into a non-word — on the one
// screen in the deck that has to be beyond reproach.
const { fontFamily: arabicDisplay } = loadNaskh('normal', {
  weights: ['500'],
  subsets: ['arabic'],
})

/**
 * Nunito's normal line box — ascender 1011 plus descender 353 over a 1000 em.
 * The Arabic faces are far taller, so every mirrored line states its height in
 * these terms instead of taking the font's own. Left to Cairo, each row would
 * grow by a third and the two screens would slide past each other during the
 * dissolve rather than settle into one another.
 */
const LATIN_LINE = 1.364
/** Fraunces sits near this, and the greeting is the tallest line on the screen. */
const DISPLAY_LINE = 1.3

const BEAT = {
  // The list is the setup, not the point, so it settles inside a second.
  rows: [0.25, 0.5, 0.75],
  switch: 4.2,
  tapArabic: 7.4,
  select: 7.6, // the segment takes the tap, then the screen follows it
  flip: 8.0,
  closing: 10.0,
} as const

export const ArabicAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const switchIn = spring({ frame: frame - s(BEAT.switch), fps, config: SPRING.list })
  // A control inside a card moves on `step`, not on the surface springs.
  const thumb = spring({ frame: frame - s(BEAT.select), fps, config: SPRING.step })
  const press = interpolate(
    frame,
    [s(BEAT.tapArabic), s(BEAT.tapArabic + 0.12), s(BEAT.select)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const flip = spring({ frame: frame - s(BEAT.flip), fps, config: SPRING.morph })

  return (
    <Stage
      display={display}
      overlay={flip > 0.001 ? <ArabicScreen flip={flip} frame={frame} s={s} /> : null}
    >
      {/* Clears ahead of the mirror arriving; two sets of words at half strength
          would read as a fade rather than as one screen turning around. */}
      <div style={{ opacity: Math.max(0, 1 - flip * 1.6) }}>
        <div style={{ marginTop: px(20), display: 'flex', flexDirection: 'column', gap: px(9) }}>
          {ENGLISH.map((matter, i) => (
            <Row key={matter.title} matter={matter} at={s(BEAT.rows[i])} />
          ))}
        </div>

        {frame >= s(BEAT.switch) ? (
          <div
            style={{
              marginTop: px(12),
              opacity: switchIn,
              transform: `translateY(${interpolate(switchIn, [0, 1], [px(-14), 0])}px)`,
            }}
          >
            <LanguageSwitch segments={['English', 'العربية']} thumb={thumb} press={press} />
          </div>
        ) : null}
      </div>
    </Stage>
  )
}

type Matter = React.ComponentProps<typeof Row>['matter']
type MirrorMatter = Omit<Matter, 'trailing'> & { pill: React.ReactNode }

/**
 * The two lists are one list said twice. Same matters, same order, same chips,
 * same trailing states — so the dissolve has something to dissolve INTO, and a
 * viewer who cannot read a word of Arabic can still follow every row across.
 */
const ENGLISH: Matter[] = [
  {
    emoji: '🌱',
    tint: DOMAIN.health,
    title: 'Dentist appointment',
    meta: 'Thursday, 3:00 PM',
    trailing: 'reminder',
  },
  {
    emoji: '🏠',
    tint: DOMAIN.home,
    title: 'Pay the electricity bill',
    meta: 'Due 20 June',
    trailing: 'reminder',
  },
  { emoji: '🏠', tint: DOMAIN.home, title: 'Buy bread', meta: 'On your list', trailing: 'nodate' },
]

const ARABIC: MirrorMatter[] = [
  {
    emoji: '🌱',
    tint: DOMAIN.health,
    title: 'موعد طبيب الأسنان',
    meta: 'الخميس، ٣:٠٠ م',
    pill: <Pill tone="accent">تذكير</Pill>,
  },
  {
    emoji: '🏠',
    tint: DOMAIN.home,
    title: 'دفع فاتورة الكهرباء',
    meta: 'تُستحق ٢٠ يونيو',
    pill: <Pill tone="accent">تذكير</Pill>,
  },
  {
    emoji: '🏠',
    tint: DOMAIN.home,
    title: 'شراء الخبز',
    meta: 'على قائمتك',
    pill: <Pill>بلا تاريخ</Pill>,
  },
]

/**
 * The whole phone, rebuilt right-to-left rather than reflected.
 *
 * `dir` does the honest work — the flex rows, the text alignment and the tab
 * order all invert because the document says the language runs that way, which
 * is the difference between a layout that mirrors and one that has been dragged
 * across. It paints its own canvas, so as it fades up it takes the English
 * screen with it.
 */
const ArabicScreen: React.FC<{ flip: number; frame: number; s: (sec: number) => number }> = ({
  flip,
  frame,
  s,
}) => {
  const T = useT()
  const closing = fadeIn(frame, s(BEAT.closing), 12)

  return (
    <AbsoluteFill dir="rtl" style={{ opacity: flip, fontFamily: arabicSans, background: T.canvas }}>
      <AbsoluteFill style={{ backgroundImage: T.veil }} />

      <MirrorStatusBar />

      <div style={{ padding: `${px(6)}px ${px(18)}px 0` }}>
        {/* The English eyebrow is tracked upper case. Arabic has no case, and
            its letters join — the same treatment would pull the word apart. So
            the rule changes and the size, weight and colour do not. */}
        <p
          style={{
            margin: 0,
            fontSize: px(11.5),
            lineHeight: LATIN_LINE,
            fontWeight: 800,
            color: T.inkSubtle,
          }}
        >
          الخميس، ١٢ يونيو
        </p>
        <h1
          style={{
            margin: `${px(5)}px 0 0`,
            fontFamily: arabicDisplay,
            fontSize: px(28),
            lineHeight: DISPLAY_LINE,
            fontWeight: 500,
            color: T.ink,
          }}
        >
          صباح الخير يا مينا.
        </h1>

        <div style={{ marginTop: px(20), display: 'flex', flexDirection: 'column', gap: px(9) }}>
          {ARABIC.map((matter) => (
            <MirrorRow key={matter.title} {...matter} />
          ))}
        </div>

        <div style={{ marginTop: px(12) }}>
          {/* Arabic is listed first because the reader starts at the right, and
              that is also where the thumb was left standing a moment ago. */}
          <LanguageSwitch segments={['العربية', 'English']} thumb={0} press={0} rtl />
        </div>

        {closing > 0.001 ? (
          <p
            style={{
              margin: `${px(18)}px 0 0`,
              opacity: closing,
              fontFamily: arabicDisplay,
              fontSize: px(17),
              lineHeight: 1.5,
              fontWeight: 500,
              color: T.inkMuted,
            }}
          >
            كل شيء في مكانه.
          </p>
        ) : null}
      </div>

      <MirrorTabBar />
      <MicButton />
    </AbsoluteFill>
  )
}

/**
 * `TaskRow` in every measurement, minus the two things that are wrong in
 * Arabic: the negative tracking, which closes up letters that are meant to
 * join, and the font's own line height, which would make this row taller than
 * the English one it has to land on.
 */
const MirrorRow: React.FC<MirrorMatter> = ({ emoji, tint, title, meta, pill }) => {
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
      }}
    >
      <EmojiChip emoji={emoji} tint={tint} size={40} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1, gap: px(1) }}>
        <span
          style={{
            fontSize: px(15),
            lineHeight: LATIN_LINE,
            fontWeight: 800,
            color: T.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: px(12.5),
            lineHeight: LATIN_LINE,
            fontWeight: 500,
            color: T.inkMuted,
            whiteSpace: 'nowrap',
          }}
        >
          {meta}
        </span>
      </div>
      {pill}
    </div>
  )
}

/**
 * The control that does the switching, drawn once and used by both screens.
 *
 * Everything is expressed from the reading edge rather than from the left, so
 * the same component gives a thumb that travels rightwards under English and
 * one that already sits at the right under Arabic — the reason the switch never
 * appears to jump across the dissolve.
 */
const LanguageSwitch: React.FC<{
  /** In reading order: the first one sits at the edge the language starts from. */
  segments: readonly [string, string]
  /** How far the thumb has travelled from that edge, 0..1. */
  thumb: number
  press: number
  rtl?: boolean
}> = ({ segments, thumb, press, rtl = false }) => {
  const T = useT()
  const anchor: React.CSSProperties = rtl ? { right: 0 } : { left: 0 }
  const shift = (rtl ? -thumb : thumb) * 100
  const active = thumb < 0.5 ? 0 : 1

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
      }}
    >
      <EmojiChip emoji="🌐" tint={T.accentSoft} size={40} />
      <div
        style={{
          flex: 1,
          padding: px(5),
          borderRadius: R.pill,
          background: T.surfaceSunken,
          transform: `scale(${1 - press * 0.02})`,
        }}
      >
        <div style={{ position: 'relative', display: 'flex' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              ...anchor,
              width: '50%',
              transform: `translateX(${shift}%)`,
              borderRadius: R.pill,
              background: T.surface,
              boxShadow: T.shadowCard,
            }}
          />
          {segments.map((label, i) => (
            <span
              key={label}
              style={{
                position: 'relative',
                flex: 1,
                padding: `${px(7)}px 0`,
                textAlign: 'center',
                fontSize: px(13),
                lineHeight: LATIN_LINE,
                fontWeight: 800,
                color: i === active ? T.ink : T.inkMuted,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * iOS turns the status bar around with the rest of the phone, and the clock
 * changes numerals with the language. Leaving 9:41 on the left is the single
 * detail that would give the screen away as an English one wearing Arabic.
 */
const MirrorStatusBar: React.FC = () => {
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
      <span style={{ lineHeight: LATIN_LINE }}>٩:٤١</span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: px(6) }}>
        {[0.35, 0.6, 0.85, 1].map((h, i) => (
          <div
            key={i}
            style={{ width: px(3.5), height: px(11 * h), borderRadius: px(2), background: T.ink }}
          />
        ))}
        <div
          style={{
            marginInlineStart: px(4),
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
 * The same five slots at the same measurements. Only the order reverses, and it
 * does so because of `dir` rather than because the array was rewritten — which
 * is why the mic keeps the exact centre it holds on the English bar and the
 * dissolve leaves it untouched.
 */
const MirrorTabBar: React.FC = () => {
  const T = useT()
  const slots = [
    { icon: '⌂', label: 'الرئيسية', active: true },
    { icon: '☰', label: 'الأمور', active: false },
    null,
    { icon: '▤', label: 'المستندات', active: false },
    { icon: '☺', label: 'أنت', active: false },
  ]

  return (
    <div
      style={{
        position: 'absolute',
        left: px(20),
        right: px(20),
        bottom: px(28),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: px(8),
        borderRadius: R.pill,
        background: T.surfaceGlass,
        boxShadow: T.shadowElevated,
      }}
    >
      {slots.map((slot, i) =>
        slot ? (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: px(2),
              width: px(64),
              padding: `${px(6)}px 0`,
            }}
          >
            <span
              style={{
                fontSize: px(20),
                lineHeight: LATIN_LINE,
                color: slot.active ? T.ink : T.inkNav,
              }}
            >
              {slot.icon}
            </span>
            <span
              style={{
                fontSize: px(10),
                lineHeight: LATIN_LINE,
                fontWeight: 700,
                color: slot.active ? T.ink : T.inkNav,
              }}
            >
              {slot.label}
            </span>
          </div>
        ) : (
          <div key={i} style={{ width: px(52), height: px(52) }} />
        ),
      )}
    </div>
  )
}
