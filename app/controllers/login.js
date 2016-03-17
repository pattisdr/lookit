import Ember from 'ember';

import config from 'ember-get-config';

export default Ember.Controller.extend({
    modal: false,
    session: Ember.inject.service('session'),

    invalidAuth: false,
    userConflict: false,
    creatingUser: false,
    actions: {
        authenticate(attrs) {
            this.get('session').authenticate('authenticator:jam-jwt', attrs).catch(() => this.send('toggleInvalidAuth'));
        },
        toggleInvalidAuth() {
            this.toggleProperty('invalidAuth');
        },
        createAccount(attrs) {
            this.set('creatingUser', true);
            var newAccount = this.store.createRecord('account', {
                username: attrs.username,
                password: attrs.password,
                email: attrs.email,
                profiles: [],
                // Update the line below to be more general
                id: `${attrs.username}`
            });
            newAccount.save().then(() => {
                // log in immediately with this new account information
                var theAttrs = {provider: 'self', namespace: config.JAMDB.namespace, collection: 'accounts', username: attrs.username, password: attrs.password};
                this.send('authenticate', theAttrs);
            }, (res) => {
                this.set('creatingUser', false);
                if(res.errors[0].status === '409') {
                    this.send('toggleUserConflict');
                }
                else {
                    this.send('toggleInvalidAuth');
                }
            });
        },
        toggleUserConflict() {
            this.toggleProperty('userConflict');
        },
        toggleCreatingUser() {
            this.toggleProperty('creatingUser');
        }
    }
});
