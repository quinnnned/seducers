import test from 'tape';
import {combineSeducers} from '../src/index.js';

test("should be a placholder", (assert) => {
    // Arrange
    
    // Act
    const expected = 'just a placeholder';
    const actual   = combineSeducers();
    
    // Assert
    assert.equal(actual, expected);
    assert.end();
});