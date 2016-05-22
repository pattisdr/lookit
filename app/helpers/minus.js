import Ember from 'ember';

export function minus([root, difference] /*, hash*/ ) {
    return root - (difference || 0);
}

export default Ember.Helper.helper(minus);
