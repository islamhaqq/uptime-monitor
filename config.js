const environment = {
  staging: {
    port: 3000,
    environmentName: "staging"
  },
  production: {
    port: 5000,
    environmentName: "production"
  }
};

const { NODE_ENV } = process.env;

module.exports = environment[NODE_ENV ? NODE_ENV.toLowerCase() : 'staging'];
