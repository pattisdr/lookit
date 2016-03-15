import Ember from 'ember';

const {bcrypt} = dcodeIO;

export default Ember.Controller.extend({
    _error: null,
    oldPass: null,
    newPass: null,
    confirmPass: null,
    toast: Ember.inject.service(),

    passMatch: function() {
        this.set('_error')
        return this.get('newPass') === this.get('confirmPass');
    }.property('newPass', 'confirmPass'),

    canUpdate: function() {
        return this.get('passMatch') && ['oldPass', 'newPass', 'confirmPass']
            .map(attr => this.get(attr))
            .reduce((acc, val) => !Ember.isEmpty(val) && acc, true);
    }.property('passMatch', 'oldPass', 'newPass', 'confirmPass'),

    actions: {
        save() {
            this.get('model').save().then(() => {
                this.toast.info('Account updated successfully.');
            });
        },
        cancel() {
            this.get('model').rollbackAttributes();
        },
        updatePassword() {
            if (!bcrypt.compareSync(this.get('oldPass'), this.get('model.password'))) {
                this.set('_error', 'Incorrect password');
                return;
            }

            this.set('model.password', bcrypt.hashSync(this.get('newPass'), 10).replace('$2a$', '$2b$'));
            this.get('model').save().then(() => {
                this.set('_error', null);
                this.set('oldPass', null);
                this.set('newPass', null);
                this.set('confirmPass', null);
                this.toast.info('Password updated successfully.');
            }, () => {
                this.set('_error', 'Could not update password');
            });
        }
    }
});
