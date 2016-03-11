import Ember from 'ember';

const { service } = Ember.inject;

let Promise = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

export default Ember.Controller.extend({
    session: service('session'),
    sessionAccount: service('session-account'),
    queryString: 'Active',
    queryTypes: ['state', 'eligibilityCriteria'],
    queryType: 'state',
    header: 'Suggested Studies',

    loggedIn: Ember.computed(function () {
        return !!this.get('sessionAccount').account;
    }),

    allExperiments: Ember.computed(function () {
        if (this.get('loggedIn')) {

            let Experiment = this.store.modelFor('experiment');

            let sessionGatherer = this.store.query('experiment', {
                q: `state:${Experiment.prototype.ACTIVE} OR state:${Experiment.prototype.ARCHIVED}`
            }).then((experiments) => {
                let promises = [];
                let experimentSessions = [];

                experiments.forEach((experiment) => {
                    promises.push(  // Endpoint only returns sessions that the user has permissions to see (assumption: only their own)
                        this.store.query(experiment.get('sessionCollectionId'), {'filter[completed]': 1}).then((sessions) => {
                            if (sessions.get('length') > 0) {
                                experimentSessions.push({
                                    experiment: experiment,
                                    sessions: sessions
                                });
                            }
                        }));
                });

                return Ember.RSVP.all(promises).then(() => {
                    return experimentSessions;
                });
            });

            return Promise.create({ // TODO: Is this necessary? (Why is it here?)
                promise: sessionGatherer
            });
        }
        return [];
    }),

    actions: {
        updateHeader: function (header) {
            this.set('header', header);
        }
    }
});
