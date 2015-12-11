# outline

A few months back Jeremy Keith started holding the homebrew website club right here.

I jumped at the chance. I haven't maintained a blog in years and had kept meaning to sort that out.

I'm a Node developer hopelessly in love with JS, so instead of picking a static site generator or
writing plain old HTML files and throwing those files on a hosting service or GitHub pages, I
decided to write the software itself. This was a mistake.

Here is a server written in Node:

```javascript
const http = require('http');

function requestHandler(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
  res.write(req.url);
  res.end();
}

const server = http.createServer(requestHandler);
server.listen(3000);
```

This is fine for very simple servers, but cumbersome for anything else. The go to choice for many
developers is _express_. Express does many (mostly unnecessary) things, but at its core it allows
you to define a _sequence_ of request handlers, called middleware, in the place of a single request
handler.

```javascript
const http = require('http');
const express = require('express');
const app = express();

function checkAccess(req, res, next) {
  getAccess(req, (err, authorized) => {
    if (err) {
      return res.status(500).end();
    }

    if (!authorized) {
      return res.status(401).end();
    }

    next();
  });
}

function echoUrl(req, res) {
  res.send(req.url);
}

app.use(checkAccess);
app.use(echoUrl);

const server = http.createServer(app):
server.listen(3000);
```

See that `next` right there? That's a callback. Express needs that to know when the middleware is
done when it has something asynchronous to do. Express is checking each middleware functions
arguments to know how to execute it. Except in specific circumstances, variadic functions are gross.

So I look at that ugly little callback for a couple of minutes and think "if you want a job doing
right, you do it yourself". The blog was going well...

We live in exciting times when it comes to JS. About a month back there was a great overview talk
on the new features in ES2015. One of them has been around in JS in various forms for a long time,
but ES2015 standardizes them.

Promises!

Promises, polarize developers. I myself detested them for a long time. It was only when I came
across the subject of this talk that promises became much more appealing. I'll get to that bit in a
minute. First, what would an express analogue built with promises in mind look like?

I built Toisu to find out, in a _minimal_ way.

Before toisu, let's talk about promises.

Promises are a sort on object which exists in one of three states: _pending_, _resolved_, and
_rejected_. A promise has to methods, _then_ and _catch_, which accept callbacks, and return new
promises.

This makes chaining promises possible.

```javascript
const http = require('http');
const Toisu = require('toisu');
const app = new Toisu();

function checkAccess(req, res, next) {
  return getAccess(req)
    .then(authorized => {
      if (!authorized) {
        res.status(401).end();
      }
    });
}

function echoUrl(req, res) {
  res.send(req.url);
}

app.use(checkAccess);
app.use(echoUrl);

const server = http.createServer(app.requestHandler);
server.listen(3000);
```

Toisu doesn't count arguments. It looks at the return from a function. If the return is a promise,
it waits for the promise to resolve before continuing. Otherwise the middleware is treated as
synchronous. This is much nicer!

It gets better though. Async-await will soon give use more clarity. Better still, because Toisu
likes middleware that return promises, it supports async-await _automatically_.

What do I mean by that?

Compare these two:

```javascript
function checkAccess(req, res, next) {
  return getAccess(req)
    .then(authorized => {
      if (!authorized) {
        res.status(401).end();
      }
    });
}
```

```javascript
async function checkAccess(req, res, next) {
  const authorized = await getAccess(req);

  if (!authorized) {
    res.status(401).end();
  }
}
```

These are equivalent! Inside async functions, you have access to the new await keyword. When
awaiting a promise, the function suspends until the promise resolves or rejects. If the promise
rejects, the await converts the rejection to a throw. If the promise resolves, it is assigned to the
variable on the left hand side.

This is so important it's unreal. We've done something async and suffered no callback or
indentation. We can also return a value from an async function:

```javascript
function getAccess(req) {
  const {username, password} = decodeAuthHeader(req);

  return db.checkAuth(username, password)
    .then(result => result === 'authorized');
}
```

```javascript
async function getAccess(req) {
  const {username, password} = decodeAuthHeader(req);
  const result = await db.checkAuth(username, password);

  return result === 'authorized';
}
```

Async functions return a promise, and the return inside the function becomes the resolved value of
that promise. Since functions return undefined by default, our middleware is resolving to undefined,
but only when the end of the function is reached (which means that any awaited promises have to
resolve first).

Now for an example which is hard to express with raw promises:

```javascript
async function waterfall(funcs, initial) { // funcs is a list of functions which return promises.
  let lastResolution = initial;

  for (const func of funcs) {
    lastResolution = await func(lastResolution);
  }

  return lastResolution;
}
```

This function takes an arbitrary number of functions which return promises. Each function consumes
the resolution of the last promise. Doing this in raw promises is of course possible, and in fact
the toisu middleware runner does something very similar, but you have to do some mental acrobatics
to get there.

That's sequential execution, but what about parallel execution? That's a trick question:

```javascript
function parallel(funcs) { // funcs is a list of functions which return promises.
  return Promise.all(funcs.map(func => func()));
}
```
