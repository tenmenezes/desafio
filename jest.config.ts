import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config = {
    testEnvironment: "node",
    clearMocks: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: ["**/tests/**/*.test.ts"],
};

export default createJestConfig(config);