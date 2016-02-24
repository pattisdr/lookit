import Ember from 'ember';
import config from 'ember-get-config';

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

        },
        createAccount(attrs) {
            var newAccount = this.store.createRecord('account', {
                username: attrs.username,
                password: attrs.password,
                // Update the line below to be more general
                id: 'experimenter.accounts.' + attrs.username
            });
            newAccount.save().then(() => {
            // log in immediately with this new account information
                var theAttrs = {provider: 'self', namespace: 'experimenter', collection: 'accounts', username: attrs.username, password: attrs.password};
                this.send('authenticate',theAttrs);
            });
        }
    }                                   
});
