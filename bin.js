#!/usr/bin/env node

'use strict';

import { createServer } from 'http';
import finalhandler from 'finalhandler';
import serveStatic from 'serve-static';
import child_process from 'child_process';
var serve = serveStatic("./extension");
var server = createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});
var port = 8888
console.log('client is running on localhost:' + port)
server.listen(port);
var url = 'http://localhost:'+port;
var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
child_process.exec(start + ' ' + url);