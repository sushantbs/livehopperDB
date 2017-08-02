var db = require('../index');
var moment = require('moment');

class Person {

  /**
   * TODO: Phone number should be used and should be used as a primary key.
   */
  constructor (options) {
    if (!options) {
      options = {};
    }

    this.name = options.name;
    this.emailId = options.emailId;
    this.age = options.age;
    this.gender = options.gender;
    this.phoneNumber = options.phoneNumber;

    this.socialId = options.socialId;
    this.baseLocation = options.baseLocation;

    this.id = options.id;
  }

  persist () {

  }

  like (entityId, callback) {
    var query = [
      'MATCH (person:Person), (entity) WHERE ID(person) = ' + this.id + ' AND ID(entity) = ' + entityId,
      'CREATE UNIQUE (person)-[like:LIKE {props}]->(entity)',
      'RETURN like'
    ].join('\n');

    let nowTime = moment().valueOf(),
      props = {createdAt: nowTime, updatedAt: nowTime};

    db.cypher({
      query: query,
      params: {props}
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      console.log(results);
      callback(null, results);
    });
  }

  attend (gigId, callback) {
    var query = [
      'MATCH (person:Person), (gig:Gig) WHERE ID(person) = ' + this.id + ' AND ID(gig) = ' + gigId,
      'CREATE UNIQUE (person)-[attend:ATTEND {props}]->(gig)',
      'RETURN attend'
    ].join('\n');

    let nowTime = moment().valueOf(),
      props = {createdAt: nowTime, updatedAt: nowTime};

    db.cypher({
      query: query,
      params: {props}
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      console.log(results);
      callback(null, results);
    });
  }

  getLinkedArtists (callback) {

    var query = [
      'MATCH (p:Person)-[:ATTEND]->(gig:Gig)<-[:PERFORM]-(artist:Artist) WHERE ID(p) = ' + this.id,
      'RETURN artist,gig'
    ].join('\n');

    db.cypher({
      query: query
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      console.log(JSON.stringify(results, null, 2));
      callback(null, results);
    });
  }

  getFeedList (callback) {
    var query = [
      'MATCH (me)-[:LIKE]->(actor)-[relation:HOSTING|PERFORM]->(gig) WHERE id(me) = ' + this.id,
      'RETURN actor,relation,gig',
      'UNION',
      'MATCH (actor)-[relation:ATTEND]->(gig) WHERE id(actor) = ' + this.id,
      'RETURN actor,relation,gig'
    ].join('\n');

    console.log(query);

    db.cypher({
      query: query
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      console.log(JSON.stringify(results, null, 2));
      callback(null, results);
    });
  }
}

Person.create = (props, callback) => {

  var query = [
    'CREATE (person:Person {props})',
    'RETURN person'
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

Person.get = (props, callback) => {
  console.log(props);
  var query = 'MATCH (person:Person {emailId: {emailId}}) RETURN person';
  db.cypher({query, params: props}, callback);
}

Person.getAll = (callback) => {
  var query = [
    'MATCH (person:Person) RETURN person'
  ].join('\n');

  db.cypher({query}, (err, results) => {
    if (err) {
      return callback(err);
    }

    callback(null, results);
  });
}

db.createConstraint({label: 'Person', property: 'emailId'}, (err, result) => {
  console.log('Final Constraint result: ', err, result);
});

/**
 * Relationships:
 *  - Follows (an artist)
 *  - Likes (a location)
 *  - Buddy (a person)
 *  - Prefers (a cuisine or a genre)
 *  - Attend(ing/ed) (an event)
 */

module.exports = Person;
