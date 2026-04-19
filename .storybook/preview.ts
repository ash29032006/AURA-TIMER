import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#050510' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    a11y: {
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ 
        backgroundColor: '#050510', 
        color: 'white', 
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;