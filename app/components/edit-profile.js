import Ember from 'ember';

export default Ember.Component.extend({
    firstName: Ember.computed(function() {
        return this.profile.firstName;
    }),
    birthday: Ember.computed(function() {
        return this.profile.birthday;
    }),
    isDirty: Ember.computed('firstName', 'birthday', function() {
        if (this.get('firstName') !== this.get('profile.firstName') || this.get('birthday') !== this.get('profile.birthday')) {
            return true;
        }
        return false;
    }),
    isValid: Ember.computed('firstName', 'birthday', function() {
        if (!Ember.isEmpty(this.get('firstName')) && !Ember.isEmpty(this.get('birthday'))) {
            return true;
        }
        return false;
    }),
    actions: {
        save: function(profile) {
            Ember.setProperties(profile, {'firstName': this.get('firstName'),'birthday': new Date(this.get('birthday'))});
            this.get('model').save().then(() => {
                this.toast.info('Child profile updated successfully.');
            });
        },
        cancel: function(profile) {
            this.set('firstName', profile.get('firstName'));
            this.set('birthday', profile.get('birthday'));
        },
        delete: function(profile) {
            if (this.get('model.profiles').length !== 0) {
                this.get('model.profiles').removeObject(profile);
            }
            else {
                console.log('No profiles to delete.')
            }

            this.get('model').save().then(() => {
                this.toast.info('Child profile deleted successfully.');
            });
        }
    }
});
