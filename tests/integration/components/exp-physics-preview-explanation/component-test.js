import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('/exp-physics-preview-explanation', 'Integration | Component | exp physics preview explanation', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{/exp-physics-preview-explanation}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#/exp-physics-preview-explanation}}
      template block text
    {{//exp-physics-preview-explanation}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
