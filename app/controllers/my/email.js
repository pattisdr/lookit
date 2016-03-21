import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        saveEmailPreferences: function() {
            this.get('model').save().then(() => {
                this.toast.info('Email preferences saved successfully.');
            });
        }
    }
});
