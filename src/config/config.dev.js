module.exports = {
	host: {
		rest: {
			protocol: 'http',
			endpoint: 'localhost:7474'
		},
		bolt: {
			protocol: 'bolt',
			endpoint: 'localhost'
		}
	},
	credentials: {
		username: 'neo4j',
		password: 'testingneo4j'
	}
};
