let express = require("express");
let router = express.Router();
let personRouteHandler = require("./person");
let gigRouteHandler = require("./gig");
let artistRouteHandler = require("./artist");
let hostRouteHandler = require("./host");
let Categories = require("../db/models/categories");

router.use("/api/user", personRouteHandler);
router.use("/api/gig", gigRouteHandler);
router.use("/api/artist", artistRouteHandler);
router.use("/api/host", hostRouteHandler);

router.get("/api/allcategories", async (req, res, next) => {
    try {
        let categories = await Categories.getAll();
        res.send(categories);
    } catch (e) {
        res.status(500).send(e);
    }
});
/**
 * Rendering route
 */

router.get("/", (req, res, next) => {
    res.render("index", {
        title: "GrassHopper Data Viewer"
    });
});

module.exports = router;
