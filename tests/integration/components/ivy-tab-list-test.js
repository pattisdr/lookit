import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ivy-tab-list', 'Integration | Component | ivy tab list', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });"

  this.render(hbs`{{ivy-tab-list}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:"
  this.render(hbs`
    {{#ivy-tab-list}}
      template block text
    {{/ivy-tab-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
