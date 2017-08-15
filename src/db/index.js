var neo4j = require(`neo4j`);
var config = require(`../config/config.production`);

console.log('Connecting to the DB server...');
var db = new neo4j.GraphDatabase({
  url: `${config.host.rest.protocol}://${config.credentials.username}:${config.credentials.password}@${config.host.rest.endpoint}`
});

module.exports = db;
