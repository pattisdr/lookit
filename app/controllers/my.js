import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    isEditing: false,
    
    actions: {
        // To add a new profile in the Children Information tab
        createProfile: function() {
            
            var firstName = this.get('newFirstName');
            var lastName = this.get('newLastName');
            var birthday = new Date(this.get('newBirthday'));
            var profileId = this.get('model.username') + "." + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
            
            var profile = {"birthday": birthday, "firstName": firstName, "lastName": lastName, "profileId": profileId};
            
            if (this.get('model.profiles').length != 0) {
                console.log(this.get('model.profiles'));
                this.get('model.profiles').pushObject(profile);
            }
            else {
                this.set('model.profiles',[]);
                this.get('model.profiles').pushObject(profile);
            }
            
            
            this.get('model').save();
            
            // Reset input fields
            this.set('newFirstName','');
            this.set('newLastName','');
            this.set('newBirthday','');
        },
        edit: function() {
            this.toggleProperty('isEditing');
        },
        // To edit an existing profile
        editProfile: function(profile) {
            // NOTE: To set properties on a JS object (NOT Ember object), must use Ember.set
            Ember.setProperties(profile, {'firstName': this.get('editFirstName'),'lastName': this.get('editLastName'),'birthday': new Date(this.get('editBirthday'))});
         
            this.get('model').save();

            this.set('editFirstName','');
            this.set('editLastName','');
            this.set('editBirthday','');
            this.send('edit');
        }
    }
});
