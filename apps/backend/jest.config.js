module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^api-contracts$": "<rootDir>/../../packages/api-contracts/src",
    "^shared$": "<rootDir>/../../packages/shared/src",
    "^config$": "<rootDir>/../../packages/config/src",
  },
};
