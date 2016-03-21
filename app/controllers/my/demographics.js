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

    nNumberOfChildren: 11,
    numberOfChildren: Ember.computed('nNumberOfChildren', 'model.demographicsNumberOfChildren', function() {
        var numberOfChildren = this.get('model.demographicsNumberOfChildren');
        if (!numberOfChildren) {
            return 0;
        }
        else if (isNaN(numberOfChildren)) {
            numberOfChildren = this.get('nNumberOfChildren');
            if (!numberOfChildren) {
                return 0;
            }
            else {
                return parseInt(numberOfChildren);
            }
        }
        else {
            return parseInt(numberOfChildren);
        }
    }),
    onNumberOfChildrenChange: Ember.observer('numberOfChildren', function() {
        var numberOfChildren = this.get('numberOfChildren');
        var birthdays = [];
        for(var i = 0; i < numberOfChildren; i++) {
            birthdays[i] = this.get('model.demographicsChildBirthdays').objectAt(i);
        }
        this.get('model').set('demographicsChildBirthdays', Ember.A(birthdays));
    }),
    actions: {
        selectRaceIdentification: function() {
            const selectedRaceIdentification = [];
            Ember.$('#raceIdentification input:checked').each(function() {
                selectedRaceIdentification.push(Ember.$(this).attr('value'));
            });
            this.set('selectedRaceIdentification', selectedRaceIdentification || []);
        },
        saveDemographicsPreferences: function() {
            this.get('model').save().then(() => {
                this.toast.info('Demographic survey saved successfully.');
            });
        },
        setChildBirthday(index, birthday) {
            var childBirthdays = this.get('model.demographicsChildBirthdays');
            childBirthdays[index]  = birthday;

            var model = this.get('model');

            model.set('demographicsChildBirthdays', childBirthdays);
            model.propertyDidChange('demographicsChildBirthdays');
        }
    }
});
