const express = require('express');
const router = express.Router();
const debug = require('debug')('webmaster-tools:flows');
const utils = require('../utils');

router.get('/', function(req, res, next) {
  debug('router path GET /', req.query);
  const { accessToken, userId, proof } = req.session;
  const { Flow } = req.app.get('models');
  Flow.find({userId: userId, parentId: req.query.parentId}, (err, docs) => {
    if(err) utils.sendKo(res, err);
    else utils.sendOk(res, docs);
  });
});
router.post('/:flowId', function(req, res, next) {
  const { flowId } = req.params;
  const { name } = req.body;
  const { accessToken, userId, proof } = req.session;
  const { Flow } = req.app.get('models');
  Flow.findOneAndUpdate(
    {userId: userId, flowId: flowId},
    {
      $set: {
        name: name,
      }
    },
    {upsert: true},
    (err, doc) => {
      debug('router POST ')
      if(err) utils.sendKo(res, err);
      else utils.sendOk(res, doc);
    }
  );
});
router.delete('/:flowId', function(req, res, next) {
  const { flowId } = req.params;
  const { accessToken, userId, proof } = req.session;
  const { Flow } = req.app.get('models');
  debug('findOneAndDelete', userId, flowId);
  Flow.findOneAndDelete(
    {userId: userId, _id: flowId},
    (err, doc) => {
      debug('router DELETE ', err, doc);
      if(err) utils.sendKo(res, err);
      else if(doc === null) utils.sendKo(res, 'Not found');
      else utils.sendOk(res);
    }
  );
});
router.post('/', function(req, res, next) {
  debug('router path POST /', req.params);
  const { parentId, name } = req.body;
  const { accessToken, userId, proof } = req.session;
  const { Flow } = req.app.get('models');
  Flow.create(
    {
      userId: userId,
      parentId: parentId,
      name: name,
    },
    (err, doc) => {
      debug('router POS ')
      if(err) utils.sendKo(res, err);
      else utils.sendOk(res, doc);
    }
  );
});

module.exports = router;
