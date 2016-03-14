import Ember from 'ember';


export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),

    loggedIn: Ember.computed(function () {
        return !!this.get('sessionAccount').account;  // TODO: Can we just use session.isAuthenticated ?
    }),

    actions: {
        updateHeader: function (header) {
            this.set('header', header);
        }
    }
});
