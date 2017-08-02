
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var psnode = require('ps-node');

var routes = require('./src/routes');
var debug = require('debug')('grasshopper:dbserver');
var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', serveStatic(path.join(__dirname, 'src/public')));

psnode
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '5000');
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.set('port', port);

// TODO: Check if the ne04j daemon is running and start it if not already running.
// psnode.lookup({
//     command: 'neo4j',
//   },
//   (err, resultList) => {
//     if (err) {
//       console.log('DATABASE DAEMON NOT RUNNING');
//     }
//   }
// );
/**
 * Create HTTP server.
 */
console.log('Creating server');
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
console.log('Attempting to add socket listener to port ', port);
server.listen(port, ip);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
