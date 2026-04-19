import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatedCounter, KeyboardShortcut } from '../components/InteractiveElements';
import { useState } from 'react';

/**
 * AnimatedCounter smoothly transitions between numeric values using spring physics.
 * Used on the Dashboard for stat cards.
 *
 * ## Usage
 * ```tsx
 * <AnimatedCounter value={12.5} suffix="h" decimals={1} />
 * ```
 */
const meta: Meta<typeof AnimatedCounter> = {
  title: 'Components/AnimatedCounter',
  component: AnimatedCounter,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'number' }, description: 'Target numeric value' },
    suffix: { control: 'text', description: 'Text appended after the number' },
    prefix: { control: 'text', description: 'Text prepended before the number' },
    decimals: { control: { type: 'range', min: 0, max: 3, step: 1 }, description: 'Decimal places' },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedCounter>;

export const Default: Story = {
  args: {
    value: 42,
    suffix: 'h',
    decimals: 1,
    className: 'text-4xl font-extralight text-white',
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="space-y-6">
        <div className="text-5xl font-extralight text-white">
          <AnimatedCounter value={value} suffix="h" decimals={1} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setValue(v => v + 5)} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/80 text-sm hover:bg-white/15 transition-all">+5</button>
          <button onClick={() => setValue(v => v + 25)} className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white/80 text-sm hover:bg-white/15 transition-all">+25</button>
          <button onClick={() => setValue(0)} className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-all">Reset</button>
        </div>
      </div>
    );
  },
};

/**
 * KeyboardShortcut renders a styled keyboard badge for shortcut hints.
 */
export const ShortcutBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/60 w-40">Play / Pause</span>
        <KeyboardShortcut keys={['Space']} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/60 w-40">Reset timer</span>
        <KeyboardShortcut keys={['R']} />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/60 w-40">Command palette</span>
        <KeyboardShortcut keys={['⌘', 'K']} />
      </div>
    </div>
  ),
};
