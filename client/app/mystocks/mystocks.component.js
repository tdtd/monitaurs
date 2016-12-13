'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './mystocks.routes';

export class MystocksComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('stockApp.mystocks', [uiRouter])
  .config(routes)
  .component('mystocks', {
    template: require('./mystocks.html'),
    controller: MystocksComponent,
    controllerAs: 'mystocksCtrl'
  })
  .name;
