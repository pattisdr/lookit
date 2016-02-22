import Ember from 'ember';
import ENV from 'lookit-base/config/environment';

export default Ember.Component.extend({
  namespace: ENV.auth.self.defaultNamespace,
  collection: ENV.auth.self.defaultCollection,

  username: null,
  password: null,

  actions: {
    createAccount() {
      this.get('create')({
        username: this.get('username'),
        password: this.get('password')
//        Add fields for permissions and history?
      });
      return false;
    }
  }
});