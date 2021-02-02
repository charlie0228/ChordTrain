module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
