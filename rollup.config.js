// @ts-check

import nodeResolve from "@rollup/plugin-node-resolve";
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

/** @type {import("@rollup/plugin-babel").RollupBabelInputPluginOptions['targets']} */
const esmBrowserSupport = {
  chrome: "100",
  edge: "100",
  firefox: "100",
  node: "18"
};

/** @type {import("@rollup/plugin-babel").RollupBabelInputPluginOptions['targets']} */
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

/** @type {import('rollup').RollupOptions[]} */
const options = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/solid-signals-umd.js",
        format: "umd",
        name: "signals",
        sourcemap: true
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
        file: "dist/solid-signals-esm.js",
        format: "es",
        sourcemap: true
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
        file: "dist/solid-signals-umd.d.ts",
        format: "umd",
        banner: "export as namespace signals;"
      },
      {
        file: "dist/solid-signals-esm.d.ts",
        format: "es"
      }
    ],
    plugins: [dts()],
  }
];

export default options;
