// @ts-check

import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import sourcemaps from "rollup-plugin-sourcemaps";
import { dts } from "rollup-plugin-dts";
import { fileURLToPath } from "node:url";

/** @type {import("@rollup/plugin-babel").RollupBabelInputPluginOptions} */
const babelOptions = {
  extensions: [".js", ".ts"],
  exclude: "node_modules/**",
  babelrc: false,
  babelHelpers: "bundled",
  presets: ["@babel/preset-env", "@babel/preset-typescript"],
  plugins: [
    [
      "babel-plugin-transform-rename-import",
      {
        original: "rxcore",
        replacement: fileURLToPath(new URL("web/src/core", import.meta.url))
      }
    ]
  ],
  // @ts-ignore Bad types from library
  inputSourceMap: false
};

/** @type {import("@rollup/plugin-babel").RollupBabelInputPluginOptions["targets"]} */
const esmBrowserSupport = {
  chrome: "100",
  edge: "100",
  firefox: "100",
  node: "18"
};

/** @type {import("@rollup/plugin-babel").RollupBabelInputPluginOptions["targets"]} */
const umdBrowserSupport = {
  ...esmBrowserSupport,
  ie: "9"
};

const plugins = [
  nodeResolve({
    extensions: [".js", ".ts"]
  }),
  cleanup({
    comments: ["some", /PURE/],
    extensions: [".js", ".ts"]
  }),
  sourcemaps()
];

const license = `/**
The MIT License (MIT)

Copyright (c) 2017 Adam Haile

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/`;

/** @type {import("@rollup/plugin-terser").Options} */
const umdTerserOptions = {
  ecma: 5,
  parse: {
    html5_comments: false,
    shebang: false
  },
  compress: {
    arrows: false,
    inline: 2,
    typeofs: false,
    unsafe_comps: true,
    unsafe_math: true
  },
  mangle: {
    safari10: true
  },
  format: {
    comments: /^# sourceMappingURL=/u,
    preamble: license,
    safari10: true,
    shebang: false,
    wrap_func_args: false
  }
};

/** @type {import("@rollup/plugin-terser").Options} */
const esmTerserOptions = {
  ...umdTerserOptions,
  ecma: 2020,
  compress: {
    ...(/** @type {Exclude<import("@rollup/plugin-terser").Options["compress"], boolean | undefined>} */ (umdTerserOptions.compress)),
    module: true,
    typeofs: true
  },
  mangle: {
    ...(/** @type {Exclude<import("@rollup/plugin-terser").Options["mangle"], boolean | undefined>} */ (umdTerserOptions.mangle)),
    module: true,
    safari10: false
  },
  format: {
    ...(/** @type {Exclude<import("@rollup/plugin-terser").Options["format"], boolean | undefined>} */ (umdTerserOptions.format)),
    safari10: false
  }
};

/** @type {import("rollup").RollupOptions[]} */
const options = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/umd/solid-signals.js",
        format: "umd",
        name: "signals",
        sourcemap: true,
        banner: license

      },
      {
        file: "dist/umd/solid-signals.min.js",
        format: "umd",
        name: "signals",
        sourcemap: true,
        plugins: [terser(umdTerserOptions)]
      }
    ],
    plugins: plugins.concat([babel({
      ...babelOptions,
      targets: umdBrowserSupport
    })])
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/esm/solid-signals.js",
        format: "es",
        sourcemap: true,
        banner: license
      },
      {
        file: "dist/esm/solid-signals.min.js",
        format: "es",
        sourcemap: true,
        plugins: [terser(esmTerserOptions)]
      }
    ],
    plugins: plugins.concat([babel({
      ...babelOptions,
      targets: esmBrowserSupport
    })])
  },
  {
    input: "./types/index.d.ts",
    output: [
      {
        file: "dist/umd/solid-signals.d.ts",
        format: "umd",
        banner: license + "\nexport as namespace signals;"
      },
      {
        file: "dist/esm/solid-signals.d.ts",
        format: "es",
        banner: license
      }
    ],
    plugins: [dts()],
  }
];

export default options;
