import Ember from 'ember';

export default Ember.Controller.extend({
   
    loginController: Ember.inject.controller('login'),
    isLoggedIn: Ember.computed.reads('loginController.loggedIn')
    
});
