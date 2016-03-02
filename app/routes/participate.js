import Ember from 'ember';
// Do we want/need this?
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    
    model() {
        var activeExperiments =  this.store.query('experiment', {'filter[state]': 'Active'});
        if(this.get('sessionAccount').account !== undefined) {
            var currentUser = this.store.findRecord('account', this.get('sessionAccount').account.id);
            var promises = {experiments: activeExperiments, user: currentUser};
            return Ember.RSVP.hash(promises);
        }
       return this.store.query('experiment', {'filter[state]': 'Active'});
    }
});
