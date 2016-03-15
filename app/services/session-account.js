import Ember from 'ember';

const {
    inject: {
        service
    },
    RSVP
} = Ember;


export default Ember.Service.extend({
    account: null,
    profile: null,

    session: service('session'),
    store: service(),

    loadCurrentUser() {
        return new RSVP.Promise((resolve, reject) => {
            const accountId = this.get('session.data.authenticated.id');
            if (!Ember.isEmpty(accountId)) {
                return this.get('store').findRecord('account', accountId).then((account) => {
                    this.set('account', account);
                    resolve(account);
                }, reject);
            } else {
                return resolve();
            }
        });
    },
    setProfile: function(profile) {
        this.set('profile', profile);
    }
});
