/*
 * Create and export different configureation
 */

const environments = {};
environments.staging = {
  httpPORT: 3000,
  httpsPORT: 3001,
  envName: "staging",
  hashingSecret: "This is a secret",
};
environments.dev = {
  httpPORT: 3000,
  httpsPORT: 3001,
  envName: "dev",
  hashingSecret: "This is a secret",
  maxChecks: 5,
};
environments.production = {
  PORT: 3000,
  envName: "production",
  hashingSecret: "This is a secret",
  maxChecks: 5,
};

const currentEnv =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const envToExport = environments.hasOwnProperty(currentEnv)
  ? environments[currentEnv]
  : environments.dev;

module.exports = envToExport;
