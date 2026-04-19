import type { Meta, StoryObj } from '@storybook/react-vite';
import { TiltCard, FloatingShape, ParticleField, MagneticButton } from '../components/Effects3D';

/**
 * TiltCard adds a 3D perspective tilt effect that follows the mouse cursor.
 * Used throughout the app for project cards, stat cards, and interactive panels.
 *
 * ## Usage
 * ```tsx
 * <TiltCard glowColor="rgba(34, 211, 238, 0.2)" intensity={12}>
 *   <div className="p-6">Content</div>
 * </TiltCard>
 * ```
 */
const tiltMeta: Meta<typeof TiltCard> = {
  title: 'Components/TiltCard',
  component: TiltCard,
  tags: ['autodocs'],
  argTypes: {
    glowColor: { control: 'text', description: 'Color of the hover glow overlay' },
    intensity: { control: { type: 'range', min: 1, max: 30, step: 1 }, description: 'Tilt intensity in degrees' },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default tiltMeta;
type TiltStory = StoryObj<typeof TiltCard>;

export const Default: TiltStory = {
  render: (args) => (
    <TiltCard {...args} className="max-w-sm rounded-3xl">
      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <h3 className="text-lg font-light text-white/90 mb-2">Hover me!</h3>
        <p className="text-sm text-white/50">Move your mouse to see the 3D tilt effect with dynamic glow.</p>
      </div>
    </TiltCard>
  ),
  args: {
    glowColor: 'rgba(34, 211, 238, 0.2)',
    intensity: 15,
  },
};

export const IntenseEffect: TiltStory = {
  render: (args) => (
    <TiltCard {...args} className="max-w-sm rounded-3xl">
      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
        <h3 className="text-lg font-light text-white/90 mb-2">Intense Tilt</h3>
        <p className="text-sm text-white/50">Higher intensity = more dramatic 3D effect.</p>
      </div>
    </TiltCard>
  ),
  args: {
    glowColor: 'rgba(244, 114, 182, 0.3)',
    intensity: 25,
  },
};

/**
 * FloatingShape creates CSS-based 3D shapes that rotate and float.
 * Each project theme has an associated shape.
 */
export const Shapes: TiltStory = {
  render: () => (
    <div className="flex gap-12 items-center flex-wrap">
      {(['cube', 'octahedron', 'sphere', 'torus', 'pyramid'] as const).map(shape => (
        <div key={shape} className="flex flex-col items-center gap-4">
          <FloatingShape shape={shape} color="#22d3ee" size={80} />
          <span className="text-xs text-white/40 uppercase tracking-wider">{shape}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * ParticleField creates floating, drifting particle dots across a container.
 */
export const Particles: TiltStory = {
  render: () => (
    <div className="relative w-full h-[300px] border border-white/10 rounded-3xl overflow-hidden bg-black/30">
      <ParticleField color="#22d3ee" count={30} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="text-white/60 text-sm">Particles floating in the background</span>
      </div>
    </div>
  ),
};

/**
 * MagneticButton creates a button that magnetically follows the cursor on hover.
 */
export const Magnetic: TiltStory = {
  render: () => (
    <div className="flex gap-8 items-center">
      <MagneticButton
        ariaLabel="Example magnetic button"
        className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white/80 hover:bg-white/15 transition-all font-medium"
      >
        Hover Me — I'm Magnetic
      </MagneticButton>
      <MagneticButton
        ariaLabel="Circular magnetic button"
        className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400"
      >
        ▶
      </MagneticButton>
    </div>
  ),
};
