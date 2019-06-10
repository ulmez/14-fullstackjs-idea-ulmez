var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var cors = require('cors');
var logger = require('morgan');
var multipart = require('connect-multiparty');

var usersRouter = require('./routes/users');
var personsRouter = require('./routes/persons');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var ordersRouter = require('./routes/orders');
var scoresRouter = require('./routes/scores');

var app = express();

app.use("/", express.static(__dirname + "/react-client/build"));

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multipart());

app.use('/users', usersRouter);
app.use('/persons', personsRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/scores', scoresRouter);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('/react-client/build'));
}

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'react-client', 'build', 'index.html'));
});

app.listen(port, function() {
  console.log("listening on port: ", port);
});

module.exports = app;
