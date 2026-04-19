import type { Meta, StoryObj } from '@storybook/react-vite';
import ShinyText from '../components/ShinyText';

/**
 * ShinyText applies a traveling shine/shimmer effect across text.
 * Used for project names, headings, and labels to add premium polish.
 *
 * ## Usage
 * ```tsx
 * <ShinyText text="Hello World" speed={3} />
 * ```
 *
 * ## Design Token Reference
 * - Default color: `#b5b5b5` (muted silver)
 * - Shine color: `#ffffff` (pure white)
 * - Spread angle: `120deg`
 */
const meta: Meta<typeof ShinyText> = {
  title: 'Components/ShinyText',
  component: ShinyText,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'The text content to display' },
    speed: { control: { type: 'range', min: 0.5, max: 10, step: 0.5 }, description: 'Animation speed in seconds' },
    color: { control: 'color', description: 'Base text color' },
    shineColor: { control: 'color', description: 'Shimmer highlight color' },
    spread: { control: { type: 'range', min: 0, max: 360, step: 10 }, description: 'Gradient angle in degrees' },
    disabled: { control: 'boolean', description: 'Disable the shimmer animation' },
    yoyo: { control: 'boolean', description: 'Reverse direction on each cycle' },
    pauseOnHover: { control: 'boolean', description: 'Pause shimmer when hovered' },
    direction: { control: 'radio', options: ['left', 'right'], description: 'Direction of the shimmer' },
    delay: { control: { type: 'range', min: 0, max: 5, step: 0.5 }, description: 'Delay between shimmer cycles' },
  },
};

export default meta;
type Story = StoryObj<typeof ShinyText>;

export const Default: Story = {
  args: {
    text: 'Aura Timer',
    speed: 3,
    disabled: false,
  },
};

export const CyanTheme: Story = {
  args: {
    text: 'Deep Focus',
    speed: 2,
    color: '#22d3ee',
    shineColor: '#ffffff',
    className: 'text-2xl tracking-[0.3em] uppercase',
  },
};

export const SlowYoyo: Story = {
  args: {
    text: 'Breathe In... Breathe Out...',
    speed: 5,
    yoyo: true,
    color: '#34d399',
    shineColor: '#a7f3d0',
  },
};

export const Disabled: Story = {
  args: {
    text: 'Static Text',
    disabled: true,
    color: '#94a3b8',
  },
};

export const PauseOnHover: Story = {
  args: {
    text: 'Hover to pause the shimmer',
    pauseOnHover: true,
    speed: 2,
  },
};
