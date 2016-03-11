import Ember from 'ember';


export default Ember.Route.extend({
    model() {
        // This network request seems to grab the right data using elasticSearch syntax...
        let Experiment = this.store.modelFor('experiment');
        return this.store.query('experiment', {
            q:`state:${Experiment.prototype.ACTIVE}`
        });
    }
});
