module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/core/$1',
    '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@interfaces/(.*)$': '<rootDir>/interfaces/$1',
  },
}; 