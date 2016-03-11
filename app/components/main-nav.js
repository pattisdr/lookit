import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service('session'),
    actions: {
        logout() {
            this.container.lookup('controller:application').send('logout');
        }
    }
});
