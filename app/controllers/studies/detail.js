import Ember from 'ember';

export default Ember.Controller.extend({
    sessionAccount: Ember.inject.service(),
    pickingChild: false,
    actions: {
        participate: function() {
            this.set('pickingChild', true);
        },
        cancelPickChild: function() {
            this.set('pickingChild', false);
        },
        pickChild: function(profileId) {
            var account = this.get('sessionAccount').get('account');
            var profile = account.profileById(profileId);
            this.get('sessionAccount').setProfile(profile);
            this.transitionToRoute('participate', this.get('model.experiment.id'));
        }
    }
});
