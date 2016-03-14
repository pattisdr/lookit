import Ember from 'ember';

var PLACEHOLDER = 'Loading...';

export default Ember.Component.extend({
    session: null,

    showFeedback: false,
    feedbackText: 'Show Feedback',

    store: Ember.inject.service(),

    _profileName: PLACEHOLDER,  // Show... something... until data has fully loaded
    profileName: Ember.computed('_profileName', function() {
        return this.get('_profileName');
    }),

    /*
        On component creation, fetch the username associated with a specific profile
     */
    init() {
        this._super(...arguments);

        let session = this.get('session');
        let profileId = session.get('profileId');

        // Fetch name associated with profile, then update page
        this.get('store').queryRecord('account', {'filter[profiles.profileId]': profileId})
            .then((res) => {
                let profile = res[0].profileById(profileId);
                this.set('_profileName', profile.firstName);
            });
    },

    actions: {
        toggleFeedback: function() {
            this.toggleProperty('showFeedback');
            if (this.get('showFeedback')) {
                this.send('updateFeedbackText', 'Hide Feedback');
                var session = this.get('session');
                session.set('hasReadFeedback', true);
                session.save().then(this.set('session', session));
            } else {
                this.send('updateFeedbackText', 'Show Feedback');
            }

        },
        updateFeedbackText: function(text) {
            this.set('feedbackText', text);
        }
    }
});
