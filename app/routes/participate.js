import Ember from 'ember';
// Do we want/need this?
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import ExpPlayerRouteMixin from 'exp-player/mixins/exp-player-route';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, ExpPlayerRouteMixin, {
    sessionAccount: service('session-account'),

    _getExperiment(params) {
        return this.store.findRecord('experiment', Ember.get(params, 'experiment_id'));
    },
    model (params) {
        if (!this.get('sessionAccount.profile')) {
            this.transitionTo('studies.detail', Ember.get(params, 'experiment_id'));
        }
        return this._super(params);
    }
});
