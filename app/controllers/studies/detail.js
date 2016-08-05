import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    sessionAccount: Ember.inject.service(),
    account: Ember.computed.alias('sessionAccount.account'),
    selectedChildId: null,
    selectedChild: Ember.computed('selectedChildId', function() {
        let account = this.get('sessionAccount').get('account');
        return account.profileById(this.get('selectedChildId'));
    }),

    isAgeEligible: Ember.computed('selectedChild', function() {
        let child = this.get('selectedChild');
        if (!child) {
            return true;
        }

        let experiment = this.get('model');
        let {
            eligibilityMinAge,
            eligibilityMaxAge
        } = experiment.getProperties('eligibilityMinAge', 'eligibilityMaxAge');
        let [minNumber, minUnit] = eligibilityMinAge.split(' ');
        let minDays = moment.duration(parseFloat(minNumber), minUnit).asDays();
        let [maxNumber, maxUnit] = eligibilityMaxAge.split(' ');
        let maxDays = moment.duration(parseFloat(maxNumber), maxUnit).asDays();

        var diff = moment().diff(child.get('birthday'), 'days');
        return minDays <= diff && diff <= maxDays;
    }),

    route: function() {
        return `${Ember.getOwner(this).lookup('router:main').get('currentPath')}:${this.get('model.id')}`;
    }.property('model'),

    actions: {
        pickChild() {
            let profile = this.get('selectedChild');
            this.get('sessionAccount').setProfile(profile);
            this.get('session').set('data.profile', profile);
            this.transitionToRoute('participate', this.get('model.id'));
        }
    }
});
