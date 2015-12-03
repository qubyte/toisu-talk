'use strict';

const serveStatic = require('serve-static');
const serve = serveStatic('public');

function staticController(req, res) {
  return new Promise((resolve, reject) => {
    serve(req, res, err => err ? reject(err) : resolve());
  });
}

module.exports = staticController;
