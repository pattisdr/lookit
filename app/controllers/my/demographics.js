import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    selectedRaceIdentification: Ember.computed(function() {
        var model = this.get('model');
        return model.get('demographicsRaceIdentification');
    }),
    ageChoices: [
        'under 18',
        '18-21',
        '22-24',
        '25-29',
        '30-34',
        '35-39',
        '40-44',
        '45-49',
        '50-59',
        '60-69',
        '70 or over'
    ],
    childrenCounts: [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'More than 10'
    ],
    raceCategories: [
        'White',
        'Hispanic, Latino, or Spanish origin',
        'Black or African American',
        'Asian',
        'American Indian or Alaska Native',
        'Middle Eastern or North African',
        'Native Hawaiian or Other Pacific Islander',
        'Another race, ethnicity, or origin'
    ],
    genderOptions: [
        'male',
        'female',
        'other',
        'prefer not to answer'
    ],
    educationOptions: [
        'some or attending high school',
        'high school diploma or GED',
        'some or attending college',
        '2-year college degree',
        '4-year college degree',
        'some or attending graduate or professional school',
        'graduate or professional degree'
    ],
    spouseEducationOptions: [
        'some or attending high school',
        'high school diploma or GED',
        'some or attending college',
        '2-year college degree',
        '4-year college degree',
        'some or attending graduate or professional school',
        'graduate or professional degree',
        'not applicable - no spouse or partner'
    ],
    annualIncomeOptions: [
        '0',
        '5K',
        '30K',
        '40K',
        '100K',
        '200K',
        'over 200K',
        'prefer not to answer'
    ],
    guardianOptions: [
        '1',
        '2',
        '3 or more',
        'varies'
    ],
    yesNoOptions: [
        'no answer',
        'yes',
        'no'
    ],
    actions: {
        selectRaceIdentification: function(event) {
            const selectedRaceIdentification = Ember.$(event.target).val();
            this.set('selectedRaceIdentification', selectedRaceIdentification || []);
        },
        saveDemographicsPreferences: function() {
            var model = this.get('model');
            model.setProperties({
                demographicsLanguagesSpokenAtHome: model.get('demographicsLanguagesSpokenAtHome'),
                demographicsNumberOfChildren: model.get('demographicsNumberOfChildren'),
                demographicsNumberOfGuardians: model.get('demographicsNumberOfGuardians'),
                demographicsNumberOfGuardiansExplanation: model.get('demographicsNumberOfGuardiansExplanation'),
                demographicsRaceIdentification: this.get('selectedRaceIdentification'),
                demographicsAge: model.get('demographicsAge'),
                demographicsGender: model.get('demographicsGender'),
                demographicsEducationLevel: model.get('demographicsEducationLevel'),
                demographicsSpouseEducationLevel: model.get('demographicsSpouseEducationLevel'),
                demographicsAnnualIncome: model.get('demographicsAnnualIncome'),
                demographicsWillingToBeContactedForSimilarStudies: model.get('demographicsWillingToBeContactedForSimilarStudies'),
                demographicsCanScheduleAnAppointment: model.get('demographicsCanScheduleAnAppointment'),
                demographicsNumberOfBooks: model.get('demographicsNumberOfBooks'),
                demographicsAdditionalComments: model.get('demographicsAdditionalComments')
            });
            model.save().then(() => {
                this.toast.info('Demographic survey saved successfully.');
            });
        }
    }
});
