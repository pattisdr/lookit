import Ember from 'ember';

export default Ember.Component.extend({
    session: null,

    showFeedback: false,
    feedbackText: 'Show Feedback',
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
