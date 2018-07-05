const express = require('express');
const router = express.Router();
const assert = require('assert');
const mongoose = require('mongoose');
const crypto = require('crypto');
const debug = require('debug')('webmaster-tools:flows');

const utils = require('../utils');

router.get('/', function(req, res, next) {
  debug('router path GET /', req.query);
  const { accessToken, userId } = req.session;
  const { parentId } = req.query;
  const { Flow } = req.app.get('models');
  assert(!!userId, 'Missing userId');
  assert(!!parentId, 'Missing parentId');
  Flow.find({userId: userId, parentId: parentId}, (err, docs) => {
    if(err) utils.sendKo(res, err);
    else utils.sendOk(res, docs);
  });
});
router.post('/:flowId', function(req, res, next) {
  const { flowId } = req.params;
  const { parentId, name, page, paused, accountId } = req.body;
  const { accessToken, userId } = req.session;
  const { Flow } = req.app.get('models');
  assert(!!userId, 'Missing userId');
  assert(!!flowId, 'Missing flowId');
  debug('before findOneAndUpdate', userId, flowId);
  debug('===>', mongoose.Types.ObjectId(flowId));
  Flow.findOneAndUpdate(
    {userId: userId, _id: mongoose.Types.ObjectId(flowId)},
    {
      $set: {
        accessToken: accessToken,
        parentId: parentId,
        accountId: accountId,
        page: JSON.parse(page),
        paused: paused,
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
  const { accessToken, userId } = req.session;
  const { Flow } = req.app.get('models');
  debug('findOneAndDelete', userId, flowId);
  assert(!!userId, 'Missing userId');
  assert(!!flowId, 'Missing flowId');
  Flow.findOneAndDelete(
    {userId: userId, _id: mongoose.Types.ObjectId(flowId)},
    (err, doc) => {
      debug('router DELETE ', err, doc);
      if(err) utils.sendKo(res, err);
      else if(doc === null) utils.sendKo(res, 'Not found');
      else utils.sendOk(res);
    }
  );
});
router.post('/', function(req, res, next) {
  debug('router path POST /', req.body);
  const { parentId, name, page, paused, accountId } = req.body;
  const { accessToken, userId } = req.session;
  const { Flow } = req.app.get('models');
  assert(!!userId, 'Missing userId');
  assert(!!parentId, 'Missing parentId');
  assert(!!page, 'Missing page');
  assert(typeof paused != 'undefined', 'Missing paused');
  Flow.create(
    {
      userId: userId,
      accessToken: accessToken,
      parentId: parentId,
      accountId: accountId,
      page: JSON.parse(page),
      paused: paused,
      name: name,
      webhookToken: crypto.randomBytes(16).toString('hex'),
    },
    (err, doc) => {
      debug('router POST ')
      if(err) utils.sendKo(res, err);
      else utils.sendOk(res, doc);
    }
  );
});

module.exports = router;
