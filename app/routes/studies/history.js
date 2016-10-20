import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

    model( /*params*/ ) {
        // In the future, routes should be restructured to better support more experiments
        let Experiment = this.store.modelFor('experiment');
        let experiments = this.store.query('experiment', {
            q: `state:${Experiment.prototype.ACTIVE} OR state:${Experiment.prototype.ARCHIVED}`
        });

        let sessionPromises = [];
        let experimentSessions = [];

        // Return the result of a query for all experiments
        return experiments.then((experiments) => {
            experiments.forEach((experiment) => {
                // Endpoint only returns sessions that the user has permissions to see (assumption: for a Jam user, this means only their own sessions)
                let foundSessions = this.store.query(experiment.get('sessionCollectionId'), {
                    'filter[completed]': 1
                }).then((sessions) => {
                    if (sessions.get('length') > 0) {
                        experimentSessions.push({
                            experiment: experiment,
                            sessions: sessions
                        });
                    }
                });
                sessionPromises.push(foundSessions);
            });
            return Ember.RSVP.all(sessionPromises).then(() => experimentSessions);
        });
    }
});
