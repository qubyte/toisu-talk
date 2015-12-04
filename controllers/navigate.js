'use strict';

const jsonBody = require('body/json');
const serverEvents = require('../lib/serverEvents');

function navigateController(req, res) {
  const body = this.get('body');

  serverEvents.emit('navigate', {by: body.by});
  res.statusCode = 204;
  res.end();
}

module.exports = navigateController;
