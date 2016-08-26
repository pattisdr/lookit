import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('exp-physics-intro', 'Integration | Component | exp physics intro', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{exp-physics-intro}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#exp-physics-intro}}
      template block text
    {{/exp-physics-intro}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
