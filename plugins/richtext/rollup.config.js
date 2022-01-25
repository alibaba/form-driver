import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from "rollup-plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
// 将 import 引入的图片转换成base64格式
import image from '@rollup/plugin-image';
// 处理 css 定义的变量
import simplevars from 'postcss-simple-vars';
// 处理 less 嵌套样式写法
import nested from 'postcss-nested';
// convert modern CSS into browsers understand
import postcssPresetEnv from 'postcss-preset-env';
import pkg from './package.json'

const extensions = ['.ts', '.tsx']

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return (id) => pattern.test(id)
}

const dirMap = {
  cjs: 'lib',
  es: 'es',
  umd: 'dist'
}

const setupOpt = (type) => {
  const baseOpt = {
    input: 'src/index.ts',
    output: { file: `${dirMap[type]}/index.js`, format: type, indent: false },
    external: makeExternalPredicate([
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]),
    plugins: [
      nodeResolve({
        extensions,
      }),
      json(),
      (type === 'cjs' && commonjs()),
      typescript({
        useTsconfigDeclarationDir: type === 'cjs',
        tsconfigOverride: {
          compilerOptions: { declaration: type === 'cjs' },
          exclude: [
            "node_modules",
            "demo"
          ]
        },
      }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            { useESModules: type === 'es' },
          ],
        ],
        babelHelpers: 'runtime'
      }),
      (
        type === 'umd' && replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        })
      ),
      (type === 'umd' && terser({})),
      image(),
      postcss({
        autoModules: true,
        extract: 'index.css',
        plugins: [
          simplevars(),
          nested(),
          postcssPresetEnv(),
        ],
        // minimize: true,
        extensions: ['.css', 'less'],
      }),
    ],
  }
  if (type === 'umd') baseOpt.output.name = 'M3PluginRichtext'
  return baseOpt
}

const options = ['cjs', 'es', 'umd'].map(item => setupOpt(item))
export default options
