import {
    include
} from '../../../helpers/include';
import {
    module,
    test
} from 'qunit';

module('Unit | Helper | include');

// Replace this with your real tests.
test('it works', function(assert) {
    let result = include([[1, 3, 5], 5]);
    assert.ok(result);
});
