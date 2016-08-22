import Ember from 'ember';
import moment from 'moment';

export function age([bd, ]) {
    let monthsOld = moment().diff(bd, 'months');
    if (monthsOld >= 12) {
	return moment().from(bd, 'years');
    } else {
	return moment(bd).fromNow(true);
    }
}

export default Ember.Helper.helper(age);
