import Ember from 'ember';

export default Ember.Route.extend({
    sessionAccount: Ember.inject.service('session-account'),
    model(params) {
        return Ember.RSVP.hash({
            experiment: this.store.findRecord('experiment', params.experiment_id),
            account: this.get('sessionAccount').loadCurrentUser()  // TODO: Is this necessary (see application route)
        });
    },
    resetController: function(controller, isExiting) {
        if (isExiting) {
            controller.set('selectedChildId', null);
        }
    }
});
