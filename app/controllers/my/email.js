import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    isDirty: false,
    actions: {
        saveEmailPreferences: function() {
            var model = this.get('model');

            Ember.setProperties(model.get('emailPreferencesResearcherQuestions'), this.get('emailPreferencesResearcherQuestions'));
            Ember.setProperties(model.get('emailPreferencesNewStudies'), this.get('emailPreferencesNewStudies'));
            Ember.setProperties(model.get('emailPreferencesResultsPublished'), this.get('emailPreferencesResultsPublished'));

            model.save().then(() => {
                this.toast.info('Email preferences saved successfully.');
            });
        }
    }
});
