import Ember from 'ember';

export default Ember.Component.extend({
    account: null,

    onSelect: null,
    onCancel: null,

    selectedChild: null,
    canSelect: Ember.computed('selectedChild', function() {
        return this.get('selectedChild') !== null;
    }),
    children: Ember.computed.alias('account.profiles'),
    actions: {
        selectChild: function() {
            this.get('onSelect')(this.get('selectedChild'));
        },
        cancel: function() {
            this.get('onCancel')();
        }
    }
});
