'use strict';

var app = require('../..');
import request from 'supertest';

var newSharedStock;

describe('SharedStock API:', function() {
  describe('GET /api/sharedStocks', function() {
    var sharedStocks;

    beforeEach(function(done) {
      request(app)
        .get('/api/sharedStocks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          sharedStocks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(sharedStocks).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/sharedStocks', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/sharedStocks')
        .send({
          name: 'New SharedStock',
          info: 'This is the brand new sharedStock!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSharedStock = res.body;
          done();
        });
    });

    it('should respond with the newly created sharedStock', function() {
      expect(newSharedStock.name).to.equal('New SharedStock');
      expect(newSharedStock.info).to.equal('This is the brand new sharedStock!!!');
    });
  });

  describe('GET /api/sharedStocks/:id', function() {
    var sharedStock;

    beforeEach(function(done) {
      request(app)
        .get(`/api/sharedStocks/${newSharedStock._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          sharedStock = res.body;
          done();
        });
    });

    afterEach(function() {
      sharedStock = {};
    });

    it('should respond with the requested sharedStock', function() {
      expect(sharedStock.name).to.equal('New SharedStock');
      expect(sharedStock.info).to.equal('This is the brand new sharedStock!!!');
    });
  });

  describe('PUT /api/sharedStocks/:id', function() {
    var updatedSharedStock;

    beforeEach(function(done) {
      request(app)
        .put(`/api/sharedStocks/${newSharedStock._id}`)
        .send({
          name: 'Updated SharedStock',
          info: 'This is the updated sharedStock!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSharedStock = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSharedStock = {};
    });

    it('should respond with the original sharedStock', function() {
      expect(updatedSharedStock.name).to.equal('New SharedStock');
      expect(updatedSharedStock.info).to.equal('This is the brand new sharedStock!!!');
    });

    it('should respond with the updated sharedStock on a subsequent GET', function(done) {
      request(app)
        .get(`/api/sharedStocks/${newSharedStock._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let sharedStock = res.body;

          expect(sharedStock.name).to.equal('Updated SharedStock');
          expect(sharedStock.info).to.equal('This is the updated sharedStock!!!');

          done();
        });
    });
  });

  describe('PATCH /api/sharedStocks/:id', function() {
    var patchedSharedStock;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/sharedStocks/${newSharedStock._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched SharedStock' },
          { op: 'replace', path: '/info', value: 'This is the patched sharedStock!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSharedStock = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSharedStock = {};
    });

    it('should respond with the patched sharedStock', function() {
      expect(patchedSharedStock.name).to.equal('Patched SharedStock');
      expect(patchedSharedStock.info).to.equal('This is the patched sharedStock!!!');
    });
  });

  describe('DELETE /api/sharedStocks/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/sharedStocks/${newSharedStock._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when sharedStock does not exist', function(done) {
      request(app)
        .delete(`/api/sharedStocks/${newSharedStock._id}`)
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
