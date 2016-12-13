'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var sharedStockCtrlStub = {
  index: 'sharedStockCtrl.index',
  show: 'sharedStockCtrl.show',
  create: 'sharedStockCtrl.create',
  upsert: 'sharedStockCtrl.upsert',
  patch: 'sharedStockCtrl.patch',
  destroy: 'sharedStockCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var sharedStockIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './sharedStock.controller': sharedStockCtrlStub
});

describe('SharedStock API Router:', function() {
  it('should return an express router instance', function() {
    expect(sharedStockIndex).to.equal(routerStub);
  });

  describe('GET /api/sharedStocks', function() {
    it('should route to sharedStock.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'sharedStockCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/sharedStocks/:id', function() {
    it('should route to sharedStock.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'sharedStockCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/sharedStocks', function() {
    it('should route to sharedStock.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'sharedStockCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/sharedStocks/:id', function() {
    it('should route to sharedStock.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'sharedStockCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/sharedStocks/:id', function() {
    it('should route to sharedStock.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'sharedStockCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/sharedStocks/:id', function() {
    it('should route to sharedStock.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'sharedStockCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
