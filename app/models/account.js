import Ember from 'ember';
import DS from 'ember-data';
import Account from 'exp-models/models/account';

import config from 'ember-get-config';

const DEMOGRAPHIC_FIELDS = ['demographicsLanguagesSpokenAtHome', 'demographicsNumberOfChildren', 'demographicsNumberOfGuardians', 'demographicsNumberOfGuardiansExplanation', 'demographicsRaceIdentification', 'demographicsAge', 'demographicsGender', 'demographicsEducationLevel', 'demographicsSpouseEducationLevel', 'demographicsAnnualIncome', 'demographicsWillingToBeContactedForSimilarStudies', 'demographicsCanScheduleAnAppointment', 'demographicsNumberOfBooks', 'demographicsAdditionalComments'];

const ASM_MAPPING = {
    nextSession: {
        label: 'Next Session',
        descrtiption: 'It\'s time for another session of a study we are currently participating in',
        id: '911'
    },
    newStudies: {
        label: 'New Studies',
        description: 'A new study is available for one of my children',
        id: '913'
    },
    resultsPublished: {
        label: 'Results Published',
        description: 'The results of a study we participated in are published',
        id: '915'
    }
};

export default Account.extend({
    email: DS.attr('string'),
    mustResetPassword: DS.attr('boolean'),

    demographicsNumberOfChildren: DS.attr('string'),
    demographicsChildBirthdays: DS.attr('dateList'),
    demographicsLanguagesSpokenAtHome: DS.attr('string'),
    demographicsNumberOfGuardians: DS.attr('string'),
    demographicsNumberOfGuardiansExplanation: DS.attr('string'),
    demographicsRaceIdentification: DS.attr('string'),
    demographicsAge: DS.attr('string'),
    demographicsGender: DS.attr('string'),
    demographicsEducationLevel: DS.attr('string'),
    demographicsSpouseEducationLevel: DS.attr('string'),
    demographicsAnnualIncome: DS.attr('string'),
    demographicsWillingToBeContactedForSimilarStudies: DS.attr('string'),
    demographicsCanScheduleAnAppointment: DS.attr('string'),
    demographicsNumberOfBooks: DS.attr('number'),
    demographicsAdditionalComments: DS.attr('string'),

    hasCompletedSurvey: Ember.computed.or(...DEMOGRAPHIC_FIELDS),

    suppressionsUrl: Ember.computed('email', function() {
	var email = this.get('email');
        var groups = Object.keys(ASM_MAPPING).map(key => {
            return `group[]=${ASM_MAPPING[key].id}`;
        }).join('&');
	return `${config.JAMDB.url}/v1/id/collections/${config.JAMDB.namespace}.accounts/user?email=${email}&${groups}`;
    }),
    getSuppressions() {
	var url = this.get('suppresionsUrl');
	var adapter = this.store.adapterFor('application');
	return adapter.ajax(
	    url,
	    'GET',
	    adapter.ajaxOptions(
		url,
		'GET'
	    )
	).then(res => {
	    debugger;
	});
    },
    setSuppressions(suppressionsHash) {
	var url = this.get('suppresionsUrl');
	var adapter = this.store.adapterFor('application');
	return adapter.ajax(
	    url,
	    'PATCH',
	    adapter.ajaxOptions(
		url,
		'PATCH',
		{
		    data: {
			type: "supressions",
			attributes: suppressionsHash
		    }
		}
	    )
	).then(res => {
	    debugger;
	});

    }
});
