import React from 'react'
import {
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { EmojiChip } from '../components/parts'
import { Stage } from '../components/Stage'
import { Closing } from './CaptureAct'
import { fadeIn } from './shared'

/**
 * AREAS — six places, chosen for you, except where you already chose.
 *
 * The act carries two claims that pull against each other: Kitto files every
 * new matter on its own, and Kitto will not re-file what YOU filed without
 * being asked. So the list opens holding two matters the user placed by hand,
 * both a little wrong, and the clean-up at the end points at exactly those
 * two. Their chips do not change on the frame the card appears — they change
 * on the frame Apply is pressed. That gap is the whole point of the second
 * half, so nothing else moves inside it.
 */

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

type AreaKey = keyof typeof DOMAIN

/** The six, in the order the product lists them. Tints come from `DOMAIN`. */
const AREA: Record<AreaKey, { emoji: string; label: string }> = {
  health: { emoji: '🌱', label: 'Health' },
  home: { emoji: '🏠', label: 'Home' },
  car: { emoji: '🚗', label: 'Car' },
  finance: { emoji: '💰', label: 'Finance' },
  family: { emoji: '👪', label: 'Family' },
  pets: { emoji: '🐶', label: 'Pets' },
}

const ORDER: AreaKey[] = ['health', 'home', 'car', 'finance', 'family', 'pets']

const BEAT = {
  legend: 0.2, // the six, before anything is filed into them
  standing: 0.3, // the two already on the list, filed by hand
  arrive: [
    { row: 2.3, file: 3.0 },
    { row: 4.3, file: 5.0 },
  ],
  fold: 6.45, // the strip has done its work and gives back its room
  offer: 6.9,
  // Three and a half seconds on the proposal: two changes, four chips and two
  // buttons all have to be read before a finger touches anything.
  tapApply: 10.4,
  applied: 10.85,
  move: [10.95, 11.25], // the rows follow the approval, one after the other
  closing: 12.5,
} as const

type Matter = {
  title: string
  area: AreaKey
  meta: string
  /** When the matter lands, and when Kitto's choice of area lands on it.
   *  Absent for the two that were on the list before the act opened. */
  at?: { row: number; file: number }
  /** Only the matters the clean-up asks about. */
  move?: { into: AreaKey; meta: string; at: number }
}

const FILING = 'Filing…'

const MATTERS: Matter[] = [
  {
    title: 'Winter tyre swap',
    area: 'home',
    meta: 'You filed this · Home',
    move: { into: 'car', meta: 'Now in Car', at: BEAT.move[0] },
  },
  {
    title: 'Vet check for Miso',
    area: 'family',
    meta: 'You filed this · Family',
    move: { into: 'pets', meta: 'Now in Pets', at: BEAT.move[1] },
  },
  {
    title: 'Repeat prescription',
    area: 'health',
    meta: 'Health · Thursday',
    at: BEAT.arrive[0],
  },
  {
    title: 'Insurance renewal',
    area: 'finance',
    meta: 'Finance · 30 June',
    at: BEAT.arrive[1],
  },
]

const CHANGES = MATTERS.filter((m): m is Matter & { move: NonNullable<Matter['move']> } =>
  Boolean(m.move),
)

export const AreasAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const fold = spring({ frame: frame - s(BEAT.fold), fps, config: SPRING.morph })

  // While the proposal is up, the two matters it names are the only ones that
  // matter. The rest step back rather than leave, so the list stays whole.
  const focus = interpolate(
    frame,
    [s(BEAT.offer), s(BEAT.offer + 0.4), s(BEAT.move[1]), s(BEAT.move[1] + 0.6)],
    [0, 1, 1, 0],
    CLAMP,
  )

  return (
    <Stage display={display}>
      <Legend fold={fold} />

      <div style={{ marginTop: px(14), display: 'flex', flexDirection: 'column', gap: px(8) }}>
        {MATTERS.map((matter) => (
          <Row key={matter.title} matter={matter} focus={focus} />
        ))}
      </div>

      <CleanUp />

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Nothing moved until you said so.
      </Closing>
    </Stage>
  )
}

/**
 * The vocabulary, stated once before it is used. It folds away rather than
 * fading in place: the clean-up card needs the room, and by then every chip
 * below has already taught the same mapping.
 */
const LEGEND_H = 82

const Legend: React.FC<{ fold: number }> = ({ fold }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const open = clamp01(1 - fold)
  if (open <= 0.001) return null

  return (
    // The strip rolls up under the greeting rather than being cropped in
    // place: the contents travel with the shrinking box, so no line is ever
    // left sitting half-cut.
    <div style={{ height: px(LEGEND_H) * open, overflow: 'hidden' }}>
      <div
        style={{
          opacity: open * open,
          transform: `translateY(${-(1 - open) * px(LEGEND_H)}px)`,
        }}
      >
        <p
          style={{
            margin: `${px(16)}px 0 0`,
            fontSize: px(10),
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: T.inkSubtle,
            opacity: fadeIn(frame, s(BEAT.legend), 8),
          }}
        >
          SIX AREAS · KITTO FILES FOR YOU
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: px(7) }}>
          {ORDER.map((key, i) => {
            const enter = spring({
              frame: frame - s(BEAT.legend + i * 0.06),
              fps,
              config: SPRING.list,
            })
            // The area a matter just landed in flares, so the row below and the
            // chip up here read as the same event rather than two.
            const filedAt = MATTERS.find((m) => m.area === key && m.at)?.at?.file
            const flare =
              filedAt === undefined
                ? 0
                : interpolate(
                    frame,
                    [s(filedAt), s(filedAt) + 3, s(filedAt) + 16],
                    [0, 1, 0],
                    CLAMP,
                  )

            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: px(5),
                  opacity: clamp01(enter),
                  transform: `scale(${0.9 + clamp01(enter) * 0.1})`,
                }}
              >
                {/* The flare scales the chip on its own, never the column. The
                    strip is clipped to its own box so it can roll up, and the
                    leftmost column sits flush against that edge — scaling the
                    column sliced the H off "Health" at the peak of its flare. */}
                <div style={{ transform: `scale(${1 + flare * 0.16})` }}>
                  <EmojiChip emoji={AREA[key].emoji} tint={DOMAIN[key]} size={26} />
                </div>
                <span
                  style={{
                    fontSize: px(10),
                    fontWeight: 800,
                    color: interpolateColors(flare, [0, 1], [T.inkSubtle, T.ink]),
                  }}
                >
                  {AREA[key].label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * A list row with the geometry of `components/parts.tsx`'s `TaskRow`, rebuilt
 * here only because its chip has to be animated: `TaskRow` takes an emoji and
 * a tint as strings, and this act needs the chip to arrive on a row that is
 * already there, and later to cross-fade into a different area.
 */
const Row: React.FC<{ matter: Matter; focus: number }> = ({ matter, focus }) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const arriving = matter.at
  if (arriving && frame < s(arriving.row)) return null

  // A matter the user filed by hand was there before the act started, so it
  // settles in rather than springing in like something newly captured.
  const enter = arriving
    ? clamp01(spring({ frame: frame - s(arriving.row), fps, config: SPRING.list }))
    : fadeIn(frame, s(BEAT.standing), 8)

  const filed = arriving
    ? clamp01(spring({ frame: frame - s(arriving.file), fps, config: SPRING.step }))
    : 1

  const move = matter.move
  const moved = move
    ? clamp01(spring({ frame: frame - s(move.at), fps, config: SPRING.step }))
    : 0

  const meta = move && moved > 0.5 ? move.meta : filed > 0.5 ? matter.meta : FILING
  const dim = move ? 0 : focus * 0.55

  return (
    <div
      style={{
        opacity: enter * (1 - dim),
        transform: arriving
          ? `translateY(${interpolate(enter, [0, 1], [px(-16), 0])}px) scale(${interpolate(
              enter,
              [0, 1],
              [0.97, 1],
            )})`
          : undefined,
        display: 'flex',
        alignItems: 'center',
        gap: px(14),
        padding: `${px(12)}px ${px(14)}px`,
        borderRadius: px(24),
        background: T.surface,
        boxShadow: T.shadowCard,
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: 'none',
          width: px(40),
          height: px(40),
          // A short swell as a chip resolves, so filing reads as an event and
          // not as a colour quietly changing.
          transform: `scale(${1 + Math.max(swell(filed), swell(moved))})`,
        }}
      >
        <Layer opacity={1 - filed}>
          <EmojiChip emoji="" tint={T.surfaceSunken} size={40} />
        </Layer>
        <Layer opacity={filed * (1 - moved)}>
          <EmojiChip emoji={AREA[matter.area].emoji} tint={DOMAIN[matter.area]} size={40} />
        </Layer>
        {move ? (
          <Layer opacity={moved}>
            <EmojiChip emoji={AREA[move.into].emoji} tint={DOMAIN[move.into]} size={40} />
          </Layer>
        ) : null}
      </div>

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
          {matter.title}
        </span>
        <span
          style={{ fontSize: px(12.5), fontWeight: 500, color: T.inkMuted, whiteSpace: 'nowrap' }}
        >
          {meta}
        </span>
      </div>
    </div>
  )
}

/** Peaks halfway through a 0..1 progress and is zero at both ends. */
const swell = (p: number) => Math.max(0, p * (1 - p)) * 0.5

const Layer: React.FC<{ opacity: number; children: React.ReactNode }> = ({ opacity, children }) => (
  <div style={{ position: 'absolute', inset: 0, opacity: clamp01(opacity) }}>{children}</div>
)

/**
 * The bulk clean-up, as a proposal.
 *
 * Every change is spelled out before it happens — the matter, the area it is
 * in, the area it would go to — and there is a way to say no next to the way
 * to say yes. The card stays after Apply instead of dismissing itself, because
 * a record of what was changed is the other half of asking first.
 */
const CleanUp: React.FC = () => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const enter = spring({ frame: frame - s(BEAT.offer), fps, config: SPRING.morph })
  if (enter <= 0.001) return null

  const shown = clamp01(enter)
  const applied = frame >= s(BEAT.applied)
  const press = interpolate(
    frame,
    [s(BEAT.tapApply), s(BEAT.tapApply + 0.12), s(BEAT.applied)],
    [0, 1, 0],
    CLAMP,
  )
  // The card swaps its whole body the instant Apply lands. A single settle
  // through that frame ties the new wording to the press that caused it,
  // rather than letting three lines change on their own.
  const settle = swell(
    clamp01(spring({ frame: frame - s(BEAT.applied), fps, config: SPRING.step })),
  )

  return (
    <div
      style={{
        marginTop: px(12),
        opacity: shown,
        transform: `translateY(${(1 - shown) * px(16)}px) scale(${1 + settle * 0.12})`,
        padding: `${px(13)}px ${px(15)}px ${px(14)}px`,
        borderRadius: px(22),
        background: T.surface,
        boxShadow: T.shadowElevated,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: px(8), marginBottom: px(9) }}>
        <span style={{ fontSize: px(13) }}>👻</span>
        <span
          style={{
            fontSize: px(10),
            fontWeight: 800,
            letterSpacing: '0.1em',
            color: applied ? T.success : T.inkSubtle,
          }}
        >
          {applied ? 'MOVED · 2 CHANGES' : 'CLEAN-UP · YOUR CALL'}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: px(15), lineHeight: 1.35, fontWeight: 700, color: T.ink }}>
        {applied ? 'Moved, because you said so.' : 'Two of your own look mis-filed.'}
      </p>

      <div
        style={{ marginTop: px(11), display: 'flex', flexDirection: 'column', gap: px(6) }}
      >
        {CHANGES.map((change) => (
          <div
            key={change.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: px(10),
              padding: `${px(6)}px ${px(10)}px`,
              borderRadius: px(16),
              background: T.surfaceSunken,
            }}
          >
            <span
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: px(13),
                fontWeight: 700,
                color: T.ink,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {change.title}
            </span>
            {/* The area it is leaving stays visible after the move: the change
                is a record, not just a new value. */}
            <div style={{ opacity: applied ? 0.35 : 1 }}>
              <EmojiChip emoji={AREA[change.area].emoji} tint={DOMAIN[change.area]} size={22} />
            </div>
            <span style={{ fontSize: px(12), fontWeight: 800, color: T.inkSubtle }}>→</span>
            <EmojiChip
              emoji={AREA[change.move.into].emoji}
              tint={DOMAIN[change.move.into]}
              size={22}
            />
          </div>
        ))}
      </div>

      {applied ? (
        <div
          style={{
            marginTop: px(12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* The scope of what happened, stated as plainly as the offer was.
              A clean-up that quietly did a seventh thing would undo the point
              of asking about the six. */}
          <span style={{ fontSize: px(13), fontWeight: 600, color: T.inkMuted }}>
            Only these two.
          </span>
          <Button quiet>Undo</Button>
        </div>
      ) : (
        <div style={{ marginTop: px(12), display: 'flex', gap: px(8) }}>
          <div style={{ flex: 1, transform: `scale(${1 - press * 0.05})` }}>
            <Button grow>Apply both</Button>
          </div>
          <Button quiet>Not now</Button>
        </div>
      )}
    </div>
  )
}

const Button: React.FC<{ children: React.ReactNode; quiet?: boolean; grow?: boolean }> = ({
  children,
  quiet = false,
  grow = false,
}) => {
  const T = useT()
  return (
    <div
      style={{
        padding: `${px(9)}px ${px(16)}px`,
        borderRadius: R.pill,
        textAlign: 'center',
        background: quiet ? T.surfaceSunken : T.solid,
        color: quiet ? T.inkMuted : T.solidInk,
        fontSize: px(13),
        fontWeight: 800,
        width: grow ? '100%' : undefined,
      }}
    >
      {children}
    </div>
  )
}
