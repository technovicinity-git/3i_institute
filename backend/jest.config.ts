import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
  },
  setupFilesAfterSetup: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};

export default config;