import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath, URL } from 'node:url';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  docs: { autodocs: true },
  viteFinal: async (baseConfig) => {
    const plugins = baseConfig.plugins?.flat(10).filter((plugin) => {
      if (!plugin || typeof plugin !== 'object') return true;
      return !('name' in plugin) || !String(plugin.name).startsWith('vite-plugin-pwa');
    });

    return mergeConfig(
      { ...baseConfig, plugins },
      {
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('../src', import.meta.url)),
          },
        },
      },
    );
  },
};

export default config;
