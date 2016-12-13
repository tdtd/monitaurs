'use strict';

import mongoose from 'mongoose';

var StockSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Stock', StockSchema);
