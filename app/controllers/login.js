import Ember from 'ember';

export default Ember.Controller.extend({
    modal: false,
    session: Ember.inject.service('session'),

    actions: {
        authenticate(attrs) {
            var me = this;
            var target = me.get('target');
            me.get('session').authenticate('authenticator:jam-jwt',attrs).then(
                function() {
                    target.transitionTo('home');
                }, function() {
                    me.send('toggleUserNotFound');
                }
            );
        },
        toggleUserNotFound() {
            this.toggleProperty('userNotFound');
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
                email: attrs.email,
                profiles: [],
                // Update the line below to be more general
                id: 'experimenter.accounts.' + attrs.username
            });
            newAccount.save().then(() => {
                    // log in immediately with this new account information
                    var theAttrs = {provider: 'self', namespace: 'experimenter', collection: 'accounts', username: attrs.username, password: attrs.password};
                    this.send('authenticate',theAttrs);
            }, () => {
                this.send('toggleUserConflict');
            });
        },
        toggleUserConflict() {
            this.toggleProperty('userConflict');
        }
    }
});

