import React from 'react'
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill, EmojiChip, CiteChip } from '../components/parts'
import { Stage } from '../components/Stage'
import { fadeIn } from './shared'

/**
 * DOCUMENTS — the paper is kept, and the nudge is answerable without the app.
 *
 * Two halves. The first is the vault: what was scanned, sorted by kind, each
 * document still holding the matters it produced and the page it came from.
 * The second is the whole reason any of this is a phone app rather than a
 * website — the reminder arrives on the lock screen and is finished there.
 */

/**
 * Every spring here is critically damped and settles in ~0.3s, so a card is
 * readable 0.3s after its beat. Each gap below is measured from THAT, not from
 * the beat: three seconds of dwell on the opened bill, three on the banner
 * before it is answered, three on what the answer said. The act closes inside
 * 14s, so the banner has finished leaving before the last frame.
 */
const BEAT = {
  header: 0.2,
  docs: [0.4, 0.8, 1.2],
  tapDoc: 2.8,
  openDoc: 3.05, // the bill opens in place: its matters and its original
  lock: 6.35, // 3.0s on the opened bill; the phone is put down
  banner: 6.65,
  tapDone: 10.05, // 3.1s to read the banner and both of its buttons
  done: 10.35,
  closing: 11.7, // the line lands under the answered banner, then outlives it
  dismiss: 13.65, // 3.0s on "Marked done" before the banner leaves
} as const

/** The list's rhythm, shared by the rows and by the box that grows between them. */
const GAP = 9

type Doc = { emoji: string; tint: string; title: string; kind: string; meta: string }

/** The kind chip is the sort key, so the title never has to repeat it. */
const DOCS: Doc[] = [
  {
    emoji: '🏠',
    tint: DOMAIN.home,
    title: 'City Electric',
    kind: 'Bill',
    meta: '2 matters · 12 June',
  },
  {
    emoji: '🚗',
    tint: DOMAIN.car,
    title: 'Motor policy',
    kind: 'Insurance',
    meta: '3 matters · 4 May',
  },
  {
    emoji: '🧸',
    tint: DOMAIN.family,
    title: 'School term dates',
    kind: 'Letter',
    meta: '1 matter · 9 June',
  },
]

/** What the bill turned into — the same matter the rest of the deck files. */
const MADE = [
  { title: 'Pay the electricity bill', meta: 'Due 20 June' },
  { title: 'Send the meter reading', meta: 'Due 28 June' },
]

/**
 * The lock screen belongs to the phone, not to Kitto: a wallpaper does not
 * follow the app's palette, and it is the same picture whichever theme the
 * app is in. So this is the one surface in the act that is not built from
 * tokens — the same exception `ScanAct` makes for the camera.
 */
const WALLPAPER = `radial-gradient(120% 70% at 50% 0%, rgb(38, 34, 48) 0%, transparent 60%),
                   radial-gradient(100% 60% at 50% 100%, rgb(38, 22, 24) 0%, transparent 62%),
                   linear-gradient(180deg, rgb(18, 17, 22) 0%, rgb(10, 10, 13) 100%)`
const LOCK_INK = 'rgba(255, 255, 255, 0.96)'
const LOCK_INK_DIM = 'rgba(255, 255, 255, 0.56)'
const LOCK_INK_FAINT = 'rgba(255, 255, 255, 0.4)'

/** Paper is photographed, not themed — the same stock `ScanAct` scans. */
const PAPER = 'rgb(252, 251, 249)'
const PAPER_LINE = 'rgb(230, 228, 224)'
const PAPER_INK = 'rgb(58, 56, 54)'

export const DocumentsAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const openDoc = spring({ frame: frame - s(BEAT.openDoc), fps, config: SPRING.morph })
  const press = interpolate(
    frame,
    [s(BEAT.tapDoc), s(BEAT.tapDoc + 0.12), s(BEAT.openDoc)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  const lock = spring({ frame: frame - s(BEAT.lock), fps, config: SPRING.morph })

  return (
    <Stage
      display={display}
      overlay={
        lock > 0.001 ? (
          <LockScreen open={lock} frame={frame} s={s} fps={fps} display={display} />
        ) : null
      }
    >
      <VaultHeader frame={frame} at={s(BEAT.header)} />

      <div style={{ marginTop: px(14), display: 'flex', flexDirection: 'column', gap: px(GAP) }}>
        {DOCS.map((doc, i) => (
          <React.Fragment key={doc.title}>
            <DocRow
              doc={doc}
              at={s(BEAT.docs[i])}
              press={i === 0 ? press : 0}
              opened={i === 0 ? openDoc : 0}
            />
            {/* The opened document expands under its own row, so the list it
                belongs to never leaves the screen. */}
            {i === 0 ? <OpenedDoc enter={openDoc} /> : null}
          </React.Fragment>
        ))}
      </div>
    </Stage>
  )
}

/** The vault's own header, with the feed's unread count where the app keeps it. */
const VaultHeader: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const T = useT()
  const shown = fadeIn(frame, at, 10)
  if (shown <= 0.001) return null

  return (
    <div
      style={{
        marginTop: px(20),
        opacity: shown,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: px(10),
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: T.inkSubtle,
          }}
        >
          YOUR DOCUMENTS
        </p>
        <p style={{ margin: `${px(4)}px 0 0`, fontSize: px(14), fontWeight: 600, color: T.inkMuted }}>
          Everything you scanned, by kind.
        </p>
      </div>

      <BellButton count={3} />
    </div>
  )
}

/** The feed lives behind the bell; the badge is how many entries are unread. */
const BellButton: React.FC<{ count: number }> = ({ count }) => {
  const T = useT()
  return (
    <div style={{ position: 'relative', flex: 'none' }}>
      <div
        style={{
          width: px(40),
          height: px(40),
          borderRadius: R.pill,
          background: T.surface,
          boxShadow: T.shadowCard,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width={px(20)} height={px(20)} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.2a5.2 5.2 0 0 0-5.2 5.2c0 3.9-1.4 5.3-1.9 5.9h14.2c-.5-.6-1.9-2-1.9-5.9A5.2 5.2 0 0 0 12 3.2Z"
            stroke={T.ink}
            strokeWidth={1.7}
            strokeLinejoin="round"
          />
          <path d="M10 17.2a2.1 2.1 0 0 0 4 0" stroke={T.ink} strokeWidth={1.7} strokeLinecap="round" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          top: px(-3),
          right: px(-3),
          minWidth: px(19),
          height: px(19),
          padding: `0 ${px(4)}px`,
          borderRadius: R.pill,
          background: T.accent,
          border: `${px(2)}px solid ${T.canvas}`,
          color: T.accentInk,
          fontSize: px(10.5),
          fontWeight: 800,
          display: 'grid',
          placeItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {count}
      </div>
    </div>
  )
}

const DocRow: React.FC<{ doc: Doc; at: number; press: number; opened: number }> = ({
  doc,
  at,
  press,
  opened,
}) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.list })

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [px(-14), 0])}px) scale(${
          1 - press * 0.02
        })`,
      }}
    >
      <TaskRow
        emoji={doc.emoji}
        tint={doc.tint}
        title={doc.title}
        meta={doc.meta}
        trailing={<Pill tone={opened > 0.5 ? 'accent' : 'quiet'}>{doc.kind}</Pill>}
        style={{ boxShadow: opened > 0.5 ? T.shadowElevated : T.shadowCard }}
      />
    </div>
  )
}

/** Fixed so the expansion can be clipped to a growing box rather than popping. */
const OPENED_H = 128

/**
 * An open document: the matters it created, and the scan itself sitting next
 * to them. The original is never a separate archive to go and find — it is
 * part of the record it produced.
 */
const OpenedDoc: React.FC<{ enter: number }> = ({ enter }) => {
  const T = useT()
  if (enter <= 0.001) return null

  return (
    // The list's own 9pt gap is already reserved the moment this mounts, so it
    // is paid back until the box has grown — otherwise the rows below drop 9pt
    // in one frame before the smooth push begins.
    <div
      style={{
        height: px(OPENED_H) * enter,
        marginTop: -px(GAP) * (1 - enter),
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: px(OPENED_H),
          boxSizing: 'border-box',
          opacity: enter,
          padding: `${px(14)}px ${px(15)}px`,
          borderRadius: px(24),
          background: T.surface,
          boxShadow: T.shadowCard,
          display: 'flex',
          gap: px(14),
        }}
      >
        <PageThumb />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: px(9),
            }}
          >
            <span
              style={{
                fontSize: px(10),
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: T.inkSubtle,
              }}
            >
              MADE 2 MATTERS
            </span>
            <CiteChip>📄 Original</CiteChip>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: px(9) }}>
            {MADE.map((m) => (
              <div key={m.title} style={{ display: 'flex', alignItems: 'center', gap: px(8) }}>
                <EmojiChip emoji="🏠" tint={DOMAIN.home} size={22} />
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: px(12.5),
                      lineHeight: 1.3,
                      fontWeight: 800,
                      color: T.ink,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {m.title}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: px(11),
                      lineHeight: 1.3,
                      fontWeight: 500,
                      color: T.inkMuted,
                    }}
                  >
                    {m.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The scan, small: recognisably the same page `ScanAct` photographed. The
 * paper stock is photographed rather than themed, but the lift under it is a
 * shadow cast inside an app card, so it comes from the palette like any other.
 */
const PageThumb: React.FC = () => {
  const T = useT()
  return (
  <div
    style={{
      flex: 'none',
      width: px(64),
      height: px(82),
      boxSizing: 'border-box',
      borderRadius: px(6),
      background: PAPER,
      padding: px(7),
      overflow: 'hidden',
      boxShadow: T.shadowCard,
    }}
  >
    <div style={{ fontSize: px(4.8), fontWeight: 800, letterSpacing: '0.06em', color: PAPER_INK }}>
      CITY ELECTRIC
    </div>
    {[92, 68, 80].map((w, i) => (
      <div
        key={i}
        style={{
          marginTop: px(i === 0 ? 7 : 4),
          width: `${w}%`,
          height: px(3),
          borderRadius: px(2),
          background: PAPER_LINE,
        }}
      />
    ))}
    <div
      style={{
        marginTop: px(9),
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: px(6),
        fontWeight: 800,
        color: PAPER_INK,
      }}
    >
      <span>Pay by</span>
      <span>20 Jun</span>
    </div>
    {[86, 60].map((w, i) => (
      <div
        key={i}
        style={{
          marginTop: px(i === 0 ? 9 : 4),
          width: `${w}%`,
          height: px(3),
          borderRadius: px(2),
          background: PAPER_LINE,
        }}
      />
    ))}
  </div>
  )
}

/**
 * The payoff. Everything above this line a website could have done; a banner
 * you can finish a matter from, without unlocking, is the part that needs to
 * be a phone.
 */
const LockScreen: React.FC<{
  open: number
  frame: number
  s: (sec: number) => number
  fps: number
  display: string
}> = ({ open, frame, s, fps, display }) => {
  const closing = fadeIn(frame, s(BEAT.closing), 12)

  // The wallpaper covers the app before any of the lock screen is drawn on it,
  // so the two never sit on top of each other half-lit. The same order
  // `VoiceIsland` uses: the surface arrives first, then its contents.
  const veil = interpolate(open, [0, 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const content = interpolate(open, [0.5, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        opacity: veil,
        background: WALLPAPER,
        transform: `scale(${interpolate(open, [0, 1], [1.05, 1])})`,
      }}
    >
      {content <= 0.001 ? null : (
      <AbsoluteFill style={{ opacity: content }}>
        <LockStatus />

        <div
          style={{
            position: 'absolute',
            top: px(92),
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: px(9),
          }}
        >
          <LockGlyph />
          <span
            style={{
              fontSize: px(13),
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: LOCK_INK_DIM,
            }}
          >
            THURSDAY, 12 JUNE
          </span>
          <span
            style={{
              fontFamily: display,
              fontSize: px(76),
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: LOCK_INK,
            }}
          >
            9:41
          </span>
        </div>

        <Banner frame={frame} s={s} fps={fps} />

        {closing > 0.001 ? (
          <p
            style={{
              position: 'absolute',
              left: px(40),
              right: px(40),
              bottom: px(120),
              margin: 0,
              opacity: closing,
              textAlign: 'center',
              fontFamily: display,
              fontSize: px(17),
              fontWeight: 500,
              letterSpacing: '-0.01em',
              // The closing line sits on the wallpaper, where the app's muted ink
              // has no contrast to trade on — so it borrows the lock screen's.
              color: LOCK_INK_DIM,
            }}
          >
            Answered without opening Kitto.
          </p>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: px(26),
            transform: 'translateX(-50%)',
            width: px(120),
            height: px(5),
            borderRadius: R.pill,
            background: LOCK_INK_FAINT,
          }}
        />
      </AbsoluteFill>
      )}
    </AbsoluteFill>
  )
}

/** iOS keeps the time in the middle of a lock screen, so only the right cluster. */
const LockStatus: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: px(16),
      right: px(28),
      display: 'flex',
      alignItems: 'flex-end',
      gap: px(6),
    }}
  >
    {[0.35, 0.6, 0.85, 1].map((h, i) => (
      <div
        key={i}
        style={{ width: px(3.5), height: px(11 * h), borderRadius: px(2), background: LOCK_INK }}
      />
    ))}
    <div
      style={{
        marginLeft: px(4),
        width: px(24),
        height: px(12),
        boxSizing: 'border-box',
        borderRadius: px(3),
        border: `${px(1.5)}px solid ${LOCK_INK}`,
        padding: px(1.5),
      }}
    >
      <div style={{ width: '75%', height: '100%', borderRadius: px(1), background: LOCK_INK }} />
    </div>
  </div>
)

const LockGlyph: React.FC = () => (
  <svg width={px(20)} height={px(20)} viewBox="0 0 24 24" fill="none">
    <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill={LOCK_INK_DIM} />
    <path
      d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
      stroke={LOCK_INK_DIM}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
)

/**
 * A real notification, with the two answers on the notification itself. The
 * point is that neither of them opens the app: the matter is closed, or moved,
 * from here.
 */
const ACTIONS_H = 46

const Banner: React.FC<{ frame: number; s: (sec: number) => number; fps: number }> = ({
  frame,
  s,
  fps,
}) => {
  const T = useT()
  const enter = spring({ frame: frame - s(BEAT.banner), fps, config: SPRING.morph })
  const exit = spring({ frame: frame - s(BEAT.dismiss), fps, config: SPRING.morph })
  const shown = Math.max(0, enter - exit)
  if (shown <= 0.001) return null

  const press = interpolate(
    frame,
    [s(BEAT.tapDone), s(BEAT.tapDone + 0.12), s(BEAT.done)],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  )
  // The banner does not vanish on tap — it says what it did, then leaves.
  const confirm = interpolate(frame, [s(BEAT.done), s(BEAT.done + 0.3)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const confirmed = confirm >= 0.5
  const pressed = frame >= s(BEAT.tapDone)

  return (
    <div
      style={{
        position: 'absolute',
        top: px(298),
        left: px(16),
        right: px(16),
        opacity: shown,
        transform: `translateY(${(1 - enter) * px(-70) - exit * px(110)}px)`,
        borderRadius: px(22),
        background: T.surfaceGlass,
        border: `${px(1)}px solid ${T.borderStrong}`,
        boxShadow: T.shadowElevated,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: `${px(13)}px ${px(15)}px ${px(14)}px` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: px(8), marginBottom: px(9) }}>
          <div
            style={{
              width: px(22),
              height: px(22),
              borderRadius: px(7),
              background: T.accent,
              display: 'grid',
              placeItems: 'center',
              fontSize: px(13),
              lineHeight: 1,
            }}
          >
            👻
          </div>
          <span
            style={{
              flex: 1,
              fontSize: px(10.5),
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: T.inkSubtle,
            }}
          >
            KITTO
          </span>
          <span style={{ fontSize: px(10.5), fontWeight: 700, color: T.inkSubtle }}>now</span>
        </div>

        {/* One body, swapped at the midpoint of its own dip — the notification
            is replaced in place, the way iOS replaces one. */}
        <div style={{ opacity: Math.abs(confirm * 2 - 1), display: 'flex', alignItems: 'center', gap: px(10) }}>
          {confirmed ? <CheckMark /> : null}
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: px(16),
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: T.ink,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {confirmed ? 'Marked done' : 'Pay the electricity bill'}
            </p>
            <p
              style={{
                margin: `${px(3)}px 0 0`,
                fontSize: px(13.5),
                fontWeight: 600,
                color: T.inkMuted,
              }}
            >
              {confirmed ? 'I will stop reminding you.' : 'Due today · City Electric'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: px(ACTIONS_H) * (1 - confirm), overflow: 'hidden', opacity: 1 - confirm }}>
        <div
          style={{
            height: px(ACTIONS_H),
            boxSizing: 'border-box',
            borderTop: `${px(1)}px solid ${T.borderHair}`,
            display: 'flex',
          }}
        >
          <Action label="Done" tone="primary" press={press} active={pressed} />
          <Action label="Later today" tone="quiet" press={0} active={false} />
        </div>
      </div>
    </div>
  )
}

const Action: React.FC<{
  label: string
  tone: 'primary' | 'quiet'
  press: number
  active: boolean
}> = ({ label, tone, press, active }) => {
  const T = useT()
  const primary = tone === 'primary'
  return (
    <div
      style={{
        flex: 1,
        display: 'grid',
        placeItems: 'center',
        borderLeft: primary ? undefined : `${px(1)}px solid ${T.borderHair}`,
        background: active ? T.accentSoft : 'transparent',
        transform: `scale(${1 - press * 0.04})`,
        fontSize: px(14.5),
        fontWeight: 800,
        color: primary ? T.accentPressed : T.inkMuted,
      }}
    >
      {label}
    </div>
  )
}

const CheckMark: React.FC = () => {
  const T = useT()
  return (
    <div
      style={{
        flex: 'none',
        width: px(24),
        height: px(24),
        borderRadius: R.pill,
        background: T.success,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <svg width={px(13)} height={px(13)} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12.5 10 17.5 19 7"
          stroke={T.accentInk}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
