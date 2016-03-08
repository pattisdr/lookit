import Ember from 'ember';

export default Ember.Controller.extend({
    sessionAccount: Ember.inject.service(),
    selectedChildId: null,
    actions: {
        pickChild: function() {
            var account = this.get('sessionAccount').get('account');
            var profile = account.profileById(this.get('selectedChildId'));
            this.get('sessionAccount').setProfile(profile);
            this.transitionToRoute('participate', this.get('model.experiment.id'));
        }
    }
});
