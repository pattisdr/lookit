import Ember from 'ember';

import ExpPlayer from 'exp-player/components/exp-player';

let {
    $
} = Ember;

export default ExpPlayer.extend({
    toast: Ember.inject.service(),

    fullScreenElementId: 'expContainer',
    
    allowExit: false,
    hasAttemptedExit: false,    
    _registerHandlers() {
        $(window).on('beforeunload', () => {
            if (!this.get('allowExit')) {
                this.set('hasAttemptedExit', true);
                this.send('exitFullscreen');
                let toast = this.get('toast');
                toast.warning('To leave the study early, press F1 and then select a privacy level for your videos');
                return `
If you're sure you'd like to leave this study early
you can do so now.

We'd appreciate it if before you leave you fill out a
very breif exit survey letting us know how we can use
any video captured during this session. Press 'Stay on
this Page' and you will be prompted to go to this
exit survey.

If leaving this page was an accident you will be
able to continue the study.
`;
            }
            return null;
        });
        $(window).on('keyup', (e) => {
            console.log(e.which);
            if (e.which === 112) {
                this.send('exitEarly');
            }
        });
    },
    _removeHandlers() {
        $(window).off('keypress');
        $(window).off('beforeunload');
    },
    onFrameIndexChange: Ember.observer('frameIndex', function() {
        var max = this.get('frames.length') - 1;
        var frameIndex = this.get('frameIndex');
        if (frameIndex === max) {
            this._removeHandlers();
        }
    }),
    willDestroy() {
        this._super(...arguments);
        this._removeHandlers();
    },

    init: function() {
        this._registerHandlers();
        this._super(...arguments);
    }
});
