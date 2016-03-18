import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    store: service(),
    toast: service(),

    addingNew: false,
    notAddingNew: Ember.computed.not('addingNew'),
    profile: null,
    newProfile: function() {
        return this.get('store').createRecord('profile', {
            profileId: this.get('model').generateProfileId(),
            deleted: false
        });
    },

    onModelChange: Ember.observer('model', function() {
        this.set('profile', this.newProfile());
    }),
    isValid: Ember.computed('profile.firstName', 'profile.birthday', 'profile.gender', 'profile.ageAtBirth', function() {
        if (!Ember.isEmpty(this.get('profile.firstName')) && !Ember.isEmpty(this.get('profile.birthday')) && !Ember.isEmpty(this.get('profile.gender')) && !Ember.isEmpty(this.ge('profile.ageAtBirth'))) {
            return true;
        }
        return false;
    }),
    genderOptions: [
        'Male',
        'Female',
        'Other or prefer not to answer'
    ],
    ageAtBirthOptions: [
        'Under 24 Weeks',
        'Over 24 Weeks'
    ],
    actions: {
        profileAdded () {
            this.set('profile', this.newProfile());
            this.toggleProperty('addingNew');
        },
        toggleAddingNew () {
            this.toggleProperty('addingNew');
        }
    }
});
