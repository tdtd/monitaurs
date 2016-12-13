'use strict';

import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!');
var SharedStockSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  name: {
    type: String,
    unique: true
  }
});

SharedStockSchema.statics = {
  loadRecent: function(cb, ytd) {
    let self = this;
    return new Promise(function(resolve, reject){
      self.find({})
        .select('name')
        .sort('-date')
        .limit(25)
        .exec((err, doc) => {
          cb(doc, ytd)
            .then(data =>{ 
              resolve(data);
            })
          .catch(err => {
            reject(err)
          })
        });
    })
  },
	loadMine: function(param) {
    let self = this;
    return new Promise(function(resolve, reject){
      self.find(param)
        .populate({path:'creator', select: 'name'})
        .sort('-date')
        .exec(function(err,doc){
          return resolve(doc);
      });
    })
  }
};

export default mongoose.model('SharedStock', SharedStockSchema);
