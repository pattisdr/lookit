
import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),
    queryString: 'Active',
    queryTypes: ['state', 'eligibilityCriteria'],
    queryType: 'state',
    header: 'Suggested Studies',

    loggedIn: Ember.computed(function () {
        return !!this.get('sessionAccount').account;
    }),

    allExperiments: Ember.computed(function () {
        if (this.get('loggedIn')) {
            return;
        }
        return [];
    }),

    actions: {
        updateHeader: function (header) {
            this.set('header', header);
        }
    }
});
