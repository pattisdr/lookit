import Ember from 'ember';
import ENV from 'lookit-base/config/environment';

export default Ember.Component.extend({
  namespace: ENV.JAMDB.namespace,
  collection: ENV.JAMDB.collection,

  username: null,
  password: null,

  actions: {
    authenticate() {
        this.get('login')({
            provider: 'self',
            username: this.get('username'),
            password: this.get('password'),
            namespace: this.get('namespace'),
            collection: this.get('collection'),
        });
    }
  }
});
