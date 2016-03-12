
import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),

    header: 'Suggested Studies',

    loggedIn: Ember.computed(function () {
        return !!this.get('sessionAccount').account;
    }),

    actions: {
        updateHeader: function (header) {
            this.set('header', header);
        }
    }
});
