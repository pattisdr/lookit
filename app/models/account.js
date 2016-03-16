import Ember from 'ember';
import DS from 'ember-data';
import Account from 'exp-models/models/account';

const DEMOGRAPHIC_FIELDS = ['demographicsLanguagesSpokenAtHome','demographicsNumberOfChildren','demographicsChildrenBirthDates','demographicsNumberOfGuardians','demographicsNumberOfGuardiansExplanation','demographicsRaceIdentification','demographicsAge','demographicsGender','demographicsEducationLevel','demographicsSpouseEducationLevel','demographicsAnnualIncome','demographicsWillingToBeContactedForSimilarStudies','demographicsCanScheduleAnAppointment', 'demographicsNumberOfBooks', 'demographicsAdditionalComments'];

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
    demographicsNumberOfBooks: DS.attr('number'),
    demographicsAdditionalComments: DS.attr('string'),

    hasCompletedSurvey: Ember.computed.or(...DEMOGRAPHIC_FIELDS)
});
