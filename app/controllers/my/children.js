import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    toast: Ember.inject.service(),
    isValid: Ember.computed('newFirstName', 'newBirthday', 'newGender', 'newAgeAtBirth', function() {
        if (!Ember.isEmpty(this.get('newFirstName')) && !Ember.isEmpty(this.get('newBirthday')) && !Ember.isEmpty(this.get('newGender')) && !Ember.isEmpty(this.get('newAgeAtBirth'))) {
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
    newAgeAtBirth: null,
    actions: {
        // To add a new profile in the Children Information tab
        createProfile: function() {
            $('.collapse').collapse("hide");
            var firstName = this.get('newFirstName');
            var birthday = new Date(this.get('newBirthday'));
            var profileId = this.get('model.username') + "." + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
            var gender = this.get('newGender');
            var ageAtBirth = this.get('newAgeAtBirth');

            var profile = {"birthday": birthday, "firstName": firstName, "profileId": profileId, "gender": gender, "ageAtBirth": ageAtBirth};

            if (this.get('model.profiles').length !== 0) {
                this.get('model.profiles').pushObject(profile);
            }
            else {
                this.set('model.profiles',[]);
                this.get('model.profiles').pushObject(profile);
            }

            this.get('model').save().then(() => {
                this.toast.info('Profile created successfully.');
            });

            // Reset input fields
            this.set('newFirstName','');
            this.set('newBirthday','');
            this.set('newGender', null);
            this.set('newAgeAtBirth', null);
        },
        cancel: function() {
            this.set('newFirstName','');
            this.set('newBirthday','');
            this.set('newGender', null);
            this.set('newAgeAtBirth', null);
        }
    }
});
