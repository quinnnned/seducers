import test from 'tape';
import {combineSeducers} from '../src/index.js';

test("without parameters, combineSeducers returns the identity function", (assert) => {
    // Arrange
    const input = {};
    
    // Act
    const seducer = combineSeducers();
    const expected = input;
    const actual   = seducer(input);
    
    // Assert
    assert.equal(actual, expected);
    assert.end();
});

// Borrowed from https://github.com/reactjs/redux/blob/master/test/combineReducers.spec.js 
test('returns a composite seducer that maps the state keys to given seducers', (assert) => {
    
    // Arrange
    const counter = (state = 0, action={}) => action.type === 'increment' ? state + 1 : state;
    const stack   = (state = [], action={}) => action.type === 'push' ? [ ...state, action.value ] : state;
    const incrementAction = { type: 'increment' };
    const pushAction = { type: 'push', value: 'a' };
    
    // Act
    const seducer = combineSeducers({counter, stack});
    const state0 = seducer();
    const state1 = seducer(state0, incrementAction);
    const state2 = seducer(state1, pushAction);
    
    // Assert
    assert.deepEqual(state0, { counter: 0, stack: [] } );
    assert.deepEqual(state1, { counter: 1, stack: [] } );
    assert.deepEqual(state2, { counter: 1, stack: [ 'a' ] } );
    assert.end();
});

test('lifts the sub-seducer selectors, mapping the substate to them', (assert) => {
    
    // Arrange
    const counter = (state = 0, action={}) => action.type === 'increment' ? state + 1 : state;
    counter.getCounter = (state) => state;
    
    const stack   = (state = [], action={}) => action.type === 'push' ? [ ...state, action.value ] : state;
    stack.getStack = (state) => state;
    
    const incrementAction = { type: 'increment' };
    const pushAction = { type: 'push', value: 'a' };
    
    // Act
    const seducer = combineSeducers({counter, stack});
    
    const state = [incrementAction, pushAction].reduce(seducer, {});
    const actualCount = seducer.getCounter(state);
    const expectedCount = 1;
    const actualStack = seducer.getStack(state);
    const expectedStack = ['a'];
    
    // Assert
    assert.equal(actualCount, expectedCount);
    assert.deepEqual(actualStack, expectedStack);
    assert.end();
});


test('selectors can have multiple parameters', (assert) => {
    
    // Arrange
    const isPrimeById = (x={5:true}) => x;
    isPrimeById.getIsPrimeById = (state, id) => state[id];
    
    // Act
    const seducer = combineSeducers({isPrimeById});
    const state = seducer();
    const actual = seducer.getIsPrimeById(state, 5);
    const expected = true;
    
    // Assert
    assert.equal(actual, expected);
    assert.end();
});

