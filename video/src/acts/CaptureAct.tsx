import React from 'react'
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

import { useT, DOMAIN, SPRING, R, px } from '../theme'
import { TaskRow, Pill } from '../components/parts'
import { Stage, QuoteCard } from '../components/Stage'
import { VoiceIsland } from '../components/VoiceIsland'
import { useSpeakBeat, markAt, fadeIn } from './shared'

/**
 * ACT ONE — one sentence becomes several matters.
 *
 * The phrases stay marked in the quote above the list, so the viewer can see
 * which words produced which row rather than watching cards appear from
 * nowhere. The third phrase has no date and never gets a reminder: that is the
 * claim the slide makes, shown rather than asserted.
 */
const PHRASES = [
  { text: 'Dentist Thursday at three', tail: ', ' },
  { text: 'bring the referral letter', tail: ', and ' },
  { text: 'buy bread', tail: '.' },
] as const

const SPOKEN = PHRASES.map((p) => p.text + p.tail).join('')

const BEAT = {
  tap: 0.8,
  open: 1.05,
  speakFrom: 1.7,
  speakTo: 6.2, // the sentence has to be readable, not just seen
  savePress: 6.9,
  close: 7.15,
  quote: 7.6,
  // A beat between each phrase lighting up and its row landing, and a longer
  // one between rows — this is the moment the whole video exists to show.
  derive: [
    { mark: 8.4, row: 8.75 },
    { mark: 10.0, row: 10.35 },
    { mark: 11.6, row: 11.95 },
  ],
  closing: 13.2,
} as const

export const CaptureAct: React.FC<{ display: string }> = ({ display }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = (sec: number) => sec * fps

  const beat = useSpeakBeat(frame, fps, BEAT)
  const quote = spring({ frame: frame - s(BEAT.quote), fps, config: SPRING.morph })

  const phrases = PHRASES.map((p, i) => ({ ...p, mark: markAt(frame, s(BEAT.derive[i].mark)) }))

  return (
    <Stage
      display={display}
      handover={beat.open}
      micPress={beat.micPress}
      overlay={
        beat.open > 0.001 ? (
          <VoiceIsland
            open={beat.open}
            recordingFrame={frame - s(BEAT.open)}
            transcript={beat.transcript}
            text={SPOKEN}
            savePress={beat.savePress}
          />
        ) : null
      }
    >
      <EmptyHint frame={frame} until={s(BEAT.quote)} />

      <QuoteCard progress={quote} phrases={phrases} />

      {frame >= s(BEAT.derive[0].row) ? (
        <div style={{ marginTop: px(16), display: 'flex', flexDirection: 'column', gap: px(9) }}>
          {MATTERS.map((m, i) => (
            <Row key={m.title} matter={m} at={s(BEAT.derive[i].row)} />
          ))}
        </div>
      ) : null}

      <Closing frame={frame} from={s(BEAT.closing)} display={display}>
        Two reminders set. Bread can wait.
      </Closing>
    </Stage>
  )
}

type Matter = {
  emoji: string
  tint: string
  title: string
  meta: string
  trailing: 'reminder' | 'nodate'
}

const MATTERS: Matter[] = [
  {
    emoji: '🌱',
    tint: DOMAIN.health,
    title: 'Dentist appointment',
    meta: 'Thursday, 3:00 PM',
    trailing: 'reminder',
  },
  {
    emoji: '🌱',
    tint: DOMAIN.health,
    title: 'Bring referral letter',
    meta: 'Thursday, before 3 PM',
    trailing: 'reminder',
  },
  { emoji: '🏠', tint: DOMAIN.home, title: 'Buy bread', meta: 'On your list', trailing: 'nodate' },
]

/** A matter arriving, on the app's LIST_SPRING. */
export const Row: React.FC<{ matter: Matter; at: number }> = ({ matter, at }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  if (frame < at) return null

  const enter = spring({ frame: frame - at, fps, config: SPRING.list })
  const y = interpolate(enter, [0, 1], [px(-16), 0])
  const scale = interpolate(enter, [0, 1], [0.97, 1])

  return (
    <div style={{ opacity: enter, transform: `translateY(${y}px) scale(${scale})` }}>
      <TaskRow
        emoji={matter.emoji}
        tint={matter.tint}
        title={matter.title}
        meta={matter.meta}
        trailing={
          matter.trailing === 'nodate' ? <Pill>No date</Pill> : <Pill tone="accent">Reminder</Pill>
        }
      />
    </div>
  )
}

/** One warm beat once the act has settled, then nothing. */
export const Closing: React.FC<{
  frame: number
  from: number
  display: string
  children: React.ReactNode
}> = ({ frame, from, display, children }) => {
  const T = useT()
  const shown = fadeIn(frame, from, 12)
  if (shown <= 0.001) return null
  return (
    <p
      style={{
        margin: `${px(18)}px 0 0`,
        opacity: shown,
        fontFamily: display,
        fontSize: px(17),
        fontWeight: 500,
        color: T.inkMuted,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </p>
  )
}

const EmptyHint: React.FC<{ frame: number; until: number }> = ({ frame, until }) => {
  const T = useT()
  const gone = interpolate(frame, [until - 10, until], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  if (gone <= 0.001) return null
  return (
    <div style={{ opacity: gone, paddingTop: px(26) }}>
      <p style={{ margin: 0, fontSize: px(15), fontWeight: 600, color: T.inkMuted }}>
        Nothing on your plate today.
      </p>
      <p style={{ margin: `${px(4)}px 0 0`, fontSize: px(14), fontWeight: 500, color: T.inkSubtle }}>
        Tell me what is coming and I will keep track of it.
      </p>
    </div>
  )
}
