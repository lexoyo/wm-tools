const utils = require('../utils');
const express = require('express');
const router = express.Router();
const debug = require('debug')('webmaster-tools:ads');

const {FacebookAdsApi, User} = require('facebook-nodejs-ads-sdk');

router.get('/', function(req, res, next) {
  debug('router path /', req.params);
  const { accessToken, userId, proof } = req.session;

  const api = FacebookAdsApi.init(accessToken);
  const user = new User(userId);

  user.getAdAccounts(["account_id", "account_status", "amount_spent", "balance", "business", "business_city", "business_country_code", "business_name", "business_state", "created_time", "currency", "media_agency", "name"], {
    appsecret_proof: proof,
  })
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});
router.get('/:adAccountId', function(req, res, next) {
  debug('router path /:adAccountId', req.params);
  const { accessToken, userId, proof } = req.session;
  const { adAccountId } = req.params;

  return req.app.get('FB').getAdAccountInfo(accessToken, proof, adAccountId)
  // FIXME: handle paging
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});
router.get('/:adAccountId/campaigns', function(req, res, next) {
  debug('router path /:adAccountId/campaigns', req.params);
  const { accessToken, userId, proof } = req.session;
  const { adAccountId } = req.params;

  return req.app.get('FB').getAdCampaigns(accessToken, proof, adAccountId)
  // FIXME: handle paging
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});
router.get('/:campaignId/sets', function(req, res, next) {
  debug('router path /:campaignId/sets', req.params);
  const { accessToken, userId, proof } = req.session;
  const { campaignId } = req.params;

  return req.app.get('FB').getAdSets(accessToken, proof, campaignId)
  // FIXME: handle paging
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});
router.get('/:setId/ads', function(req, res, next) {
  debug('router path /:setId/ads', req.params);
  const { accessToken, userId, proof } = req.session;
  const { setId } = req.params;

  return req.app.get('FB').getAds(accessToken, proof, setId)
  // FIXME: handle paging
  .then(utils.sendOkPromise(res))
  .catch(utils.sendKoPromise(res));
});


module.exports = router;
