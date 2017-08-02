var moment = require('moment');

class Place {
  constructor () {
    this.location = null;
    this.name = null;
    this.timings = null;
    this.coverImage = null;

    this.imageList = [];
  }
}

Place.create = (props, callback) => {

  var query = [
    'CREATE (place:Place {props})',
    'RETURN place'
  ].join('\n');

  let nowTime = moment().valueOf();
  props = Object.assign({}, props, {createdAt: nowTime, updatedAt: nowTime});
  db.cypher({
    query: query,
    params: {props},
  }, (err, results) => {
    if (err) {
      return callback(err);
    }

    console.log(results);
    callback(null, results);
  });
};

Place.getAll = (callback) => {
  var query = [
    'MATCH (place:Place) RETURN place'
  ].join('\n');

  db.cypher({query}, (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results);
  });
}

module.exports = Place;

/**
 * Relationships
 *  - Host(ing/ed) (an event)
 */
