import { interpolate, spring } from 'remotion'
import { SPRING } from '../theme'

/**
 * The speak-and-save gesture every act opens with: tap the mic, the island
 * grows, the sentence arrives, Save is pressed, the island collapses.
 *
 * Returned as plain numbers so each act can lay its own content out around the
 * same choreography instead of re-deriving it.
 */
export const useSpeakBeat = (
  frame: number,
  fps: number,
  at: {
    tap: number
    open: number
    speakFrom: number
    speakTo: number
    savePress: number
    close: number
  },
) => {
  const s = (sec: number) => sec * fps

  const opening = spring({ frame: frame - s(at.open), fps, config: SPRING.morph })
  const closing = spring({ frame: frame - s(at.close), fps, config: SPRING.morph })

  return {
    open: Math.max(0, opening - closing),
    micPress: interpolate(frame, [s(at.tap), s(at.tap + 0.12), s(at.open)], [0, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    savePress: interpolate(
      frame,
      [s(at.savePress), s(at.savePress + 0.12), s(at.close)],
      [0, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    ),
    transcript: interpolate(frame, [s(at.speakFrom), s(at.speakTo)], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  }
}

/** A phrase mark: a bright flash as its row is made, then a standing tint. */
export const markAt = (frame: number, at: number) =>
  interpolate(frame, [at, at + 6, at + 20], [0, 1, 0.42], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/** A plain fade-in that holds. */
export const fadeIn = (frame: number, at: number, over = 10) =>
  interpolate(frame, [at, at + over], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
