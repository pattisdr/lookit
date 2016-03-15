import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    toast: Ember.inject.service(),
    isValid: function() {
        if (!Ember.isEmpty(this.get('newFirstName')) && !Ember.isEmpty(this.get('newBirthday'))) {
            return true;
        }
        return false;
    }.property('newFirstName', 'newBirthday'),
    actions: {
        // To add a new profile in the Children Information tab
        createProfile: function() {
            var firstName = this.get('newFirstName');
            var birthday = new Date(this.get('newBirthday'));
            var profileId = this.get('model.username') + "." + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

            var profile = {"birthday": birthday, "firstName": firstName, "profileId": profileId};

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
        },
        cancel: function() {
            this.set('newFirstName','');
            this.set('newBirthday','');
        }
    }
});
