import testdom from 'testdom';

testdom('<!doctype html><html><body></body></html>');

require('babel/register')({
  stage: 0,
  optional: ['es7.asyncFunctions'],
  plugins: ['rewire']
});
