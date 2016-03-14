import Ember from 'ember';

import ENV from 'lookit-base/config/environment';


export default Ember.Service.extend({
    account: null,
    profile: null,

    session: Ember.inject.service('session'),
    store: Ember.inject.service(),

    loadCurrentUser() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            const accountId = this.get('session.data.authenticated.id');
            if (!Ember.isEmpty(accountId)) {
                return this.get('store').findRecord('account', `${ENV.JAMDB.namespace}.accounts.${accountId}`).then((account) => {
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
