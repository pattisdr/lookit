/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    
    //The below are necessary to use the jam-osf-jwt authenticator in the exp-addon, which doesn't work for login (returns 500)
    OSF: {
        clientId: process.env.OSF_CLIENT_ID,
        scope: process.env.OSF_SCOPE,
        url: process.env.OSF_URL
    },
    JAMDB: {
        url: 'http://localhost:1212',
        namespace: 'experimenter'
    },
      
    jamdbURL: 'http://localhost:1212',
    auth: {
//          The below SHOULD be correct defaults, but they don't work
//        Would also need to update type in jam-jwt authenticator
//        self: {
//            defaultNamespace: 'experimenter',
//            defaultCollection: 'accounts',
//        },
        self: {
            defaultNamespace: 'experimenter',
            defaultCollection: 'accounts',
        },
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
        authenticationRoute: 'login',
        routeAfterAuthentication: 'home',
        authorizer: 'simple-auth-authorizer:jam-jwt'
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
    ENV.jamdbURL = 'https://staging-metadata.osf.io';
    ENV.auth.self.defaultNamespace = 'COS';
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