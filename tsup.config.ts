import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    maplestory: 'src/games/maplestory/index.ts',
    fconline: 'src/games/fc-online/index.ts',
    'maplestory-m': 'src/games/maplestory-m/index.ts',
    'maplestory-sea': 'src/games/maplestory-sea/index.ts',
    'maplestory-tw': 'src/games/maplestory-tw/index.ts',
    'first-descendant': 'src/games/first-descendant/index.ts',
    'mabinogi-heroes': 'src/games/mabinogi-heroes/index.ts',
    'sudden-attack': 'src/games/sudden-attack/index.ts',
    kartrider: 'src/games/kartrider/index.ts',
    baram: 'src/games/baram/index.ts',
    mabinogi: 'src/games/mabinogi/index.ts',
    'baram-yeon': 'src/games/baram-yeon/index.ts',
    v4: 'src/games/v4/index.ts',
    hit2: 'src/games/hit2/index.ts',
    platform: 'src/games/platform/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  treeshake: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});
