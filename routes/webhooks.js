const express = require('express');
const router = express.Router();
const assert = require('assert');
const debug = require('debug')('webmaster-tools:flows');

const utils = require('../utils');
const AdGenerator = require('../ad-generator');

router.post('/', function(req, res, next) {
  const { flowId, webhookToken } = req.body;
  const { Flow } = req.app.get('models');
  const FB = req.app.get('FB');
  executeHook(Flow, FB, webhookToken, flowId, req.body)
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});
router.get('/', function(req, res, next) {
  const { flowId, webhookToken } = req.query;
  const { Flow } = req.app.get('models');
  const FB = req.app.get('FB');
  executeHook(Flow, FB, webhookToken, flowId, req.query)
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});
function executeHook(Flow, FB, webhookToken, flowId, data) {
  debug('executeHook', webhookToken, flowId, data);
  assert(!!flowId, 'Missing flowId');
  assert(!!webhookToken, 'Missing webhookToken');
  return Flow.findOne(
    {_id: flowId, webhookToken: webhookToken}
  )
  .then(doc => {
    return AdGenerator.startJob(doc, data);
  })
  .then(({ websiteData, doc }) => {
    console.log('next step', websiteData, doc);
    return FB.createAd(doc.accessToken, doc.proof, doc, websiteData);
  })
  .then(({ ad, doc }) => {
    console.log('result of executeHook', data);
    // save new doc (ad => db)
    // get preview
    return ad;
  });
}

module.exports = router;
