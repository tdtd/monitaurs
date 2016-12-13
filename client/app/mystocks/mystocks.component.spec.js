'use strict';

describe('Component: MystocksComponent', function() {
  // load the controller's module
  beforeEach(module('stockApp.mystocks'));

  var MystocksComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MystocksComponent = $componentController('mystocks', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
