const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const db             = require('./config/db');
const app            = express();
const ejs = require('ejs');
const mongoose = require('mongoose');


app.use(express.urlencoded({extended:false}))

app.set('view engine', 'ejs');
const port = 4000;


//=======================//
app.use('/app',  express.static(__dirname +'/app'));

mongoose.connect(db.url, (err, database) => {
 if (err) return console.log(err)
 require('./app/routes')(app, database);




 app.listen(port, () => {
   console.log('We are live on ' + port);
 });
})
