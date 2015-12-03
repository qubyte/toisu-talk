'use strict';

const EventEmitter = require('events');
const navEmitter = new EventEmitter();

setInterval(() => navEmitter.emit('heartbeat'), 30000);

module.exports = navEmitter;
