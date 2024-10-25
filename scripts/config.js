const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const babel = require("@rollup/plugin-babel").babel;
const commonjs = require("@rollup/plugin-commonjs");
const { uglify } = require("rollup-plugin-uglify");

const getPlugins = (env) => {
  const plugins = [resolve()];

  if (env) {
    plugins.push(
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(env),
      })
    );
  }

  plugins.push(
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      presets: [
        ["@babel/preset-env", { modules: false }],
        "@babel/preset-react",
      ],
    }),
    commonjs({
      include: /node_modules/,
    })
  );

  if (env === "production") {
    plugins.push(uglify());
  }

  return plugins;
};

const config = {
  input: "src/index.js",
  output: {
    globals: {
      react: "React",
    },
  },
  external: ["react"],
  plugins: getPlugins(process.env.BUILD_ENV),
};

if (process.env.BUILD_NAME) {
  config.output.name = process.env.BUILD_NAME;
}

module.exports = config;
