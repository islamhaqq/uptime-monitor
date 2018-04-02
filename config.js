// Configure environment for API.

const environment = {
  staging: {
    ports: {
      http: 3000,
      https: 3001
    },
    environmentName: 'staging'
  },
  production: {
    ports: {
      http: 5000,
      https: 5001
    },
    environmentName: 'production'
  }
};

const { NODE_ENV } = process.env;

module.exports = environment[NODE_ENV ? NODE_ENV.toLowerCase() : 'staging'];
