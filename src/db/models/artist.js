var Person = require("./person");
var executeQuery = require("../index").executeQuery;
var moment = require("moment");

class Artist extends Person {
    constructor(options) {
        super(options);
        this.fee = options.fee || null;
        this.genre = options.genre || null;
    }

    async performing(gigId, callback) {
        const query = `MATCH (artist:Artist), (gig:Gig) 
          WHERE ID(artist) = ${this.id} AND ID(gig) = ${gigId}
          CREATE UNIQUE (artist)-[perform:PERFORM {props}]->(gig)
          RETURN perform`;

        let nowTime = moment().valueOf();

        return await executeQuery({
            query,
            params: { props: { updatedAt: nowTime, createdAt: nowTime } }
        });
    }
}

Artist.create = async props => {
    const query = `CREATE (artist:Person:Artist {props}) RETURN artist`;
    let nowTime = moment().valueOf();
    props = Object.assign({}, props, {
        createdAt: nowTime,
        updatedAt: nowTime
    });

    return await executeQuery({ query, params: { props } });
};

Artist.getAll = async () => {
    const query = `MATCH (artist:Artist) RETURN artist`;
    return await executeQuery({ query });
};

/**
 * Relationships:
 *  - Belongs to (a genre)
 *  - Perform(ing/ed) at (an event)
 */

module.exports = Artist;
