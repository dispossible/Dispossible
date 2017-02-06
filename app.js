var express = require('express');
var http = require('http');
var path = require('path');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

// Headers
app.use(function(req, res, next){
    res.append("X-UA-Compatible", "IE=edge,chrome=1");
    next();
});


// URL rewrite
app.use(function(req, res, next){
    var url1 = "dispossible.com";
    var url2 = "dispossible.co.uk";
    if( req.hostname.startsWith("www."+url1) || req.hostname.startsWith(url2) || req.hostname.startsWith("www."+url2) ){
        console.log("Redirecting URL: "+req.hostname+req.originalUrl + " --> "+url1+req.originalUrl);
        res.redirect(301, "http://"+url1+req.originalUrl);
    } else {
        next();
    }
});


// URLS
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));




// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    
    // render the error page
    res.status(err.status || 500);

    res.render('index', {
        title: "Error "+err.status,
        page: 'error',
        pageInfo: {
            message: err.message,
            status: err.status,
            stack: err.stack
        }
    });
});


// Create server
http
    .createServer(app)
    .listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });