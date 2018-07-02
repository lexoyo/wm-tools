const crypto = require('crypto');
const request = require('request');

const CLIENT_ID = '1948258332120118';
const CLIENT_SECRET = 'cd1c95cbe42d3c6935515435aa263d4b'
const FB_ENDPOINT = 'https://graph.facebook.com/v3.0/';

class FB {
  static getProof(accessToken) {
    return crypto.createHmac('sha256', CLIENT_SECRET).update(accessToken).digest('hex');  
  }
  static get(accessToken, proof, fields, options) {
    return new Promise((resolve, reject) => {
      try {
        const requestOptions = Object.assign({}, options, {
          json: true,
          baseUrl: FB_ENDPOINT,
          qs: {
            appsecret_proof: proof,
            access_token: accessToken,
            fields: fields,
          },
        });
        request(requestOptions, (error, response, body) => {
          if(error) reject(error);
          // sometime the data is directly in the body, e.g. /me
          else resolve(body.data ? body.data : body);
        });
      }
      catch(e) {
        console.error('ERROR', e);
        reject(e);
      }
    });
  }
  static getUser(accessToken, proof) {
    return FB.get(accessToken, proof, 'name,email,picture', {
      url: 'me',
    });
  }
  static getAdAccounts(accessToken, proof) {
    // this still uses the ads sdk in ads.js
    throw Error('not implemented');
  }
  static getAdAccountInfo(accessToken, proof, adAccountId) {
    return FB.get(accessToken, proof, 'account_id,account_status,amount_spent,balance,business,business_city,business_country_code,business_name,business_state,created_time,currency,media_agency,name', {
      url: `${ adAccountId }`,
    });
  }
  static getAdCampaigns  (accessToken, proof, adAccountId) {
    return FB.get(accessToken, proof, 'name,objective,status', {
      url: `${ adAccountId }/campaigns`,
    });
  }
  static getAdSets(accessToken, proof, campaignId) {
    return FB.get(accessToken, proof, 'name,configured_status,effective_status', {
      url: `/${ campaignId }/adsets/`,
    });
  }
  static getAds  (accessToken, proof, adSetId) {
    return FB.get(accessToken, proof, 'name,ad_draft_id,date_preset,effective_status,time_range,updated_since,insights,total_count', {
      url: `/${ adSetId }/ads`,
    });
  }
}

module.exports = FB;
