import React from 'react'

/**
 * The app's design tokens, ported 1:1 from `app/globals.css` — the `:root`
 * block for light, the `.dark` block for dark. The video is a picture OF the
 * product, so any value that drifts from these makes the demo look like a
 * mock-up rather than a recording.
 */
export type Tokens = {
  canvas: string
  surface: string
  surfaceSunken: string
  surfaceField: string
  /** The floating tab bar's translucent fill. */
  surfaceGlass: string
  borderHair: string
  borderStrong: string
  ink: string
  inkMuted: string
  inkSubtle: string
  inkNav: string
  accent: string
  accentPressed: string
  accentSoft: string
  accentInk: string
  solid: string
  solidInk: string
  warning: string
  warningSoft: string
  success: string
  /** The tint behind the phone's own bezel highlight. */
  bezel: string
  /** The two washes that keep the canvas from being flat. */
  veil: string
  domain: Record<'health' | 'home' | 'car' | 'finance' | 'family' | 'pets', string>
  shadowCard: string
  shadowElevated: string
  shadowHalo: string
}

/** The category pastels are theme-invariant, exactly as the app keeps them:
 *  a coloured circle carrying an emoji is the one place hue means "which part
 *  of your life", and dimming it in dark mode would throw that away. */
export const DOMAIN = {
  health: 'rgb(183, 199, 180)',
  home: 'rgb(245, 223, 200)',
  car: 'rgb(199, 210, 245)',
  finance: 'rgb(203, 217, 240)',
  family: 'rgb(251, 227, 230)',
  pets: 'rgb(201, 190, 243)',
} as const

export const LIGHT: Tokens = {
  canvas: 'rgb(249, 248, 252)',
  surface: 'rgb(255, 255, 255)',
  surfaceSunken: 'rgb(242, 241, 246)',
  surfaceField: 'rgb(234, 231, 225)',
  surfaceGlass: 'rgba(255, 255, 255, 0.9)',
  borderHair: 'rgb(236, 236, 236)',
  borderStrong: 'rgb(220, 218, 226)',
  ink: 'rgb(26, 24, 26)',
  inkMuted: 'rgb(138, 138, 142)',
  inkSubtle: 'rgb(184, 183, 191)',
  inkNav: 'rgb(155, 155, 160)',
  accent: 'rgb(250, 106, 90)',
  accentPressed: 'rgb(224, 84, 68)',
  accentSoft: 'rgb(255, 233, 228)',
  accentInk: 'rgb(255, 255, 255)',
  solid: 'rgb(28, 26, 23)',
  solidInk: 'rgb(255, 255, 255)',
  warning: 'rgb(217, 138, 43)',
  warningSoft: 'rgb(251, 238, 221)',
  success: 'rgb(52, 199, 89)',
  bezel: 'rgb(28, 26, 23)',
  veil: `radial-gradient(120% 90% at 88% 6%, rgba(250,106,90,0.055) 0%, transparent 55%),
         radial-gradient(100% 80% at 4% 96%, rgba(201,190,243,0.16) 0%, transparent 58%)`,
  domain: DOMAIN,
  shadowCard: '0 2px 8px rgba(20, 20, 40, 0.04), 0 1px 3px rgba(20, 20, 40, 0.03)',
  shadowElevated: '0 8px 28px rgba(20, 20, 40, 0.08), 0 2px 6px rgba(20, 20, 40, 0.05)',
  shadowHalo: '0 6px 20px rgba(0, 0, 0, 0.08)',
}

/**
 * Dark is near-true-black, not a dimmed light theme — the app is explicit
 * about that. Depth comes from surface lightness stepping rather than shadow,
 * so the shadows here are close to inert and the surfaces do the work.
 */
export const DARK: Tokens = {
  canvas: 'rgb(3, 3, 3)',
  surface: 'rgb(20, 20, 22)',
  surfaceSunken: 'rgb(24, 24, 26)',
  surfaceField: 'rgb(34, 34, 36)',
  surfaceGlass: 'rgba(28, 28, 31, 0.92)',
  borderHair: 'rgb(34, 34, 38)',
  borderStrong: 'rgb(52, 52, 56)',
  ink: 'rgb(245, 245, 247)',
  inkMuted: 'rgb(154, 154, 160)',
  inkSubtle: 'rgb(120, 120, 126)',
  inkNav: 'rgb(150, 150, 156)',
  accent: 'rgb(250, 106, 90)',
  accentPressed: 'rgb(240, 118, 104)',
  accentSoft: 'rgb(71, 42, 38)',
  accentInk: 'rgb(255, 255, 255)',
  solid: 'rgb(245, 245, 247)',
  solidInk: 'rgb(20, 20, 22)',
  warning: 'rgb(224, 158, 74)',
  warningSoft: 'rgb(58, 46, 22)',
  success: 'rgb(64, 208, 112)',
  bezel: 'rgb(38, 38, 42)',
  veil: `radial-gradient(120% 90% at 88% 6%, rgba(250,106,90,0.07) 0%, transparent 55%),
         radial-gradient(100% 80% at 4% 96%, rgba(201,190,243,0.06) 0%, transparent 58%)`,
  domain: DOMAIN,
  shadowCard: '0 2px 8px rgba(0, 0, 0, 0.5)',
  shadowElevated: '0 8px 28px rgba(0, 0, 0, 0.6), 0 2px 6px rgba(0, 0, 0, 0.4)',
  shadowHalo: '0 6px 20px rgba(0, 0, 0, 0.55)',
}

export type Mode = 'light' | 'dark'

const ThemeContext = React.createContext<Tokens>(LIGHT)

export const ThemeProvider: React.FC<{ mode: Mode; children: React.ReactNode }> = ({
  mode,
  children,
}) => React.createElement(ThemeContext.Provider, { value: mode === 'dark' ? DARK : LIGHT }, children)

/** Every visual component reads its palette from here, never from a literal. */
export const useT = () => React.useContext(ThemeContext)

/** Radii — nothing sharp: a pill or a large round. Theme-invariant. */
export const R = {
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  pill: 9999,
} as const

/**
 * The app's own spring physics, lifted from `lib/motion.ts`. Motion is
 * recognisable: a demo that springs differently from the real app reads as a
 * different product even when every colour matches.
 */
export const SPRING = {
  morph: { stiffness: 449.2, damping: 40.21, mass: 0.9 },
  list: { stiffness: 380, damping: 32.62, mass: 0.7 },
  step: { stiffness: 520, damping: 35.33, mass: 0.6 },
} as const

/** 9:19.5 — the handset ratio the deck's phone placeholder reserves. */
export const SIZE = { width: 1080, height: 2340 } as const

/** One design unit == one CSS pixel at 3x. Keeps the numbers app-shaped. */
export const px = (n: number) => n * 3
