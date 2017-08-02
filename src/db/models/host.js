var Person = require('./person');
var db = require('../index');
var moment = require('moment');

class Host extends Person {

  constructor (options) {
    super(options);
    this.city = options.city || null;
  }

  hosting (gigId, callback) {
    var query = [
      'MATCH (host:Host), (gig:Gig) WHERE ID(host) = ' + this.id + ' AND ID(gig) = ' + gigId,
      'CREATE UNIQUE (host)-[hosting:HOSTING {props}}]->(gig)',
      'RETURN hosting'
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

Host.create = (props, callback) => {

  var query = [
    'CREATE (host:Person:Host {props})',
    'RETURN host'
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

Host.getAll = (callback) => {
  var query = [
    'MATCH (host:Host) RETURN host'
  ].join('\n');

  db.cypher({query}, (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results);
  });
}


/**
 * Relationships
 *  - Host(ing/ed) (an event)
 */
module.exports = Host;
