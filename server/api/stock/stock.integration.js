'use strict';

var app = require('../..');
import request from 'supertest';

var newStock;

describe('Stock API:', function() {
  describe('GET /api/stocks', function() {
    var stocks;

    beforeEach(function(done) {
      request(app)
        .get('/api/stocks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          stocks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(stocks).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/stocks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/stocks')
        .send({
          name: 'New Stock',
          info: 'This is the brand new stock!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStock = res.body;
          done();
        });
    });

    it('should respond with the newly created stock', function() {
      expect(newStock.name).to.equal('New Stock');
      expect(newStock.info).to.equal('This is the brand new stock!!!');
    });
  });

  describe('GET /api/stocks/:id', function() {
    var stock;

    beforeEach(function(done) {
      request(app)
        .get(`/api/stocks/${newStock._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          stock = res.body;
          done();
        });
    });

    afterEach(function() {
      stock = {};
    });

    it('should respond with the requested stock', function() {
      expect(stock.name).to.equal('New Stock');
      expect(stock.info).to.equal('This is the brand new stock!!!');
    });
  });

  describe('PUT /api/stocks/:id', function() {
    var updatedStock;

    beforeEach(function(done) {
      request(app)
        .put(`/api/stocks/${newStock._id}`)
        .send({
          name: 'Updated Stock',
          info: 'This is the updated stock!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStock = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStock = {};
    });

    it('should respond with the original stock', function() {
      expect(updatedStock.name).to.equal('New Stock');
      expect(updatedStock.info).to.equal('This is the brand new stock!!!');
    });

    it('should respond with the updated stock on a subsequent GET', function(done) {
      request(app)
        .get(`/api/stocks/${newStock._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let stock = res.body;

          expect(stock.name).to.equal('Updated Stock');
          expect(stock.info).to.equal('This is the updated stock!!!');

          done();
        });
    });
  });

  describe('PATCH /api/stocks/:id', function() {
    var patchedStock;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/stocks/${newStock._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Stock' },
          { op: 'replace', path: '/info', value: 'This is the patched stock!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStock = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStock = {};
    });

    it('should respond with the patched stock', function() {
      expect(patchedStock.name).to.equal('Patched Stock');
      expect(patchedStock.info).to.equal('This is the patched stock!!!');
    });
  });

  describe('DELETE /api/stocks/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/stocks/${newStock._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when stock does not exist', function(done) {
      request(app)
        .delete(`/api/stocks/${newStock._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
