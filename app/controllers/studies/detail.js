import Ember from 'ember';

export default Ember.Controller.extend({
    pickingChild: false,
    actions: {
        participate: function() {
            this.set('pickingChild', true);
        }
    }
});
