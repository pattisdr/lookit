import DS from 'ember-data';
import Account from 'exp-models/models/account';

export default Account.extend({
    email: DS.attr('string'),
    mustResetPassword: DS.attr('boolean'),
    emailPreferencesResearcherQuestions: DS.attr('boolean'),
    emailPreferencesNewStudies: DS.attr('boolean'),
    emailPreferencesResultsPublished: DS.attr('boolean'),
    demographicsLanguagesSpokenAtHome: DS.attr('string'),
    demographicsNumberOfChildren: DS.attr('string'),
    demographicsChildrenBirthDates: DS.attr('string'),
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
    demographicsAdditionalComments: DS.attr('string'),
    
    hasCompletedSurvey: Ember.computed('demographicsLanguagesSpokenAtHome', function() {
        if ((this.get('demographicsLanguagesSpokenAtHome') || this.get('demographicsNumberOfChildren') || this.get('demographicsChildrenBirthDates') || this.get('demographicsNumberOfGuardians') || this.get('demographicsRaceIdentification') ||  this.get('demographicsAge') || this.get('demographicsGender') || this.get('demographicsEducationLevel') || this.get('demographicsSpouseEducationLevel') || this.get('demographicsAnnualIncome') || this.get('demographicsWillingToBeContactedForSimilarStudies') ||  this.get('demographicsCanScheduleAnAppointment') || this.get('demographicsAdditionalComment')) !== undefined) {
            return true;
        }
        else {
            return false;
        }
    })
    
});
