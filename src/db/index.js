var neo4j = require(`neo4j-driver`).v1;
var devconfig = require(`../config/config.dev`);
var prodconfig = require(`../config/config.production`);

var config = devconfig;

console.log("Connecting to the DB server...");
// const db = new neo4j.GraphDatabase({
// 	url: `${config.host.rest.protocol}://
//     ${config.credentials.username}:${config.credentials.password}
//     @${config.host.rest.endpoint}`
// });

const driver = neo4j.driver(
    `${config.host.bolt.protocol}://${config.host.bolt.endpoint}`,
    neo4j.auth.basic(config.credentials.username, config.credentials.password)
);

//module.exports.dbHandle = db;

let _convertQueryResultToObject = record => {
    let jsonRecord = record.toObject();
    jsonRecord[record.keys[0]]._id = jsonRecord[
        record.keys[0]
    ].identity.toString();
    return jsonRecord;
};

module.exports.executeQuery = queryObj => {
    let session = driver.session();
    return session
        .run(queryObj.query, queryObj.params)
        .then(results => {
            session.close();
            return results.records.map(record =>
                _convertQueryResultToObject(record)
            );
        })
        .catch(err => console.log(`DB ERROR: ${err}`));
};
