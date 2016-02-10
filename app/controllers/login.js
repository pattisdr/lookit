import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service('session'),
    queryParams: ['driver'],
    driver: 'jam-auth',
    
    actions: {
        authenticate(attrs,router) {
            this.get('session').authenticate('authenticator:jam-jwt',attrs).then(() => {
                this.get('target').transitionTo('home');
            });
        },
        invalidateSession() {
            this.get('session').invalidate().then(() => {
                this.get('target').transitionTo('home');
            });
        }
    }
                                       
});
