import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),

    model() {
        return this.get('sessionAccount').load();
    },
    beforeModel(transition) {
        if (transition.queryParams.access_token) {
            return this.get('session')
                .authenticate('authenticator:jam-jwt', {}, transition.queryParams.access_token)
                .then(() => {
                    window.location.hash = '';
                    return this._super(...arguments);
                });
        }
        return this._super(...arguments);
    }
});
