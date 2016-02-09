import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: "/"}, function() {});
  this.route('login', {path: "/login"});
  this.route('participate');
  this.route('faq');
  this.route('scientists');
  this.route('resources');
  this.route('contact');
});

export default Router;
