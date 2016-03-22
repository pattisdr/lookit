import Ember from 'ember';
import DS from 'ember-data';
import Account from 'exp-models/models/account';

const DEMOGRAPHIC_FIELDS = ['demographicsLanguagesSpokenAtHome','demographicsNumberOfChildren','demographicsNumberOfGuardians','demographicsNumberOfGuardiansExplanation','demographicsRaceIdentification','demographicsAge','demographicsGender','demographicsEducationLevel','demographicsSpouseEducationLevel','demographicsAnnualIncome','demographicsWillingToBeContactedForSimilarStudies','demographicsCanScheduleAnAppointment', 'demographicsNumberOfBooks', 'demographicsAdditionalComments'];

export default Account.extend({
    email: DS.attr('string'),
    mustResetPassword: DS.attr('boolean'),

    emailPreferencesNextSession: DS.attr('boolean', {defaultValue: true}),
    emailPreferencesNewStudies: DS.attr('boolean', {defaultValue: true}),
    emailPreferencesResultsPublished: DS.attr('boolean', {defaultValue: true}),
    emailPreferencesOptOut: DS.attr('boolean', {defaultValue: false}),

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

    hasCompletedSurvey: Ember.computed.or(...DEMOGRAPHIC_FIELDS)
});
