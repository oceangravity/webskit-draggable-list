
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify-es'
import minimist from 'minimist'
import babel from 'rollup-plugin-babel'

const argv = minimist(process.argv.slice(2))

const config = {
  input: 'src/wrapper.js',
  output: {
    name: 'WebskitDraggableList',
    exports: 'named'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**', // only transpile our source code
      presets: ['@babel/env'],
      plugins: [
        '@babel/transform-runtime',
        '@babel/transform-async-to-generator'
      ]
    })
  ]
}

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(uglify())
}

export default config
