import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import external from 'rollup-plugin-peer-deps-external'
import replace from 'rollup-plugin-replace'
import local from './env/local.json'
import remote from './env/remote.json'
import prod from './env/prod.json'
import json from '@rollup/plugin-json'
import postcss from 'rollup-plugin-postcss'
import tslib from 'tslib'

const packageJson = require('./package.json')

console.log('local', local)

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      name: 'react-lib',
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    // replace({}),
    json(),
    external(),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      tslib,
    }),
    postcss(),
    // terser(),
  ],
}
