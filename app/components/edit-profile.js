import Ember from 'ember';

export default Ember.Component.extend({
    firstName: function() {
        return this.profile.firstName;
    }.property(),
    birthday: function() {
        return this.profile.birthday;
    }.property(),
    isDirty: function() {
        if (this.get('firstName') !== this.get('profile.firstName') || this.get('birthday') !== this.get('profile.birthday')) {
            return true;
        }
        return false;
    }.property('firstName', 'birthday'),
    actions: {
        save: function(profile) {
            Ember.setProperties(profile, {'firstName': this.get('firstName'),'birthday': new Date(this.get('birthday'))});
            this.get('model').save();
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

            this.get('model').save();
        }
    }
});
