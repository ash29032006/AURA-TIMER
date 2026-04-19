import type { Meta, StoryObj } from '@storybook/react-vite';
import SpotlightCard from '../components/SpotlightCard';

/**
 * SpotlightCard creates a card with a radial spotlight that follows the mouse cursor.
 * Used for stat cards on the Dashboard and interactive content panels.
 *
 * ## Usage
 * ```tsx
 * <SpotlightCard spotlightColor="rgba(34, 211, 238, 0.1)">
 *   <h3>Card Content</h3>
 * </SpotlightCard>
 * ```
 */
const meta: Meta<typeof SpotlightCard> = {
  title: 'Components/SpotlightCard',
  component: SpotlightCard,
  tags: ['autodocs'],
  argTypes: {
    spotlightColor: { control: 'text', description: 'Color of the spotlight radial gradient' },
    className: { control: 'text', description: 'Additional CSS classes' },
  },
};

export default meta;
type Story = StoryObj<typeof SpotlightCard>;

export const Default: Story = {
  args: {
    spotlightColor: 'rgba(255, 255, 255, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
    children: null,
  },
  render: (args) => (
    <SpotlightCard {...args} className="max-w-sm">
      <div className="p-6">
        <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">Total Focus</h3>
        <div className="text-4xl font-extralight text-white mb-2">12.5h</div>
        <div className="text-xs text-emerald-400 font-medium">+12% from last week</div>
      </div>
    </SpotlightCard>
  ),
};

export const CyanThemed: Story = {
  render: () => (
    <SpotlightCard spotlightColor={'rgba(34, 211, 238, 0.15)' as `rgba(${number}, ${number}, ${number}, ${number})`} className="max-w-sm">
      <div className="p-6">
        <h3 className="text-xs font-semibold tracking-widest text-cyan-400/60 uppercase mb-4">Coding</h3>
        <div className="text-4xl font-extralight text-white mb-2">⚡ 8.2h</div>
        <div className="text-xs text-white/40">This week</div>
      </div>
    </SpotlightCard>
  ),
};

export const PinkThemed: Story = {
  render: () => (
    <SpotlightCard spotlightColor={'rgba(244, 114, 182, 0.15)' as `rgba(${number}, ${number}, ${number}, ${number})`} className="max-w-sm">
      <div className="p-6">
        <h3 className="text-xs font-semibold tracking-widest text-pink-400/60 uppercase mb-4">Design</h3>
        <div className="text-4xl font-extralight text-white mb-2">🎨 5.0h</div>
        <div className="text-xs text-white/40">This week</div>
      </div>
    </SpotlightCard>
  ),
};
