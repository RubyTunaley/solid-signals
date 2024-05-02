import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import { dts } from "rollup-plugin-dts";
import { fileURLToPath } from "node:url";

const plugins = [
  nodeResolve({
    extensions: [".js", ".ts"]
  }),
  babel({
    extensions: [".js", ".ts"],
    exclude: "node_modules/**",
    babelrc: false,
    babelHelpers: "bundled",
    presets: ["@babel/preset-typescript"],
    plugins: [
      [
        "babel-plugin-transform-rename-import",
        {
          original: "rxcore",
          replacement: fileURLToPath(new URL("web/src/core", import.meta.url))
        }
      ]
    ]
  }),
  cleanup({
    comments: ["some", /PURE/],
    extensions: [".js", ".ts"]
  })
];

/** @type {import('rollup').RollupOptions[]} */
const options = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/solid-signals-umd.js",
        format: "umd",
        name: "signals"
      },
      {
        file: "dist/solid-signals-esm.js",
        format: "es"
      }
    ],
    plugins: plugins.concat([])
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
