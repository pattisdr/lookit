import { minus } from '../../../helpers/minus';
import { module, test } from 'qunit';

module('Unit | Helper | minus');

// Replace this with your real tests.
test('it works', function(assert) {
    let result = minus([42]);
    assert.equal(result,42);
});

test('it subtracts the difference', function(assert) {
    let result = minus([42, 17]);
    assert.equal(result, 42 - 17);
});
