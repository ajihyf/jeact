// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
  entry: 'src/jeact.ts',

  plugins: [
    typescript(/*{ plugin options }*/)
  ]
}