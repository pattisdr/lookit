import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    isParticipate: Ember.computed('currentPath', function() {
        return this.get('currentPath') === 'participate';
    }),
    actions: {
        logout() {
            this.get('session').invalidate().then(() => {
                this.transitionToRoute('home');
            });
        }
    }
});
