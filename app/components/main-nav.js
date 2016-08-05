import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service('session'),
    sessionAccount: Ember.inject.service('session-account'),
    accountName: Ember.computed.alias('sessionAccount.account.name'),
    actions: {
        logout() {
            Ember.getOwner(this).lookup('controller:application').send('logout');
        }
    }
});
