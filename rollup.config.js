// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  output: { exports: 'named' },

  input: 'src/jeact.ts',

  plugins: [resolve(), commonjs(), typescript(/*{ plugin options }*/)]
};
