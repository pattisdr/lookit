import Ember from 'ember';

export function minus([root, difference] /*, hash*/ ) {
    return root - difference;
}

export default Ember.Helper.helper(minus);
