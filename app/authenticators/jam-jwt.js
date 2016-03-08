import Ember from 'ember';
import ENV from 'lookit-base/config/environment';
import Base from 'ember-simple-auth/authenticators/base';

import moment from 'moment';

const {
    $, RSVP
} = Ember;

export default Base.extend({
    url: `${ENV.JAMDB.url}/v1/auth`,
    sessionAccount: Ember.inject.service(),
    restore(data) {
        let token = JSON.parse(atob(data.attributes.token.split('.')[1]));
        if (token.exp > moment().unix()) {
            this.get('sessionAccount').loadCurrentUser();
            return RSVP.resolve(data);
        }
        return RSVP.reject(data);
    },
    authenticate(attrs) {
        return $.ajax({
            method: 'POST',
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify({
                data: {
                    type: 'users',
                    attributes: attrs
                }
            })
        }).then((data) => {
            this.get('sessionAccount').loadCurrentUser();
            return data.data;
        });
    }
});
