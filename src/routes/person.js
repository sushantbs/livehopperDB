var express = require("express");
var router = express.Router();

/**
 * User related operations
 */
var Person = require("../db/models/person");

/**
 * Get user profile
 * req.query.email {String} email of the user
 */
router.get("/details", (req, res, next) => {
    var email = req.query.email;
    console.log(`get profile for: ${email}`);

    if (!email) {
        res.status(500).send("Email Id has not been provided");
        return;
    }

    Person.get({ email })
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Get all users in the system
 * WARNING: To be used with care as it is a very expensive operation.
 * TODO: Pagination of this query
 */
router.get("/all", (req, res, next) => {
    console.log("get all users");
    Person.getAll()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Add a new user into the system
 * req.body {Object} contains all the details of the user.
 * email and name should be mandatory
 */
router.post("/add", (req, res, next) => {
    let name = req.body.name,
        email = req.body.email;

    console.log(`adding user: ${email}, ${name}`);
    Person.create({ name, email })
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Remove the user from the system.
 * TODO: Implement this method
 * req.body.personId
 */
router.delete("/remove", (req, res, next) => {
    let id = req.body.personId;
    console.log(
        `If remove was implemented the that would have been removed: ${id}`
    );
    res.send("ok");
});

/**
 * Get artists that are followed by the user
 */
router.get("/likedartists", (req, res, next) => {
    let id = req.query.personId;
    console.log(`show artists followed by: ${id}`);

    new Person({ id })
        .getLikedArtists()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Get artists that are followed by the user
 */
router.get("/likedhosts", (req, res, next) => {
    let id = req.query.personId;
    console.log(`show artists followed by: ${id}`);

    new Person({ id })
        .getLikedHosts()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Get the feed items as an array that pertain to the user.
 * The order is reverse chronological, for now.
 */
router.post("/feed", (req, res, next) => {
    let id = req.body.personId;
    console.log(`show feed of a user: ${id}`);

    new Person({ id })
        .getFeedList()
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Search for a particular search term.
 * Search results can include, hosts, artists, events and other users
 */
router.post("/search", (req, res, next) => {
    let id = req.body.personId,
        searchTem = req.bodt.searchTerm;

    console.log(`search request for ${searchTerm} made by: ${id}`);

    // TOOD: Caching the models against the session id ought to be
    // used to improve performance. More later...
    new Person({ id })
        .search(searchTerm)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Get the recently searched items by the user
 */
router.get("/searchhistory", (req, res, next) => {
    let id = req.query.personId,
        count = req.query.count;
    console.log(`search history of: ${id}`);

    new Person({ id })
        .getSearchHistory(count)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

/**
 * Like a host
 */
router.post("/likehost", (req, res, next) => {
    let id = req.body.personId,
        hostId = req.body.hostId;

    console.log(`user ${id} likes host ${hostId}`);
    new Person({ id })
        .like(hostId)
        .then(response => {
            res.send(response);
        })
        .err(err => {
            res.status(500).send(err);
        });
});

/**
 * Like an artist
 */
router.post("/likeartist", (req, res, next) => {
    let id = req.body.personId,
        artistId = req.body.artistId;

    console.log(`user ${id} likes artist ${artistId}`);
    new Person({ id })
        .like(artistId)
        .then(response => {
            res.send(response);
        })
        .err(err => {
            res.status(500).send(err);
        });
});

/**
 * Mark an event as attending
 */
router.post("/attending", (req, res, next) => {
    let id = req.body.personId,
        gigId = req.body.gigId;

    console.log(`user ${id} IS ATTENDING gig ${gigId}`);
    new Person({ id })
        .attending(gigId)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

/**
 * Mark an event as interested
 */
router.post("/interested", (req, res, next) => {
    let id = req.body.personId,
        gigId = req.body.gigId;

    console.log(`user ${id} IS ATTENDING gig ${gigId}`);
    new Person({ id })
        .interested(gigId)
        .then(response => {
            res.send(response);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

module.exports = router;
