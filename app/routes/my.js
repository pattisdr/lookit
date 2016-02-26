
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: service('session'),
    sessionAccount: service('session-account'),
    
    model(/*params*/) {
        return this.store.findRecord('account', this.get('sessionAccount').account.id);  
    }
        
});