var executeQuery = require("../index").executeQuery,
    moment = require("moment");

class Gig {
    constructor(options) {
        this.id = options.id || null;
        this.name = options.name || null;
        this.date = options.date || null;
        this.startTime = options.startTime || null;
        this.durations = options.duration || null;

        this.ratings = this.ratings || null;
        this.schedule = this.schedule || null;
    }
}

Gig.prototype.getDetails = async () => {
    const query = `MATCH (gig:Gig) WHERE ID(gig) = ${this.id} RETURN gig`;

    return await executeQuery({ query });
};

Gig.prototype.getAttendees = async () => {
    const query = `MATCH (gig:Gig)<-[:ATTEND]-(attends:Person) 
    WHERE ID(gig) = ${this.id} 
    RETURN attends`;

    return await executeQuery({ query });
};

Gig.prototype.getArtists = async () => {
    const query = `MATCH (gig:Gig)<-[:PERFORM]-(artist:Artist) 
    WHERE ID(gig) = ${this.id} 
    RETURN artist`;

    return await executeQuery({ query });
};

Gig.prototype.getHosts = async () => {
    const query = `MATCH (gig:Gig)<-[:HOSTING]-(host:Host) 
    WHERE ID(gig) = ${this.id} 
    RETURN host`;

    return await executeQuery({ query });
};

Gig.prototype.rate = async () => {};

Gig.prototype.getRating = async () => {};

Gig.prototype.addHost = async hostId => {
    const query = `MATCH (gig:Gig), (host:Host) 
    WHERE ID(gig) = ${this.id} AND ID(host) = ${hostId}
    CREATE UNIQUE (host)-[hosting:HOSTING {props}]->(gig)
    RETURN hosting`;

    const nowTime = moment().valueOf();
    const props = { createdAt: nowTime, updatedAt: nowTime };

    return await executeQuery({ query, params: { props } });
};

Gig.prototype.addArtist = async artistId => {
    const query = `MATCH (gig:Gig), (artist:Artist) 
    WHERE ID(gig) = ${this.id} AND ID(artist) = ${artistId}
    CREATE UNIQUE (artist)-[perform:PERFORM {props}]->(gig)
    RETURN perform`;

    const nowTime = moment().valueOf();
    const props = { createdAt: nowTime, updatedAt: nowTime };

    return await executeQuery({ query, params: { props } });
};

Gig.create = async props => {
    if (!props.creatorHostId && !host.creatorArtistId) {
        return Promise.reject(new Error(`Creator Id not provided`));
    }

    let creationConstraint = props.creatorHostId
        ? `WITH gig MATCH (host:Host) 
			WHERE id(host) = ${props.creatorHostId} 
			CREATE UNIQUE (host)-[hosting:HOSTING]->(gig)`
        : `WITH gig MATCH (artist:Artist) 
			WHERE id(host) = ${props.creatorArtistId} 
			CREATE UNIQUE (artist)-[perform:PERFORM]->(gig)`;

    let nowTime = moment().valueOf(),
        hostId = { props };

    const query = `CREATE (gig:Gig {props})
		${creationConstraint}
		RETURN gig,hosting`;

    props = Object.assign({}, props, {
        createdAt: nowTime,
        updatedAt: nowTime
    });

    return await executeQuery({ query, params: { props } });
};

Gig.getAll = async () => {
    var query = `MATCH (gig:Gig) RETURN gig`;
    return await executeQuery({ query });
};

module.exports = Gig;
