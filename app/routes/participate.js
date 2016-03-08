import Ember from 'ember';
// Do we want/need this?
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    session: service('session'),
    sessionAccount: service('session-account'),
    setupController: function(controller, model) {
        this._super(controller, model);

        if (!this.get('sessionAccount.profile')) {
            this.transitionTo('studies.detail', model.experiment.get('id'));
        }

        var session = this.get('store').createRecord(model.experiment.get('sessionCollectionId'), {
            experimentId: model.experiment.get('id'),
            profileId: this.get('sessionAccount.profile.profileId')
            // TODO
            // profileVersion: '',
            // softwareVersion: ''
        });
        model.experiment.getCurrentVersion().then(function(versionId) {
            session.set('experimentVersion', versionId);
        });
        controller.set('session', session);
        session.save();
    },

    model(params) {
        return Ember.RSVP.hash({
            experiment: this.store.findRecord('experiment', params.experiment_id),
            user: this.store.findRecord('account', this.get('sessionAccount').account.id)
        });
    }
});
