import Ember from 'ember';

export default Ember.Route.extend({
    sessionAccount: Ember.inject.service('session-account'),
    model(params) {
        return Ember.RSVP.hash({
            experiment: this.store.findRecord('experiment', params.experiment_id),
            account: this.get('sessionAccount.account')
        });
    }
});
