//const db = require('../index').dbHandle;
const executeQuery = require("../index").executeQuery;
const moment = require("moment");

class Person {
    /**
   * TODO: Phone number should be used and should be used as a primary key.
   */
    constructor(options) {
        if (!options) {
            options = {};
        }

        this.name = options.name;
        this.email = options.email;
        this.age = options.age;
        this.gender = options.gender;
        this.phoneNumber = options.phoneNumber;

        this.socialId = options.socialId;
        this.baseLocation = options.baseLocation;

        this.id = options.id;
    }

    async readByEmail() {}

    async like(entityId) {
        const nowTime = moment().valueOf();
        const props = { createdAt: nowTime, updatedAt: nowTime };
        const query = `MATCH (person:Person), (entity)
			WHERE ID(person) = ${this.id} AND ID(entity) = ${entityId}
			CREATE UNIQUE (person)-[like:LIKE {props}]->(entity)
			RETURN like`;

        return await executeQuery({ query, params: { props } });
    }

    async attend(gigId) {
        const query = `MATCH (person:Person), (gig:Gig)
			WHERE ID(person) = ${this.id} AND ID(gig) = ${gigId}
			CREATE UNIQUE (person)-[attend:ATTEND {props}]->(gig)
			RETURN attend`;

        const nowTime = moment().valueOf();
        const props = { createdAt: nowTime, updatedAt: nowTime };

        return await executeQuery({ query, params: { props } });
    }

    async follow(personId) {
        const query = `MATCH (person:Person), (toFollow:Person)
		WHERE ID(person) = ${this.id} AND ID(toFollow) = ${personId}
		CREATE UNIQUE (person)-[follow:FOLLOW {props}]->(toFollow)
		RETURN follow`;

        const nowTime = moment().valueOf();
        const props = { createdAt: nowTime, updatedAt: nowTime };

        return await executeQuery({ query, params: { props } });
    }

    async getFollowers() {
        const query = `MATCH (person:Person)-[:FOLLOW]->(me:Person)
		WHERE ID(me) = ${this.id}
		RETURN person`;

        return await executeQuery({ query });
    }

    async getFollowing() {
        const query = `MATCH (me:Person)-[:FOLLOW]->(person:Person)
		WHERE ID(me) = ${this.id}
		RETURN person`;

        return await executeQuery({ query });
    }

    async getFullGigList() {
        const query = `MATCH (me:Person)-[:ATTEND]->(gig:Gig)
		WHERE ID(me) = ${this.id}
		RETURN gig`;

        return await executeQuery({ query });
    }

    async getUpcomingGigList() {
        let now = moment().valueOf();
        const query = `MATCH (me:Person)-[:ATTEND]->(gig:Gig)
		WHERE ID(me) = ${this.id} AND gig.startTime >= ${now}
		RETURN gig`;

        return await executeQuery({ query });
    }

    async getPastGigList() {
        let now = moment().valueOf();
        const query = `MATCH (me:Person)-[:ATTEND]->(gig:Gig)
		WHERE ID(me) = ${this.id} AND gig.startTime < ${now}
		RETURN gig`;

        return await executeQuery({ query });
    }

    async getLikedArtists() {
        const query = `MATCH (me:Person)-[:LIKE]->(artist:Artist)
		WHERE ID(me) = ${this.id}
		RETURN artist`;

        return await executeQuery({ query });
    }

    async getLikedHosts() {
        const query = `MATCH (me:Person)-[:LIKE]->(host:Host)
		WHERE ID(me) = ${this.id}
		RETURN host`;

        return await executeQuery({ query });
    }

    async search() {}

    async getSearchHistory() {}

    async getLinkedArtists() {
        const query = `MATCH (p:Person)-[:ATTEND]->(gig:Gig)<-[:PERFORM]-(artist:Artist)
			WHERE ID(p) = ${this.id}
			RETURN artist,gig`;

        return await executeQuery({ query });
    }

    async getLinkedHosts() {
        const query = `MATCH (p:Person)-[:ATTEND]->(gig:Gig)<-[:HOSTING]-(host:Host)
			WHERE ID(p) = ${this.id}
			RETURN host,gig`;

        return await executeQuery({ query });
    }

    async getFeedList() {
        const query = `MATCH (me)-[:LIKE]->(actor)-[relation:HOSTING|PERFORM]->(gig)
			WHERE id(me) = ${this.id}
			RETURN actor,relation,gig
			UNION
			MATCH (actor)-[relation:ATTEND]->(gig) WHERE id(actor) = ${this.id}
			RETURN actor,relation,gig`;

        return await executeQuery({ query });
    }
}

Person.create = async props => {
    const query = `CREATE (person:Person {props}) RETURN person`;
    const nowTime = moment().valueOf();

    props = Object.assign({}, props, {
        createdAt: nowTime,
        updatedAt: nowTime
    });
    return await executeQuery({ query, params: { props } });
};

Person.get = async props => {
    const query = `MATCH (person:Person {email: {email}}) RETURN person`;
    return await executeQuery({ query, params: { props } });
};

Person.getAll = async () => {
    const query = `MATCH (person:Person) RETURN person`;
    let results = await executeQuery({ query });
    return results;
};

// db.createConstraint({ label: 'Person', property: 'email' }, (err, result) => {
// 	console.log('Final Constraint result: ', err, result);
// });

/**
 * Relationships:
 *  - Follows (artist)
 *  - Likes (location)
 *  - Buddy (person)
 *  - Prefers (genre)
 *  - Attend(ing/ed) (an event)
 */

module.exports = Person;
