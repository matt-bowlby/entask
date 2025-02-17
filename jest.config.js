import path from 'node:path'

export default {
	testEnvironment: "jsdom",
	transform: {
	  "^.+\\.tsx?$": "ts-jest",
	},

	moduleNameMapper: {
	  "\\.(css|less|sass|scss)$": "identity-obj-proxy",
	  "^.+\\.svg$": "jest-transformer-svg",
	  "^@/(.*)$": "<rootDir>/src/$1",
	  "^@classes/(.*)$": "<rootDir>/src/classes/$1",
	  "^@assets/(.*)$": "<rootDir>/src/assets/$1",
	  "^@components/(.*)$": "<rootDir>/src/components/$1",
	},

	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  };