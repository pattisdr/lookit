import Ember from 'ember';

export default Ember.Component.extend({
    ageRange: Ember.computed('experiment', function() {
	let {
	    eligibilityMinAge,
	    eligibilityMaxAge
	} = this.getProperties('eligibilityMinAge', 'eligibilityMaxAge');

	if (eligibilityMinAge && eligibilityMaxAge) {
	    return `between ${eligibilityMinAge} and ${eligibilityMaxAge}`;
	} else if (eligibilityMinAge) {
	    return `${eligibilityMinAge} and up`;
	} else if (eligibilityMaxAge) {
	    return `not older than ${eligibilityMaxAge}`;
	} else {
	    return 'any';
	}
    })
});
