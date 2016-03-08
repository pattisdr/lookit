import Ember from 'ember';
import ENV from 'lookit-base/config/environment';

export default Ember.Component.extend({
  namespace: ENV.JAMDB.namespace,
  collection: ENV.JAMDB.collection,

  username: null,
  password: null,
    email: null,

  actions: {
    createAccount() {
      this.get('create')({
        username: this.get('username'),
        password: this.get('password'),
          email: this.get('email')
//        Add fields for permissions and history?
      });
      return false;
    }
  }
});
