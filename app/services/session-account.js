import Ember from 'ember';

export default Ember.Service.extend({
    account: null,
    profile: null,

    session: Ember.inject.service('session'),
    store: Ember.inject.service(),

    _setAccount() {
        const accountId = this.get('session.data.authenticated.id');
        if (!Ember.isEmpty(accountId)) {
            this.get('store').findRecord('account', accountId).then((account) => {
                this.set('account', account);
            });
        }
    },
    init() {
        var session = this.get('session');
        session.on('invalidationSucceeded', () => {
            this.setProperties({
                account: null,
                profile: null
            });
        });
        session.addObserver('isAuthenticated', this, this._setAccount);
        if (session.get('isAuthenticated')) {
            this._setAccount();
        }
    },

    loadCurrentUser() {
        return new Ember.RSVP.Promise((resolve) => {
            if (!this.get('session.isAuthenticated')) {
                return resolve(null);
            }
            return resolve(this.get('account'));
        });
    },
    setProfile: function(profile) {
        this.set('profile', profile);
    }
});
