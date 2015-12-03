'use strict';

const Toisu = require('toisu');
const ToisuRouter = require('toisu-router');
const http = require('http');
const staticController = require('./controllers/static');
const navigateController = require('./controllers/navigate');
const serverEvents = require('./lib/serverEvents');
const nudge = require('nudge');

const app = new Toisu();
const router = new ToisuRouter();
const server = http.createServer(app.requestHandler);

router.add('post', '/navigate', navigateController);
router.add('get', '/emitter', nudge(serverEvents, {navigate: true, heartbeat: true}));
router.add('get', '/*', staticController);

app.use(router.middleware);

server.listen(process.env.PORT || 3000, () => console.log('listening'));
