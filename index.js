'use strict';

const Toisu = require('toisu');
const ToisuRouter = require('toisu-router');
const fs = require('fs');
const path = require('path');
const http = require('http');
const nudge = require('nudge');
const EventEmitter = require('events');

const navEmitter = new EventEmitter();
const navEmitterRelay = nudge(navEmitter, {navigate: true, heartbeat: true});

setInterval(() => navEmitter.emit('heartbeat'), 30000);

const router = new ToisuRouter();

const indexHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
const indexJs = fs.readFileSync(path.join(__dirname, 'public', 'index.js'));

router.add('get', '/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': indexHtml.length});
  res.end(indexHtml);
});

router.add('get', '/index.js', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/javascript', 'Content-Length': indexJs.length});
  res.end(indexJs);
});

router.add('post', '/navigate', function (req, res) {
  var body = '';

  req.on('data', data => body += data);

  req.on('end', () => {
    let parsedBody;

    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      res.statusCode = 500;
      res.end();
      return;
    }

    navEmitter.emit('navigate', {by: parsedBody.by});
    res.statusCode = 204;
    res.end();
  });
});

router.add('get', '/emitter', navEmitterRelay);

const app = new Toisu();

app.use(router.middleware);

http.createServer(app.requestHandler).listen(process.env.PORT || 3000, () => console.log('listening'));
