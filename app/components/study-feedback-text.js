import Ember from 'ember';


export default Ember.Component.extend({
    session: null,
    sessionAccount: Ember.inject.service('session-account'),

    showFeedback: false,
    feedbackText: 'Show Feedback',

    store: Ember.inject.service(),

    profileName: null,

    /*
        On component creation, fetch the username associated with a specific profile
     */
    init() {
        this._super(...arguments);

        this.get('sessionAccount').loadCurrentUser((account) => {
            let profile = account.profileById(this.get('session.profileId'));
            this.set('profileName', `${profile.firstName}`); // TODO: Name format should disambiguate
        });
    },

    actions: {
        toggleFeedback: function() {
            this.toggleProperty('showFeedback');
            if (this.get('showFeedback')) {
                this.set('feedbackText', 'Hide Feedback');
                var session = this.get('session');
                session.set('hasReadFeedback', true);
                session.save().then(this.set('session', session));
            } else {
                this.set('feedbackText', 'Show Feedback');
            }

        }
    }
});
