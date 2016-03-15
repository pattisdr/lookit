import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service('session'),
    actions: {
        logout() {
            Ember.getOwner(this).lookup('controller:application').send('logout');
        }
    }
});
