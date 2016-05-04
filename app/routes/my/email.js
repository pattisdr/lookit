import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return this.modelFor('my');
    },
    beforeModel(transition) {
	if (transition.queryParams.token) {
	    this.get('session')
                .authenticate('authenticator:jam-jwt', {}, transition.queryParams.token)
		.then(() => this.transitionTo('my.email'));
	}
	this._super(...arguments);
    }
});
