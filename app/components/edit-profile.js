import Ember from 'ember';

export default Ember.Component.extend({
    profile: null,
    account: null,
    isDirty: Ember.computed.alias('profile.hasDirtyAttributes'),
    isValid: Ember.computed('profile.firstName', 'profile.birthday', 'profile.gender', 'profile.ageAtBirth', function() {
        if (!Ember.isEmpty(this.get('profile.firstName')) && !Ember.isEmpty(this.get('profile.birthday')) && !Ember.isEmpty(this.get('profile.gender')) && !Ember.isEmpty(this.get('profile.ageAtBirth'))) {
            return true;
        }
        return false;
    }),
    actions: {
        save: function(profile) {
            var account = this.get('account');
            var verb = 'updated';
            if (account.get('profiles').indexOf(profile) === -1) {
                account.get('profiles').unshiftObject(profile);
                verb = 'added';
                this.get('onAdd')();
            }

            this.get('account').save().then(() => {
                profile.save();
                this.toast.info(`Child profile ${verb} successfully.`);
            });
        },
        cancel: function(profile) {
            profile.rollbackAttributes();
        },
        delete: function(profile) {
            profile.set('deleted', true);
            this.get('account').save().then(() => {
                this.toast.info('Child profile deleted successfully.');
            });
        }
    }
});
