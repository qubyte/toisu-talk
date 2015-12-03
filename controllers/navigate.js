'use strict';

const jsonBody = require('body/json');
const serverEvents = require('../lib/serverEvents');

function navigateController(req, res) {
  const bodyPromise = new Promise((resolve, reject) => {
    jsonBody(req, res, (err, body) => err ? reject(err) : resolve(body));
  });

  return bodyPromise
    .then(body => {
      serverEvents.emit('navigate', {by: body.by});
      res.statusCode = 204;
      res.end();
    });
}

module.exports = navigateController;
