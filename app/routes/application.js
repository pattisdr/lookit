import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const {
    service
} = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
    session: service('session'),
    sessionAccount: service('session-account'),
    sessionAuthenticated() {
        this._super(...arguments);
        this.get('sessionAccount').loadCurrentUser().catch(() => this.get('session').invalidate());
    }
});
