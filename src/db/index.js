var neo4j = require('neo4j');

console.log('Connecting to the DB server...');
var db = new neo4j.GraphDatabase({
  url: 'http://neo4j:testingneo4j@localhost:7474'
});

module.exports = db;
