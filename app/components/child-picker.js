import Ember from 'ember';

export default Ember.Component.extend({
    account: null,
    isShowing: false,
    selectedChild: null,
    children: Ember.computed.alias('account.profiles')
});
