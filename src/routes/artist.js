var express = require("express");
var router = express.Router();

/**
 * Artist related operations
 */
var Artist = require("../db/models/artist");

module.exports = router;

router.get("/all", (req, res, next) => {
    console.log("get all artists");
    //console.log(req.body);
    Artist.getAll()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get("/details", (req, res, next) => {
    console.log("get user");
    console.log(req.query.artistId);
    res.send("ok");
});

router.post("/add", (req, res, next) => {
    console.log("add artist");

    let { name, email, age, genre } = req.body;

    Artist.create({ name, email, age, genre })
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err));
});

router.delete("/remove", (req, res, next) => {
    console.log("remove user");
    res.send("ok");
});

router.post("/performing", (req, res, next) => {
    let id = req.body.artistId,
        gigId = req.body.gigId;

    console.log(`artist ${id} IS PERFORMING AT gig ${gigId}`);

    new Artist({ id })
        .performing(gigId)
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err));
});
