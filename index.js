'use strict';

const express = require('express');
const http = require('http');
const nudge = require('nudge');
const bodyParser = require('body-parser');
const EventEmitter = require('events');

const app = express();
const navEmitter = new EventEmitter();
const navEmitterRelay = nudge(navEmitter, {forward: true, backward: true});

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/emitter', navEmitterRelay);

app.post('/navigate/', (req, res) => {
  navEmitter.emit('navigate', req.body.by);
  res.status(204).end();
});

app.post('/navigate/backward', (req, res) => {
  navEmitter.emit('backward');
  res.status(204).end();
});

http.createServer(app).listen(process.env.PORT || 3000, () => console.log('listening'));
