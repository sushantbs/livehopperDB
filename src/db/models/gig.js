var db = require('../index'),
  moment = require('moment');

class Gig {
  constructor (options) {
    this.id = options.id || null;
    this.name = options.name || null;
    this.date = options.date || null;
    this.startTime = options.startTime || null;
    this.durations = options.duration || null;

    this.ratings = this.ratings || null;
    this.schedule = this.schedule || null;

    // if (this.id) {
    //   db.cypher('MATCH g:Gig ')
    // } else {
    //
    // }
  }
}

Gig.prototype.read = () => {

}

Gig.create = (props, callback) => {

  var query = [
    'CREATE (gig:Gig {props})',
    ((props.hostId) ? 'WITH gig MATCH (host:Host) WHERE id(host) = ' + props.hostId + ' CREATE UNIQUE (host)-[hosting:HOSTING]->(gig)' : ''),
    'RETURN gig,hosting'
  ].join('\n');

  let nowTime = moment().valueOf(),
    hostId = {props};

  props = Object.assign({}, props, {createdAt: nowTime, updatedAt: nowTime});

  db.cypher({
    query: query,
    params: {props, }
  }, (err, results) => {
    if (err) {
      return callback(err);
    }

    console.log(results);
    callback(null, results);
  });
};

Gig.getAll = (callback) => {
  var query = [
    'MATCH (gig:Gig) RETURN gig'
  ].join('\n');

  db.cypher({query}, (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results);
  });
}

module.exports = Gig;
