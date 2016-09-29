import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),
    sessionAuthenticated() {
        this._super(...arguments);
        this.get('sessionAccount').loadCurrentUser().catch(() => this.get('session').invalidate());
    }
});
