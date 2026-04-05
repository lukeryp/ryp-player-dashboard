import type { Config } from 'tailwindcss';
import rypPreset from '@ryp/ui/tailwind';

const config: Config = {
  presets: [rypPreset],
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    '../ryp-ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
