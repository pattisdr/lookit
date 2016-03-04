import Ember from 'ember';
// Do we want/need this?
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: service('session'),
    sessionAccount: service('session-account'),

    model(params) {
        return Ember.RSVP.hash({
            experiment: this.store.findRecord('experiment', params.experiment_id),
            user: this.store.findRecord('account', this.get('sessionAccount').account.id)
        });
    }
});
