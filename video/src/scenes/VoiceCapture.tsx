import React from 'react'
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces'
import { loadFont as loadNunito } from '@remotion/google-fonts/Nunito'

import { ThemeProvider, useT, type Mode } from '../theme'
import { TitleCard } from '../components/TitleCard'
import { CaptureAct } from '../acts/CaptureAct'
import { UncertaintyAct } from '../acts/UncertaintyAct'
import { ConflictAct } from '../acts/ConflictAct'
import { ScanAct } from '../acts/ScanAct'
import { ChatAct } from '../acts/ChatAct'
import { AreasAct } from '../acts/AreasAct'
import { RemindersAct } from '../acts/RemindersAct'
import { TrustAct } from '../acts/TrustAct'
import { HomeAct } from '../acts/HomeAct'
import { MattersAct } from '../acts/MattersAct'
import { MoneyAct } from '../acts/MoneyAct'
import { DocumentsAct } from '../acts/DocumentsAct'
import { ArabicAct } from '../acts/ArabicAct'

const { fontFamily: display } = loadFraunces('normal', { weights: ['500'], subsets: ['latin'] })
const { fontFamily: sans } = loadNunito('normal', {
  weights: ['500', '600', '700', '800'],
  subsets: ['latin'],
})

/**
 * Three cases in one reel, each introduced by name.
 *
 * One case only ever proves that capture works. What the product is FOR is
 * what it does with what it captured, and that takes more than one example —
 * so the reel also covers the two cases where a plain reminder app gives up.
 */
export const TITLE_FRAMES = 54
export const ACT_FRAMES = { capture: 450, uncertainty: 420, conflict: 420, scan: 450, chat: 420, areas: 450, reminders: 450, trust: 450, home: 420, matters: 450, money: 450, documents: 480, arabic: 360 } as const

const CARDS = [
  {
    title: 'One sentence,\nseveral matters.',
    sub: 'Say it the way you would say it to a person. Every phrase becomes its own matter, filed and dated.',
  },
  {
    title: 'When it is not sure,\nit asks.',
    sub: 'A bill with no date is where guessing gets expensive. So it files the matter at once and holds back only the reminder.',
  },
  {
    title: 'When two things\ncollide.',
    sub: 'The clash is found before anything is saved — and it comes with free times that suit the kind of matter.',
  },
] as const

const SEGMENTS = [
  { title: TITLE_FRAMES, act: ACT_FRAMES.capture },
  { title: TITLE_FRAMES, act: ACT_FRAMES.uncertainty },
  { title: TITLE_FRAMES, act: ACT_FRAMES.conflict },
]

export const TOTAL_FRAMES = SEGMENTS.reduce((n, seg) => n + seg.title + seg.act, 0)

/** How long one piece crossfades into the next. */
const SEAM = 12

export type ReelProps = { mode: Mode }

export const VoiceCapture: React.FC<ReelProps> = ({ mode }) => {
  const acts = [
    <CaptureAct display={display} />,
    <UncertaintyAct display={display} />,
    <ConflictAct display={display} />,
  ]

  let cursor = 0
  const pieces: React.ReactNode[] = []

  SEGMENTS.forEach((seg, i) => {
    const titleFrom = cursor
    const actFrom = cursor + seg.title
    const isLast = i === SEGMENTS.length - 1
    cursor = actFrom + seg.act

    pieces.push(
      <Sequence key={`t${i}`} from={titleFrom} durationInFrames={seg.title + SEAM}>
        <Seam length={seg.title}>
          <TitleCard
            index={i + 1}
            total={SEGMENTS.length}
            title={CARDS[i].title}
            sub={CARDS[i].sub}
            display={display}
          />
        </Seam>
      </Sequence>,
      <Sequence key={`a${i}`} from={actFrom} durationInFrames={seg.act + (isLast ? 0 : SEAM)}>
        <Seam length={seg.act} last={isLast}>
          {acts[i]}
        </Seam>
      </Sequence>,
    )
  })

  return (
    <ThemeProvider mode={mode}>
      <Canvas>{pieces}</Canvas>
    </ThemeProvider>
  )
}

/** The ground the whole reel sits on, in whichever palette is active. */
const Canvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const T = useT()
  return <AbsoluteFill style={{ fontFamily: sans, background: T.canvas }}>{children}</AbsoluteFill>
}

/**
 * Fades a piece out over its final frames so the next one is already
 * underneath. The last piece fades to the canvas instead — which is what the
 * first title card opens on, so the loop point is invisible.
 */
const Seam: React.FC<{ length: number; last?: boolean; children: React.ReactNode }> = ({
  length,
  last = false,
  children,
}) => {
  const T = useT()
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  if (last) {
    const cover = interpolate(frame, [length - fps * 0.6, length - 1], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
    return (
      <AbsoluteFill>
        {children}
        <AbsoluteFill style={{ background: T.canvas, opacity: cover }} />
      </AbsoluteFill>
    )
  }

  const out = interpolate(frame, [length - SEAM, length], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  return <AbsoluteFill style={{ opacity: out }}>{children}</AbsoluteFill>
}

/** The single acts, for the slides that show only one of them. */
export const UncertaintyOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <UncertaintyAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const ConflictOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <ConflictAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const ScanOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <ScanAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const ChatOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <ChatAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const AreasOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <AreasAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const RemindersOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <RemindersAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const TrustOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <TrustAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const HomeOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <HomeAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const MattersOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <MattersAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const MoneyOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <MoneyAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const DocumentsOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <DocumentsAct display={display} />
    </Canvas>
  </ThemeProvider>
)

export const ArabicOnly: React.FC<ReelProps> = ({ mode }) => (
  <ThemeProvider mode={mode}>
    <Canvas>
      <ArabicAct display={display} />
    </Canvas>
  </ThemeProvider>
)
