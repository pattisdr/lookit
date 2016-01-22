import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        login: function() {
            this.controller.set('loggedIn', true);
            this.transitionTo('homen');
        },
        logout: function() {
            this.controller.set('loggedIn', false);
            this.transitionTo('homen');
        }
    }
});
