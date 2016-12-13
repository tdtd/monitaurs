/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sharedStocks              ->  index
 * POST    /api/sharedStocks              ->  create
 * GET     /api/sharedStocks/:id          ->  show
 * PUT     /api/sharedStocks/:id          ->  upsert
 * PATCH   /api/sharedStocks/:id          ->  patch
 * DELETE  /api/sharedStocks/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import SharedStock from './sharedStock.model';
let yahooFinance = require('yahoo-finance');
let Promise = require('bluebird');


function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/*
  Interact with yahooFinance
  symbolArray array of stock symbols to get info on
  ytd bool of year to date or full year
*/
function getHistoricalData(symbolArray, ytd){
  let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let a = new Date();
  let b;
  if (ytd){
    b = new Date("january 1 "+a.getFullYear());
  } else {
    b = new Date(month[a.getMonth()]+" "+a.getDate()+" "+(parseInt(a.getFullYear()) - 2));
  }
  return new Promise((resolve, reject) => {
    if (symbolArray.length < 1 || symbolArray.constructor != Array){
      return reject({});
    }
    yahooFinance.historical({
      symbols: symbolArray,
      from: b,
      to: a
    }, (err, result) =>{
      if (err) return reject(err);
      resolve(result);
    })
  })
}

function checkExists(symbol){
  return new Promise((resolve, reject) => {
    yahooFinance.snapshot({
      symbol: symbol,
      fields: ['s', 'o', 'e1']
    }, (err, snapshot) => {
      console.log(err)
      console.log(snapshot)
      if (err) return reject(err);
      if (!snapshot.open) return reject(new Error('Stock Symbol Does not Exist'));
      return resolve(snapshot);
    })
  })
}

// Gets a list of SharedStocks
export function index(req, res) {
  return SharedStock.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function info(req, res) {
  return SharedStock.loadRecent(getHistoricalData, false)
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//get an array of stocks using req.query
export function multiStock(req, res) {
  if ('stocks' in req.query){
    let stocks = req.query.stocks.split(',');
    console.log(stocks)
    return getHistoricalData(stocks, true)
      .then(result => {
        return res.status(200).json(result);
      })
      .catch(err => {
       return  handleError(res, 400)
      })
  } else {
    return handleError(res, 400);
  } 
}

// Gets a single SharedStock from the DB
export function show(req, res) {
  return SharedStock.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new SharedStock in the DB
export function create(req, res) {
  if (!req.body.name) { return handleError(res)}
  checkExists(req.body.name)
    .then(doc => {
    return SharedStock.create(req.body)
      .then(respondWithResult(res, 201))
      .catch(handleError(res, 404));
    })
    .catch(handleError(res, 404));
}

// Upserts the given SharedStock in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return SharedStock.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing SharedStock in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return SharedStock.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a SharedStock from the DB
export function destroy(req, res) {
  return SharedStock.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
