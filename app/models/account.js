import DS from 'ember-data';
import Account from 'exp-models/models/account';

export default Account.extend({
    email: DS.attr('string'),
    mustResetPassword: DS.attr('boolean')
});
