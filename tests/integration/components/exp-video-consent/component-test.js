import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('/exp-video-consent', 'Integration | Component | exp video consent', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{/exp-video-consent}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#/exp-video-consent}}
      template block text
    {{//exp-video-consent}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
