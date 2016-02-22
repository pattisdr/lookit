import Ember from 'ember';
import ENV from 'lookit-base/config/environment';
import Base from 'ember-simple-auth/authenticators/base';

// If you wanted to use the jam-osf-jwt authenticator from the exp-addon, you would use the following import code and not any of the below. However, this isn't working right now (returns 500)
//import JamOsfJwt from 'exp-models/authenticators/jam-osf-jwt';
//
//export default JamOsfJwt;

const { $, RSVP } = Ember;

export default Base.extend({
    url: `${ENV.jamdbURL}/v1/auth`,
    restore(data) {
        let token = JSON.parse(atob(data.attributes.token.split('.')[1]));
        if (token.exp > moment().unix())
          return RSVP.resolve(data);
        return RSVP.reject(data);
    },
    authenticate(attrs) {
        return $.ajax({
            method: 'POST',
            url: this.url,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
            data: JSON.stringify({data: {
                type: 'users',
                attributes: attrs
            }})
        }).then(data => data.data);
    }
    // invalidate(data) {
    //     debugger;
    // }
});