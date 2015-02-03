var _ = require('underscore'),
    pkg = require('../package.json'),
    env = process.env.NODE_ENV || 'development';

var config = {
    base: {
        image_output: 'output'
    },
    development: {
        port: 3000
    },
    production: {
        port: process.env.PORT
    }
};

module.exports = _.extend(config.base, config[env], {
    env: env,
    name: pkg.name
});