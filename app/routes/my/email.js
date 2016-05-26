import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    model() {
        return this.modelFor('my');
    },
    setupController(controller, model) {
	model.getSupressions().then(res => {
	    debugger;
	});
    }
});
