
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    // Temporary: restore LaTeX coverage when compilation is tested separately.
    "!src/lib/latex/**",
  ],
  coverageReporters: ["text", "lcov", "json", "json-summary"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!uuid/)",
  ],
};
