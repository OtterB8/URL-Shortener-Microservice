'use strict';

let express = require('express');
let mongo = require('mongodb');
let model = require('./model.js');
let cache = require('./myCache.js');
let dns = require('dns');

let cors = require('cors');

let app = express();

// Basic Configuration 
let port = process.env.PORT || 3000;

app.use(cors());

// mount the body-parser
let bodyParser = require('body-parser');
app.post('/api/shorturl/new', bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// API endpoint
const REPLACE_REGEX = /^https?:\/\//i;
const URL_REGEX = /^https?:\/\/w{3}.[a-z0-9]+.[a-z0-9]+(\/[a-z0-9]+)*$/i;

app.post('/api/shorturl/new', (req, res, next) => {
  if (!URL_REGEX.test(req.body.url)) {
    return res.json({error:"invalid Url"});
  }
  const url = req.body.url.replace(REPLACE_REGEX, '');
  dns.lookup(url, (err) => {
    if (err) {
      return res.json({error:"invalid Hostname"});
    }
    req.body.url = url;
    next();
  });
});

app.post('/api/shorturl/new', (req, res) => {
  let url = req.body.url;
  myCache.add(url);
  model.findUrl(url, (err, data) => {
    if (err) {
      console.log('Find url error: ' + err);
      res.send('Server error 1');
      return myCache.decrease(url);
    }
    
    if (data !== null) {
      res.json({original_url: url, short_url: data.id});
      myCache.decrease(url);
    } else {
      let id = myCache.getId(req.body.url);
      if (id === null) {
        myCache.setId(url, counter);
        model.addUrl(url, counter++, (err, data) => {
          if (err) {
            console.log('Save error: ' + err);
            res.send('Server error 2');
          } else {
            res.json({original_url: url, short_url: data.id});
          }
          myCache.decrease(url);
        });
      } else {
        model.findUrl(url, (err, data) => {
          if (err) {
            console.log('Find url error: ' + err);
            res.send('Server error 3');
          } else {
            if (data)
              res.json({original_url: url, short_url: data.id});
            else
              res.send('Server error 4');
          }
          myCache.decrease(url);
        });
      }
    }
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  model.findUrlById(req.params.id, (err, data) => {
    if (err) {
      console.log('Find url error: ' + err);
      return res.send('Server error');
    }
    if (data !== null)
      res.redirect('https://' + data.url);
    else
      res.send('Shortened Url not existed');
  });
});

app.get('/api/shorturl', (req, res) => {
  res.send("Not found");
});

// power up
let myCache = new cache.MyCache();
let counter = null;

model.ShortUrl
      .findOne()
      .sort({_id: -1})
      .exec((err, data) => {
        if (err) {
          console.log('Power up error');
          return;
        }
        if (data === null)
          counter = 0;
        else
          counter = data.id + 1;
        console.log(counter);
        app.listen(port, function () {
          console.log('Node.js listening ...');
        });
      });
