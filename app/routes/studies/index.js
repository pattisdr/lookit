import Ember from 'ember';
// Do we want/need this?
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend({
    session: service('session'),
    sessionAccount: service('session-account'),

    model() {
        var queryString = this.controllerFor('studies').get('queryString');
        var queryType = this.controllerFor('studies').get('queryType');

        // This network request seems to grab the right data using elasticSearch syntax...
        var Experiment = this.store.modelFor('experiment');
        var experiments =  this.store.query('experiment', {
            q:`state:${Experiment.prototype.ACTIVE}`
        });

        if(this.get('sessionAccount').account) {
            var currentUser = this.store.findRecord('account', this.get('sessionAccount').account.id);
            var promises = {experiments: experiments, user: currentUser};
            return Ember.RSVP.hash(promises);
        }
        return Ember.RSVP.hash({
            experiments: experiments
        });
    }
});
