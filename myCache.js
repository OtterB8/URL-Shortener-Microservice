// This is used to not get database polluted if concurrent requests have the same url
class MyCache {
  constructor() {
    this.cache = {};
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
    this.decrease = this.decrease.bind(this);
    this.getId = this.getId.bind(this);
    this.setId = this.setId.bind(this);
    this.log = this.log.bind(this);
  }
  remove(key) {
    delete this.cache[key];
  }
  add(key) {
    if (this.cache[key] === undefined) {
      this.cache[key] = {
        count: 1,
        id: -1
      };
    } else
      ++this.cache[key].count;
  }
  decrease(key) {
    if (this.cache[key] === undefined)
      return;
    if (--this.cache[key].count === 0)
      this.remove(key);
  }
  getId(key) {
    if (this.cache[key] === undefined || this.cache[key].id === -1)
      return null;
    return this.cache[key].id;
  }
  setId(key, id) {
    if (this.cache[key] === undefined)
      return;
    this.cache[key].id = id;
  }
  log() {
    console.log(this.cache);
  }
}

exports.MyCache = MyCache;