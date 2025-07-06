import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,

collectCoverage: true, //collect coverage information
coverageDirectory: 'coverage', //directory where Jest should output its coverage files
coveragePathIgnorePatterns: [
  "/node_modules/",
  "src/Drizzle/db.ts",
  "src/Drizzle/schema.ts"
],
   


};




export default config; 



