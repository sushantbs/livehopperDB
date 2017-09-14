var express = require("express");
var router = express.Router();

/**
 * Gigs related operations
 */
var Gig = require("../db/models/gig");

/**
 * Get the details of a particular gig
 * TODO:HIGH Implement this method
 * @type {[type]}
 */
router.get("/details", (req, res, next) => {
    let id = req.body.gigId;
    console.log("get gig");

    if (!id) {
        return res.status(400).send(`Gig Id not found in the request body`);
    }

    new Gig({ id })
        .getDetails()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

/**
 * Get all gigs in the database
 */
router.get("/all", (req, res, next) => {
    console.log("get all gigs");

    Gig.getAll()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

/**
 * Add a new gig
 */
router.post("/add", (req, res, next) => {
    let name = req.body.name,
        date = req.body.date,
        hostId = req.body.hostId,
        time = req.body.time;

    console.log(
        `adding gig: name = ${name}, date = ${date}, hostId = ${hostId}`
    );

    Gig.create({ name, date, time, hostId })
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

/**
 * Update the properties of an existing gig
 * @type {[type]}
 */
router.put("/update", (req, res, next) => {
    let gigId = req.body.gigId,
        artist = req.body.artist,
        date = req.body.date,
        time = req.body.time,
        place = req.body.place;

    if (!id) {
        return res.status(400).send(`Gig Id not found in the request body`);
    }

    console.log(
        `update gig: gigId = ${gigId}, name = ${name}, date = ${date}, hostId = ${hostId}`
    );

    new Gig({ id: gigId })
        .update({ artist, date, time, place })
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get("/getAttendees", (req, res, next) => {
    let gigId = req.body.gigId;

    if (!id) {
        return res.status(400).send(`Gig Id not found in the request body`);
    }

    console.log(`get attendees: gigId = ${gigId}`);

    new Gig({ id: gigId })
        .getAttendees()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get("/getInterested", (req, res, next) => {
    let gigId = req.body.gigId;

    if (!id) {
        return res.status(400).send(`Gig Id not found in the request body`);
    }

    console.log(`get interested: gigId = ${gigId}`);

    new Gig({ id: gigId })
        .getInterested()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get("/getArtists", (req, res, next) => {
    let gigId = req.body.gigId;

    if (!id) {
        return res.status(400).send(`Gig Id not found in the request body`);
    }

    console.log(`get aritsts: gigId = ${gigId}`);

    new Gig({ id: gigId })
        .getArtists()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.get("/getHosts", (req, res, next) => {
    let gigId = req.body.gigId;

    if (!id) {
        return res.status(400).send(`Gig Id not found in the request body`);
    }

    console.log(`get hosts: gigId = ${gigId}`);

    new Gig({ id: gigId })
        .getHosts()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

/**
 * TODO: Implement this method. Add comments.
 */
router.delete("/remove", (req, res, next) => {
    res.send("ok");
});
