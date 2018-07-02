const express = require('express');
const assert = require('assert');
const router = express.Router();
const debug = require('debug')('webmaster-tools:me');

// router.get('/', function(req, res, next) {
//   req.app.get('FB').getUser(req.session.accessToken, req.session.proof)
//   .then(user => {
//     res.json({
//       success: true,
//       data: user,
//     });
//   })
//   .catch(err => res.status(500).json({
//     success: false,
//     err,
//   }));
// });
router.get('/pages', function(req, res, next) {
  req.app.get('FB').getUserPages(req.session.accessToken, req.session.proof)
  .then(pages => {
    res.json({
      success: true,
      data: pages,
    });
  })
  .catch(err => res.status(500).json({
    success: false,
    err,
  }));
});
router.post('/', function(req, res, next) {
  const FB = req.app.get('FB');
  const accessToken = req.body.accessToken;
  const expiresIn = req.body.expiresIn;
  const proof = FB.getProof(accessToken);

  const { User } = req.app.get('models');

  FB.getUser(accessToken, proof)
  .then(fbUser => {
    debug('FB user', fbUser.name);
    assert(fbUser && fbUser.id, 'Could not find userId by calling facebook API');
    assert(!!accessToken, 'Missing accessToken');
    assert(!!accessToken, 'Missing accessToken');
    assert(!!expiresIn, 'Missing expiresIn');
    User.findOneAndUpdate(
      { userId: fbUser.id },
      {
        $set: {
          userId: fbUser.id,
          accessToken: accessToken,
          expiresIn: expiresIn,
          updated: Date.now(),
        },
      },
      {upsert: true},
      (err, user) => {
        debug('user found in DB', err, user);
        if(err) {
          res.status(500).json({
            success: false,
            err,
          });
        }
        else {
          debug('user logged in', fbUser.id);
          req.session.accessToken = accessToken;
          req.session.expiresIn = expiresIn;
          req.session.proof = proof;
          req.session.userId = fbUser.id;
          res.json({
            success: true,
            message: 'OK',
            data: fbUser,
          });
        }
      }
    );
  })
  .catch(err => res.status(500).json({
    success: false,
    err,
  }));
});
router.delete('/', function(req, res, next) {
  const userId = req.session.userId;
  debug('user logged out', userId);
  const wasLoggedIn = req.session.accessToken !== null;
  req.session.accessToken = null;
  req.session.userId = null;
  req.session.proof = null;
  res.json({
    success: true,
    message: (wasLoggedIn ? 'Ok' : 'OK (was not logged in)'),
  });
});

module.exports = router;
