import Ember from 'ember';
import ENV from 'lookit-base/config/environment';

export default Ember.Component.extend({
    namespace: ENV.JAMDB.namespace,
    collection: ENV.JAMDB.collection,

    username: null,
    password: null,
    email: null,

    maySubmit: Ember.computed('username', 'password', 'email', function () {
        return ['username', 'password', 'email']
            .map(k => this.get(k))
            .reduce((acc, val) => acc && val);
    }),

    actions: {
        createAccount() {
            this.get('create')({
                username: this.get('username'),
                password: this.get('password'),
                email: this.get('email')
                // Add fields for permissions and history?
            });
            return false;
        }
    }
});
