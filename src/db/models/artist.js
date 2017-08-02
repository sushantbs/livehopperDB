var Person = require('./person');
var db = require('../index');
var moment = require('moment');

class Artist extends Person {
  constructor (options) {
    super(options);
    this.fee = options.fee || null;
    this.genre = options.genre || null;
  }

  performing (gigId, callback) {
    var query = [
      'MATCH (artist:Artist), (gig:Gig) WHERE ID(artist) = ' + this.id + ' AND ID(gig) = ' + gigId,
      'CREATE UNIQUE (artist)-[perform:PERFORM {props}]->(gig)',
      'RETURN perform'
    ].join('\n');

    let nowTime = moment().valueOf();
    db.cypher({
      query: query,
      params: {props: {updatedAt: nowTime, createdAt: nowTime}}
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      console.log(results);
      callback(null, results);
    });
  }
}

Artist.create = (props, callback) => {

  var query = [
    'CREATE (artist:Person:Artist {props})',
    'RETURN artist'
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

Artist.getAll = (callback) => {
  var query = [
    'MATCH (artist:Artist) RETURN artist'
  ].join('\n');

  db.cypher({query}, (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results);
  });
}

/**
 * Relationships:
 *  - Belongs to (a genre)
 *  - Perform(ing/ed) at (an event)
 */

module.exports = Artist;
