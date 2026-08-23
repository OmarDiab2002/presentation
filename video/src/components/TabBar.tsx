import React from 'react'
import { useT, R, px } from '../theme'

/**
 * The floating stadium with five slots and the coral centre action, matching
 * `components/ui/TabBar.tsx`. The mic is the one place coral is a filled
 * circle, and it is where the voice island grows out of.
 */
export const TabBar: React.FC<{
  /** 0 = mic at rest, 1 = fully handed over to the island. */
  handover?: number
}> = ({ handover = 0 }) => {
  const T = useT()
  const slots = [
    { icon: '⌂', label: 'Home', active: true },
    { icon: '☰', label: 'Matters', active: false },
    null, // the centre action sits in this gap
    { icon: '▤', label: 'Docs', active: false },
    { icon: '☺', label: 'You', active: false },
  ]

  // The bar slides out of its slot so another surface can occupy it — the same
  // handover `components/ui/TabBar.tsx` performs when the voice island opens.
  return (
    <div
      style={{
        position: 'absolute',
        opacity: 1 - handover,
        transform: `translateY(${handover * px(70)}px)`,
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
            <span style={{ fontSize: px(20), color: slot.active ? T.ink : T.inkNav }}>
              {slot.icon}
            </span>
            <span
              style={{
                fontSize: px(10),
                fontWeight: 700,
                color: slot.active ? T.ink : T.inkNav,
              }}
            >
              {slot.label}
            </span>
          </div>
        ) : (
          // The mic keeps its footprint while the island is open, so the bar
          // never reflows underneath it — only the button itself fades.
          <div key={i} style={{ width: px(52), height: px(52) }} />
        ),
      )}
    </div>
  )
}

/** The coral mic, positioned so the island can morph out of its exact centre. */
export const MicButton: React.FC<{
  /** 0 = resting, 1 = pressed. */
  press?: number
  /** 0 = visible, 1 = handed over to the island. */
  handover?: number
}> = ({ press = 0, handover = 0 }) => {
  const T = useT()
  return (
    <div
    style={{
      position: 'absolute',
      left: '50%',
      bottom: px(40),
      transform: `translate(-50%, 0) scale(${(1 - press * 0.08) * (1 - handover)})`,
      width: px(52),
      height: px(52),
      borderRadius: R.pill,
      background: T.accent,
      boxShadow: T.shadowHalo,
      display: 'grid',
      placeItems: 'center',
      opacity: 1 - handover,
    }}
  >
      <MicGlyph size={px(22)} color={T.accentInk} />
    </div>
  )
}

export const MicGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
    <path
      d="M5 11a7 7 0 0 0 14 0"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M12 18v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)
