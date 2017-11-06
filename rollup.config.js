// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/jeact.ts',

  plugins: [typescript(/*{ plugin options }*/)]
};
