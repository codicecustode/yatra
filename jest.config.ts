import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,

  roots: ['<rootDir>/src', '<rootDir>/tests'],

  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },

  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
