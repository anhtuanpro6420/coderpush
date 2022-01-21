const withAntdLess = require('next-plugin-antd-less');

module.exports = withAntdLess({
  modifyVars: {},
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},
  webpack(config) {
    return config;
  },
});
