'use strict';

const http = require('http');
const Toisu = require('toisu');
const ToisuRouter = require('toisu-router');
const body = require('toisu-body');
const serveStatic = require('toisu-static');
const nudge = require('nudge');
const navigateController = require('./controllers/navigate');
const serverEvents = require('./lib/serverEvents');

const router = new ToisuRouter()
  .add('post', '/navigate', body.json(), navigateController)
  .add('get', '/emitter', nudge(serverEvents, {navigate: true, heartbeat: true}))
  .add('get', '/*', serveStatic('public'));

const app = new Toisu()
  .use(router.middleware);

http.createServer(app.requestHandler)
  .listen(process.env.PORT || 3000, () => console.log('listening'));
