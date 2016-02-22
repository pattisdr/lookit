import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
//  authorize(sessionData, block) {
//      block('Authorization', sessionData.attributes.token);
//  }
    //OR
  authorize(sessionData, setHeader) {
    setHeader('Authorization', sessionData.token);
  }
});