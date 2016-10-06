import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    sessionAccount: Ember.inject.service(),

    /**
     * @method logout A passed in closure action
     */
    logout: null,

    // TODO: Check the meaning of the name field. Is it still being used at all?
    // Placeholder: account will be set when session auth state changes
    account: null,
    accountName: Ember.computed.alias('account.username'),

    updateAccount: Ember.observer('session.isAuthenticated', function () {
        let foundUser;
        if (!this.get('session.isAuthenticated')) {
            foundUser = null;
        } else {
            this.get('sessionAccount')
                .load().then(account => {foundUser = account;})
                .catch(() => {foundUser = null;});
        }
        this.set('account', foundUser);
    })
});
