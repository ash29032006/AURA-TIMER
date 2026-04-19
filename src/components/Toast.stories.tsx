import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from '../components/Toast';

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => toast('Session complete! 25m for Coding', 'success')}
        className="px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-all"
      >
        Success Toast
      </button>
      <button
        onClick={() => toast('All session data erased', 'error')}
        className="px-6 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all"
      >
        Error Toast
      </button>
      <button
        onClick={() => toast('Timer reset', 'info', 2000)}
        className="px-6 py-3 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-all"
      >
        Info Toast
      </button>
    </div>
  );
}

/**
 * Toast notifications provide contextual feedback for user actions.
 * Uses a context provider pattern — wrap your app in `<ToastProvider>`.
 *
 * ## Usage
 * ```tsx
 * const { toast } = useToast();
 * toast('Session complete!', 'success');
 * toast('Data erased', 'error');
 * toast('Timer reset', 'info', 2000);
 * ```
 */
const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => <ToastDemo />,
};
