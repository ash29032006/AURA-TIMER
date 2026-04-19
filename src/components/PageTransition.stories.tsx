import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageTransition } from '../components/PageTransition';

/**
 * PageTransition wraps pages with a fade + slide animation using Framer Motion.
 * Used on every page to create smooth transitions between routes.
 *
 * ## Usage
 * ```tsx
 * <PageTransition className="flex flex-col items-center">
 *   <h1>Page Content</h1>
 * </PageTransition>
 * ```
 *
 * ## Animation Details
 * - **Initial**: opacity 0, translateY 10px
 * - **Animate**: opacity 1, translateY 0
 * - **Exit**: opacity 0, translateY -10px
 * - **Easing**: cubic-bezier(0.22, 1, 0.36, 1) — decelerate
 * - **Duration**: 300ms
 */
const meta: Meta<typeof PageTransition> = {
  title: 'Components/PageTransition',
  component: PageTransition,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageTransition>;

export const Default: Story = {
  render: () => (
    <PageTransition className="p-8 bg-white/5 border border-white/10 rounded-3xl max-w-md">
      <h2 className="text-2xl font-light text-white/90 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Page Content</h2>
      <p className="text-sm text-white/50 leading-relaxed">
        This content fades in with a subtle upward slide. The same transition plays on every route change.
      </p>
    </PageTransition>
  ),
};
