import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    isDirty: false,
    actions: {
        saveEmailPreferences: function() {
            this.get('model').save().then(() => {
                this.toast.info('Email preferences saved successfully.');
            });
        }
    }
});
