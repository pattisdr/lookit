import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    sessionAccount: Ember.inject.service(),
    selectedChildId: null,
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
