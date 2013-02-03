var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();



//Setting up the config
var sequelize = new Sequelize('testtesttest', 'root', 'a', {
  host: "localhost",
  port: 3306,
  dialect: 'mysql'
});

//  var sequelizer = new Sequelize('jdbc:mysql://localhost:3306/testtesttest?zeroDateTimeBehavior=convertToNull', 'root', 'wnr39esb', {




sequelize.authenticate().then(function (err) {
  if (err) {
    console.log('There is connection in ERROR');
  } else {
    console.log('Connection has been established successfully');
  }
});




// start opret ny tabel
var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
      validate: { notNull: true },
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING,
    validate: { notNull: false } // here we decide parameters for this field in the table
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: true // fjerner timestamps med false denne option skal stå på tabellen
}); // afslut oprettelse af en ny tabel


// insert into the table "User" (( force : false means you dont
// drop the table on run where true drops the table.
var s = true;
if(s == false)
{
User.sync({force: false}).then(function () {
  // Table created
  return User.create({
    firstName: 'Johna',
    lastName: 'Hancock'
  });
});
}
// done with insert


var deletes = true;
if(deletes == false)
{
// User.find finds an entry where first name equals Johna
User.find({where: {firstName: 'Johna'}}).then(function (data, err) {
  if (err) {
    console.log(err);
  } else {
    // data.destroy deletes
    data.destroy({}).then(function (data, err) {
      if(err){
        console.log(err);
      }else{
        console.log(data);
      }
    })
  }
  console.log(data);
});
}

var asb = true;
if(asb == false)
{
// update existing user
User.find({where:{firstName:'Johna'}}).then(function (data, err) {
  if(err){
    console.log(err);
  }
  if(data){
    // data.updateatt = update given attributes in the object
    // attribute : attributevalue to edit to.
    data.updateAttributes({
      firstName:'Jens'
    }).then(function (data1) {
      console.log(data1);
    })
  }
});
}


var asb2 = true;
if(asb2 == false)
{
return sequelize.transaction(function (t) {

  // chain all your queries here. make sure you return them.
  return User.create({
    firstName: 'Abraham',
    lastName: null
  },   {transaction: t})

}).then(function (result) {
  console.log("Transaction has been committed");
  // Transaction has been committed
  // result is whatever the result of the promise chain returned to the transaction callback
}).catch(function (err) {
  console.log(err);
  // Transaction has been rolled back
  // err is whatever rejected the promise chain returned to the transaction callback
});
}




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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


module.exports = app;
