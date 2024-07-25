export default {
  transform: {
    '^.+\\.mjs$': 'babel-jest',
  },
    moduleFileExtensions: [
      "mjs",
      "js",
    ],
    testRegex: `test.mjs$`,
    transform: {},
  testEnvironment: "node",
  testTimeout: 80000,
  verbose: true,
};
