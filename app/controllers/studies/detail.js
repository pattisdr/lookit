import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    sessionAccount: Ember.inject.service(),
    selectedChildId: null,

    route: function() {
        return `${Ember.getOwner(this).lookup('router:main').get('currentPath')}:${this.get('model.experiment.id')}`;
    }.property('model'),

    actions: {
        pickChild: function() {
            var account = this.get('sessionAccount').get('account');
            var profile = account.profileById(this.get('selectedChildId'));
            // TODO consolidate
            this.get('sessionAccount').setProfile(profile);
            this.get('session').set('data.profile', profile);
            this.transitionToRoute('participate', this.get('model.experiment.id'));
        }
    }
});
