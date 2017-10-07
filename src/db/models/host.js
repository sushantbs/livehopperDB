var Person = require("./person");
var executeQuery = require("../index").executeQuery;
var moment = require("moment");

class Host extends Person {
    constructor(options) {
        super(options);
        this.city = options.city || null;
    }

    async hosting(gigId) {
        const query = `MATCH (host:Host), (gig:Gig) 
          WHERE ID(host) = ${this.id} AND ID(gig) = ${gigId}
          CREATE UNIQUE (host)-[hosting:HOSTING {props}}]->(gig)
          RETURN hosting`;

        let nowTime = moment().valueOf();
        return await executeQuery({
            query,
            params: { props: { updatedAt: nowTime, createdAt: nowTime } }
        });
    }
}

Host.create = async props => {
    const query = `CREATE (host:Person:Host {props}) RETURN host`;

    let nowTime = moment().valueOf();
    props = Object.assign({}, props, {
        createdAt: nowTime,
        updatedAt: nowTime
    });

    return await executeQuery({
        query,
        params: { props }
    });
};

Host.getAll = async () => {
    var query = `MATCH (host:Host) RETURN host`;
    return await executeQuery({ query });
};

/**
 * Relationships
 *  - Host(ing/ed) (an event)
 */
module.exports = Host;
