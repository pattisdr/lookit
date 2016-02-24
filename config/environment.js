/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    JAMDB: {
        url: 'http://localhost:1212',
        namespace: 'experimenter',
        collection: 'accounts'
    },

    modulePrefix: 'lookit-base',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    'ember-simple-auth': {
        authenticationRoute: 'login'
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    
//    This is probably super unsafe, but just for proof of concept...
    contentSecurityPolicy: {
        'font-src':"'self' fonts.gstatic.com fonts.googleapis.com",
        'style-src':"'self''unsafe-inline' fonts.googleapis.com",
        'connect-src': "'self' localhost:1212",
        'child-src':"'self' blob:",
//        Change this unsafe inline
        'script-src': "* 'unsafe-inline'",
        'default-src': "*",
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }
  
  if (environment === 'stage') {
    ENV.JAMDB.url = 'https://staging-metadata.osf.io';
    ENV.JAMDB.namespace = 'COS';
  }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

    }

    return ENV;
};
