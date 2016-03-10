import Ember from 'ember';
// Do we want/need this?
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend({

    model() {
        let queryString = this.controllerFor('studies').get('queryString');
        let queryType = this.controllerFor('studies').get('queryType');

        // This network request seems to grab the right data using elasticSearch syntax...
        let Experiment = this.store.modelFor('experiment');
        return this.store.query('experiment', {
            q:`state:${Experiment.prototype.ACTIVE}`
        });
    }

});
