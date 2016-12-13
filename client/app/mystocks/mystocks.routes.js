'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('mystocks', {
      url: '/mystocks',
      template: '<mystocks></mystocks>'
    });
}
