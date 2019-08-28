let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

let shortUrlSchema = mongoose.Schema({
  id: Number,
  url: String
});
let ShortUrl = mongoose.model('Url', shortUrlSchema);

// ShortUrl.deleteMany({}, (err, data) => {
//   if (err)
//     console.log('delete all error: ' + err);
// });

let addUrl = (url, id, done) => {
  console.log('addUrl: ' + url);
  let newUrl = new ShortUrl({id: id, url: url});
  newUrl.save((err, data) => {
    if (err)
      return done(err);
    return done(null, data);
  });
}

let findUrl = (url, done) => {
  console.log('findUrl: ' + url);
  ShortUrl.findOne({url: url}, (err, data) => {
    if (err)
      return done(err);
    return done(null, data);
  });
}

let findUrlById = (id, done) => {
  ShortUrl.findOne({id: id}, (err, data) => {
    if (err)
      return done(err);
    return done(null, data);
  });
}

// Simulate database
// let tmp = [];

// let addUrl = (url, id, done) => {
//   let newUrl = {id: id, url: url};
//   setTimeout(() => {
//     tmp.push(newUrl);
//     console.log('addUrl: ');
//     console.log(tmp);
//     done(null, newUrl);
//     // done({});
//   }, 1000);
// }

// let findUrl = (url, done) => {
//   console.log('findUrl: ' + url);
//   console.log(tmp);
//   setTimeout(() => {
//     for (let i in tmp)
//       if (tmp[i].url == url)
//         return done(null, tmp[i]);
//     done(null, null);
//   }, 1000);
// }

// let findUrlById = (id, done) => {
//   console.log('findUrlById: ' + id);
//   console.log(tmp);
//   setTimeout(() => {
//     for (let i in tmp)
//       if (tmp[i].id == id)
//         return done(null, tmp[i]);
//     done(null, null);
//   }, 1000);
// }

//exports
exports.ShortUrl = ShortUrl;
exports.addUrl = addUrl;
exports.findUrl = findUrl;
exports.findUrlById = findUrlById;