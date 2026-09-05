import type { Preview } from '@storybook/react-vite';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import '../src/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="bg-background text-foreground min-h-svh w-full p-5 sm:p-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Foundations', 'Atoms', 'Molecules', 'Capabilities'],
      },
    },
    viewport: {
      options: {
        ...MINIMAL_VIEWPORTS,
        clinicalDesktop: {
          name: 'Clinical desktop',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
        clinicalNarrow: {
          name: 'Clinical narrow',
          styles: { width: '360px', height: '800px' },
          type: 'mobile',
        },
      },
    },
  },
};

export default preview;
