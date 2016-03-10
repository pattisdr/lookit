import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('study-feedback-text', 'Integration | Component | study feedback text', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{study-feedback-text}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#study-feedback-text}}
      template block text
    {{/study-feedback-text}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
