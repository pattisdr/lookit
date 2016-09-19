/*jshint node:true*/
/* global require, module */
require('dotenv').config();
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

const nonCdnEnvironments = ['development', 'test'];

module.exports = function (defaults) {
    const useCdn = (nonCdnEnvironments.indexOf(process.env.EMBER_ENV) === -1);

    var app = new EmberApp(defaults, {
        sourcemaps: {enabled: true},
        minifyJS: {
            enabled: EmberApp.env() === 'production'
        },
        minifyCSS: {
            enabled: EmberApp.env() === 'production'
        },
        emberWowza: {
            // Config for video recorder config
            asp: JSON.parse(process.env.WOWZA_ASP),
            // Config for actual video recording
            php: JSON.parse(process.env.WOWZA_PHP)
        },
        'ember-bootstrap': {
            importBootstrapFont: true
        },
        'ember-bootstrap-datetimepicker': {
            importBootstrapCSS: false
        },
        inlineContent: {
            raven: {
                enabled: useCdn,
                content: `
                    <script src="https://cdn.ravenjs.com/3.5.1/ember/raven.min.js"></script>
                    <script>Raven.config("${process.env.SENTRY_DSN}", {}).install();</script>`
            },
        }
    });

    // Use `app.import` to add additional libraries to the generated
    // output files.

    // If you need to use different assets in different
    // environments, specify an object as the first parameter. That
    // object's keys should be the environment name and the values
    // should be the asset to use in that environment.
    //
    // If the library that you are including contains AMD or ES6
    // modules that you would like to import into your application
    // please specify an object with the list of modules as keys
    // along with the exports of each module as its value.

    return app.toTree();
};
