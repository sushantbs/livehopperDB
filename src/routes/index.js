
let express = require('express');
let router = express.Router();

/**
 * User related operations
 */
var Person = require('../db/models/person');

router.get('/api/data/user/all', (req, res, next) => {

  console.log('get all users');
  //console.log(req.body);
  Person.getAll((err, response) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(response);
  })
});

router.get('/api/user', (req, res, next) => {
  var emailId = req.query.emailId;

  console.log('get user: ', emailId);
  if (!emailId) {
      res.status(500).send('Email Id has not been provided');
      return;
  }

  Person.get({emailId}, (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    console.log(result);
    res.send(result);
  })
});

router.post('/api/data/adduser', (req, res, next) => {
  console.log('add user');
  console.log(req.body);

  let name = req.body.name,
    emailId = req.body.emailId,
    age = req.body.age;

  Person.create({name, age, emailId}, (err, response) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(response);
  });
});

router.post('/api/data/removeuser', (req, res, next) => {
  console.log('remove user');
  console.log(req.body);
  res.send('ok');
});

router.post('/api/data/user/showlinkedartists', (req, res, next) => {
  console.log('show linked artists');
  let id = req.body.personId;

  (new Person({id}))
    .getLinkedArtists((err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    });
});

router.post('/api/data/user/feed', (req, res, next) => {
  console.log('show feed of a user');
  let id = req.body.personId;

  (new Person({id}))
    .getFeedList((err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    });
});

/**
 * Gigs related operations
 */
var Gig = require('../db/models/gig');

router.get('/api/data/gig/all', (req, res, next) => {

  console.log('get all gigs');
  //console.log(req.body);
  Gig.getAll((err, response) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(response);
  })
});

router.get('/api/data/gig/:gigId', (req, res, next) => {
  console.log('get gig');
  console.log(req.params.gigId);
  res.send('ok');
});

router.post('/api/data/addgig', (req, res, next) => {
  console.log('add gig');
  console.log(req.body);

  let name = req.body.name,
    date = req.body.date,
    hostId = req.body.hostId,
    time = req.body.time;

  Gig.create({name, date, time, hostId}, (err, response) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(response);
  });
});

router.put('/api/data/gig/update/:gigId', (req, res, next) => {

  console.log('update gig');
  let gigId = req.params.gigId,
    artist = req.body.artist,
    date = req.body.date,
    time = req.body.time,
    place = req.body.place;

  (new Gig({id: gigId}))
    .update({artist, date, time, place})
    .save((err, response) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.send(response);
    });
});

router.post('/api/data/removegig', (req, res, next) => {
  console.log('remove user');
  console.log(req.body);
  res.send('ok');
});


/**
 * Artist related operations
 */
var Artist = require('../db/models/artist');

router.get('/api/data/artist/all', (req, res, next) => {

  console.log('get all artists');
  //console.log(req.body);
  Artist.getAll((err, response) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.send(response);
  })
});

router.get('/api/data/artist/:username', (req, res, next) => {
  console.log('get user');
  console.log(req.params.username);
  res.send('ok');
});

router.post('/api/data/addartist', (req, res, next) => {
  console.log('add artist');
  console.log(req.body);

  let name = req.body.name,
    age = req.body.age,
    genre = req.body.genre;

  Artist.create({name, age, genre}, (err, response) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send(response);
  });
});

router.post('/api/data/removeartist', (req, res, next) => {
  console.log('remove user');
  console.log(req.body);
  res.send('ok');
});

/**
 * Hosts
 */

 var Host = require('../db/models/host');

 router.get('/api/data/host/all', (req, res, next) => {

   console.log('get all hosts');
   //console.log(req.body);
   Host.getAll((err, response) => {
     if (err) {
       res.status(500).send(err);
       return;
     }

     res.send(response);
   })
 });

 router.get('/api/data/host/:email', (req, res, next) => {
   console.log('get host by email: ', req.params.email);
   res.send('ok');
 });

 router.post('/api/data/addhost', (req, res, next) => {
   console.log('add host');
   console.log(req.body);

   let name = req.body.name,
     email = req.body.email,
     city = req.body.city,
     phone = req.body.phone;

   Host.create({name, email, city, phone}, (err, response) => {
     if (err) {
       return res.status(500).send(err);
     }

     res.send(response);
   });
 });

 router.post('/api/data/removehost/:email', (req, res, next) => {
   console.log('remove host');
   console.log(req.body);
   res.send('ok');
 });


/**
 * Relationships
 */
router.get('/api/relation/all/:nodeId', (req, res, next) => {

});

router.post('/api/relation/attending', (req, res, next) => {
  console.log('user IS ATTENDING event')
  let id = req.body.personId,
    gigId = req.body.gigId;

  (new Person({id}))
    .attend(gigId, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    })
});

router.post('/api/relation/like', (req, res, next) => {
  console.log('user IS ATTENDING event')
  let id = req.body.personId,
    gigId = req.body.gigId;

  (new Person({id}))
    .attend(gigId, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    })
});

router.post('/api/relation/likehost', (req, res, next) => {
  console.log('user likes host');

  let id = req.body.personId,
    hostId = req.body.hostId;

  (new Person({id}))
    .like(hostId, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    })
});

router.post('/api/relation/likeartist', (req, res, next) => {
  console.log('user likes artist');

  let id = req.body.personId,
    artistId = req.body.artistId;

  (new Person({id}))
    .like(artistId, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    });
});


router.post('/api/relation/performing', (req, res, next) => {
  console.log('artist IS PERFORMING AT event');
  let id = req.body.artistId,
    gigId = req.body.gigId;

  (new Artist({id}))
    .performing(gigId, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    })
});

router.post('/api/relation/hosting', (req, res, next) => {
  console.log('host IS HOSTING event');
  let hostId = req.body.hostId,
    gigId = req.body.gigId;

  (new Host({hostId}))
    .hosting(gigId, (err, response) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send(response);
    });
});

router.post('/api/search', (req, res, next) => {

});


router.post('/api/relation/remove/:relationId', (req, res, next) => {
  console.log('remove relationshio with Id');
});


/**
 * Rendering route
 */

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'GrassHopper Data Viewer'
  });
});

console.log('routes added');

module.exports = router;
