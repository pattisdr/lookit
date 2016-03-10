import Ember from 'ember';

export default Ember.Component.extend({
    showFeedback: false,
    feedbackText: 'Show Feedback',
    actions: {
        toggleFeedback: function() {
            this.toggleProperty('showFeedback');
            if (this.get('showFeedback')) {
                this.send('updateFeedbackText', 'Hide Feedback');
            } else {
                this.send('updateFeedbackText', 'Show Feedback');
            }

        },
        updateFeedbackText: function(text) {
            this.set('feedbackText', text);
        }
    }
});
