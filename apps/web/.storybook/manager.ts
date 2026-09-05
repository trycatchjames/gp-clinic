import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const compactClinical = create({
  base: 'light',
  brandTitle: 'GP Clinic design system',
  brandTarget: '_self',
  colorPrimary: '#176b68',
  colorSecondary: '#125754',
  appBg: '#f8f7f3',
  appContentBg: '#ffffff',
  appPreviewBg: '#f8f7f3',
  appBorderColor: '#dde3df',
  appBorderRadius: 8,
  textColor: '#182523',
  textMutedColor: '#687370',
  barTextColor: '#687370',
  barSelectedColor: '#176b68',
  barHoverColor: '#125754',
  barBg: '#ffffff',
  inputBg: '#ffffff',
  inputBorder: '#879892',
  inputTextColor: '#182523',
  inputBorderRadius: 6,
});

addons.setConfig({ theme: compactClinical });
