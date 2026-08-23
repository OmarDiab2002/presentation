/**
 * Renders every composition into `../assets/video`, in both palettes.
 *
 * The deck follows the viewer's theme and swaps the file, so light and dark
 * must stay in step: rendering one without the other leaves a slide showing a
 * glowing white phone on a black page.
 */
import { execFileSync } from 'node:child_process'

const SCENES = [
  { id: 'VoiceCapture', out: '01-speak' },
  { id: 'Uncertainty', out: '06-questions' },
  { id: 'Conflict', out: '07-clash' },
  { id: 'Scan', out: '02-scan' },
  { id: 'Chat', out: '03-chat' },
  { id: 'Areas', out: '04-areas' },
  { id: 'Reminders', out: '05-reminders' },
  { id: 'Trust', out: '08-trust' },
  { id: 'Home', out: '09-home' },
  { id: 'Matters', out: '10-matters' },
  { id: 'Money', out: '11-money' },
  { id: 'Documents', out: '12-documents' },
  { id: 'Arabic', out: '13-arabic' },
]

// `node render-all.mjs Scan Chat` renders only those; no argument renders all.
const only = process.argv.slice(2)
const queue = only.length ? SCENES.filter((s) => only.includes(s.id)) : SCENES

for (const scene of queue) {
  for (const mode of ['light', 'dark']) {
    const suffix = mode === 'dark' ? '-dark' : ''
    const target = `../assets/video/${scene.out}${suffix}.mp4`
    console.log(`→ ${scene.id} (${mode}) → ${target}`)
    execFileSync(
      'npx',
      ['remotion', 'render', `${scene.id}-${mode}`, target, '--codec=h264', '--log=error'],
      { stdio: 'inherit' },
    )
  }
}
console.log('done')
