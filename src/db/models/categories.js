const executeQuery = require("../index").executeQuery;
const moment = require("moment");

class Categories {
    constructor() {}

    static async getAll() {
        let query = `MATCH (c:Category) RETURN c`;
        return await executeQuery({ query });
    }
}

module.exports = Categories;
