import Ember from 'ember';

export default Ember.Service.extend({
    session: Ember.inject.service(),
    store: Ember.inject.service(),

    // FIXME: Deal with removed usages of profile field on service.
    // FIXME: Removed setProfile method entirely, and rely on value living in one place (the session)
    profile: Ember.computed.alias('session.data.profile'),

    // TODO: Can this be replaced with a simple alias?
    currentUserId: Ember.computed('session.data.authenticated', function() {
        var session = this.get('session');
        if (session.get('isAuthenticated')) {
            return session.get('data.authenticated.id');
        } else {
            return null;
        }
    }),
    /**
     * Fetch information about the currently logged in user. If no user is logged in, this method returns a rejected promise.
     * @method load
     * @return {Promise}
     */
    // TODO: Renamed loadCurrentUser to load, and changed return type
    load() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            var currentUserId = this.get('currentUserId');
            if (!Ember.isEmpty(currentUserId)) {
                var currentUser = this.get('store').peekRecord('account', currentUserId);
                if (currentUser) {
                    resolve(currentUser);
                } else {
                    this.get('store').findRecord('account', currentUserId).then(resolve, reject);
                }
            } else {
                reject();
            }
        });
    }
});
