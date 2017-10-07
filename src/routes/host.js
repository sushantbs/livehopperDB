var express = require("express");
var router = express.Router();

/**
 * Hosts
 */

var Host = require("../db/models/host");

module.exports = router;

/**
 * Get the profile of the host with the given email OR id
 */
router.get("/profile", (req, res, next) => {
    console.log("get host by email: ", req.body.email);
    res.send("ok");
});

/**
 * Getthe list of all the hosts in the system
 * WARNING: Use carefully!
 */
router.get("/all", (req, res, next) => {
    console.log("get all hosts");

    Host.getAll()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.post("/add", (req, res, next) => {
    let { name, email, city, phone } = req.body;

    console.log(
        `add host with props name=${name}, email=${email}, city=${city}`
    );

    Host.create({ name, email, city, phone })
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.post("/remove", (req, res, next) => {
    console.log("remove host");
    res.send("ok");
});

router.post("/hosting", (req, res, next) => {
    let id = req.body.hostId,
        gigId = req.body.gigId;

    console.log(`host ${id} IS HOSTING the gig ${gigId}`);

    new Host({ id })
        .hosting(gigId)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});
