'use strict';

const Toisu = require('toisu');
const ToisuRouter = require('toisu-router');
const body = require('toisu-body');
const serveStatic = require('toisu-static');
const http = require('http');
const navigateController = require('./controllers/navigate');
const serverEvents = require('./lib/serverEvents');
const nudge = require('nudge');

const app = new Toisu();
const router = new ToisuRouter();
const server = http.createServer(app.requestHandler);

router.add('post', '/navigate', body.json(), navigateController);
router.add('get', '/emitter', nudge(serverEvents, {navigate: true, heartbeat: true}));
router.add('get', '/*', serveStatic('public'));

app.use(router.middleware);

server.listen(process.env.PORT || 3000, () => console.log('listening'));
