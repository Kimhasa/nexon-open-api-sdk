import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    maplestory: 'src/games/maplestory/index.ts',
    fconline: 'src/games/fc-online/index.ts',
    'maplestory-m': 'src/games/maplestory-m/index.ts',
    'maplestory-sea': 'src/games/maplestory-sea/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});
