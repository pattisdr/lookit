import Ember from 'ember';

export default Ember.Component.extend({
    firstName: Ember.computed(function() {
        return this.profile.firstName;
    }),
    birthday: Ember.computed(function() {
        return this.profile.birthday;
    }),
    gender: Ember.computed(function() {
        return this.profile.gender || null;
    }),
    ageAtBirth: Ember.computed(function() {
        return this.profile.ageAtBirth || null;
    }),
    isDirty: Ember.computed('firstName', 'birthday', 'gender', 'ageAtBirth', function() {
        if (this.get('firstName') !== this.get('profile.firstName') || this.get('birthday') !== this.get('profile.birthday') || this.get('gender') !== this.get('profile.gender') || this.get('ageAtBirth') !== this.get('profile.ageAtBirth')) {
            return true;
        }
        return false;
    }),
    isValid: Ember.computed('firstName', 'birthday', 'gender', 'ageAtBirth', function() {
        if (!Ember.isEmpty(this.get('firstName')) && !Ember.isEmpty(this.get('birthday')) && !Ember.isEmpty(this.get('gender')) && !Ember.isEmpty(this.get('ageAtBirth'))) {
            return true;
        }
        return false;
    }),
    actions: {
        save: function(profile) {
            Ember.setProperties(profile, {'firstName': this.get('firstName'),'birthday': new Date(this.get('birthday')), 'gender': this.get('gender'), 'ageAtBirth': this.get('ageAtBirth')});
            this.get('model').save().then(() => {
                this.toast.info('Child profile updated successfully.');
            });
        },
        cancel: function(profile) {
            this.set('firstName', profile.get('firstName'));
            this.set('birthday', profile.get('birthday'));
            this.set('gender', profile.get('gender'));
            this.set('ageAtBirth', profile.get('ageAtBirth'));
        },
        delete: function(profile) {
            if (this.get('model.profiles').length !== 0) {
                this.get('model.profiles').removeObject(profile);
            }
            else {
                console.log('No profiles to delete.');
            }

            this.get('model').save().then(() => {
                this.toast.info('Child profile deleted successfully.');
            });
        }
    }
});
