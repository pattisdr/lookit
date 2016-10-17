import Ember from 'ember';
import ExpPlayer from 'exp-player/components/exp-player';

export default ExpPlayer.extend({
    _registerHandlers() {
        this._super();
        Ember.$(window).on('keyup', (e) => {
            if (e.which === 112) { // F1 key
                this.send('exitEarly');
            }
        });
    },
    _removeHandlers() {
        Ember.$(window).off('keypress');
        return this._super();
    },
    actions: {
        exitEarly() {
            this.set('hasAttemptedExit', false);
            // Save any available data immediately
            this.send('setGlobalTimeEvent', 'exitEarly', {
                exitType: 'manualInterrupt',  // User consciously chose to exit, eg by pressing F1 key
                lastPageSeen: this.get('frameIndex') + 1
            });
            this.get('session').save();

            // Navigate to last page in experiment (assumed to be survey frame)
            var max = this.get('frames.length') - 1;
            this.set('frameIndex', max);
        },
    }
});
