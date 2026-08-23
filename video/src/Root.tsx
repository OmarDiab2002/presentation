import React from 'react'
import { Composition, Folder } from 'remotion'
import {
  VoiceCapture,
  UncertaintyOnly,
  ConflictOnly,
  ScanOnly,
  ChatOnly,
  AreasOnly,
  RemindersOnly,
  TrustOnly,
  HomeOnly,
  MattersOnly,
  MoneyOnly,
  DocumentsOnly,
  ArabicOnly,
  ACT_FRAMES,
  TOTAL_FRAMES,
  type ReelProps,
} from './scenes/VoiceCapture'
import { SIZE, type Mode } from './theme'

/**
 * Every video the deck needs, in both palettes.
 *
 * The deck follows the viewer's theme, and a light phone glowing inside a dark
 * slide is the one thing that would make the footage read as pasted-in stock.
 * So each scene is registered twice and the page picks the matching file.
 */
const SCENES = [
  { id: 'VoiceCapture', component: VoiceCapture, frames: TOTAL_FRAMES },
  { id: 'Uncertainty', component: UncertaintyOnly, frames: ACT_FRAMES.uncertainty },
  { id: 'Conflict', component: ConflictOnly, frames: ACT_FRAMES.conflict },
  { id: 'Scan', component: ScanOnly, frames: ACT_FRAMES.scan },
  { id: 'Chat', component: ChatOnly, frames: ACT_FRAMES.chat },
  { id: 'Areas', component: AreasOnly, frames: ACT_FRAMES.areas },
  { id: 'Reminders', component: RemindersOnly, frames: ACT_FRAMES.reminders },
  { id: 'Trust', component: TrustOnly, frames: ACT_FRAMES.trust },
  { id: 'Home', component: HomeOnly, frames: ACT_FRAMES.home },
  { id: 'Matters', component: MattersOnly, frames: ACT_FRAMES.matters },
  { id: 'Money', component: MoneyOnly, frames: ACT_FRAMES.money },
  { id: 'Documents', component: DocumentsOnly, frames: ACT_FRAMES.documents },
  { id: 'Arabic', component: ArabicOnly, frames: ACT_FRAMES.arabic },
] as const

const MODES: Mode[] = ['light', 'dark']

export const RemotionRoot: React.FC = () => (
  <>
    {MODES.map((mode) => (
      <Folder key={mode} name={mode === 'light' ? 'Light' : 'Dark'}>
        {SCENES.map((scene) => (
          <Composition
            key={scene.id}
            id={`${scene.id}-${mode}`}
            component={scene.component}
            durationInFrames={scene.frames}
            fps={30}
            width={SIZE.width}
            height={SIZE.height}
            defaultProps={{ mode } satisfies ReelProps}
          />
        ))}
      </Folder>
    ))}
  </>
)
