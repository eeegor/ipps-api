module.exports = {
  transform: {
    "^.+\\.js?$": "babel-jest"
  },
  setupFiles: ['./test/setup-tests.js'],
  testRegex: '(src/__tests__/.*|(\\.|/)(test|spec))\\.js$',
  coverageDirectory: "coverage",
  coverageReporters: [
    'lcov', // html report
    'text' // report in console
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/*._story.*',
    '!**/*.story.*',
    '!**/*.d.ts',
    '!src/index.*'
  ],
  // uncomment the following to make tests fail if coverage goals are not met
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     statements: 80,
  //     line: 80
  //   }
  // },
  moduleFileExtensions: [
    'js',
    'json',
    'node'
  ],
  // static files are actually mocked
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/test/__mocks__/styleMock.js'
  }
};
