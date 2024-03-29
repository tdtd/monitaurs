/**
 * SharedStock model events
 */

'use strict';

import {EventEmitter} from 'events';
import SharedStock from './sharedStock.model';
var SharedStockEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SharedStockEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  SharedStock.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SharedStockEvents.emit(event + ':' + doc._id, doc);
    SharedStockEvents.emit(event, doc);
  };
}

export default SharedStockEvents;
