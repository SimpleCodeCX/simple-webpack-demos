const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
        ie: "11"
      },
      // useBuiltIns: "usage" // 和ts结合的情况，这个属性无效，需要手动import "@babel/polyfill";
    },
  ],
];

module.exports = { presets };