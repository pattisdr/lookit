import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    sessionAccount: service('session-account'),
    model: null,

    store: Ember.inject.service(),
    isDirty: function() {
        // TODO: check the session model to see if it contains unsaved data
        var session = this.get('session');
        return session.get('hasDirtyAttributes');
    },
    actions: {
        saveSession(payload, callback) {
            // Save a provided javascript object to a session object
            var session = this.get('session');
            session.setProperties(payload);
            session.save().then(callback);
            this.set('session', session);
        }
    },
    _session: null,
    session: Ember.computed('model.experiment', {
        get: function() {
            var session = this.get('store').createRecord(this.get('model.experiment.sessionCollectionId'), {
                experimentId: this.get('model.experiment.id'),
                profileId: '',
                profileVersion: '',
                softwareVersion: ''
            });
            this.get('model.experiment').getCurrentVersion().then(function(versionId) {
                session.set('experimentVersion', versionId);
            });
            this.set('session', session);
            return session;
        },
        set: function(_, session) {
            this.set('_session', session);
            return session;
        }
    })
});
