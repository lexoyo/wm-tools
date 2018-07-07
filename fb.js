const crypto = require('crypto');
const request = require('request');
const assert = require('assert');
const debug = require('debug')('webmaster-tools:fb');

const CLIENT_ID = process.env.FB_APP_ID;
const CLIENT_SECRET = process.env.FB_APP_SECRET;
const FB_ENDPOINT = 'https://graph.facebook.com/v3.0/';

assert(CLIENT_ID, 'missing env var CLIENT_ID');
assert(CLIENT_SECRET, 'missing env var CLIENT_SECRET');

class FB {
  static getProof(accessToken) {
    return crypto.createHmac('sha256', CLIENT_SECRET).update(accessToken).digest('hex');  
  }
  static get(accessToken, proof, fields, options) {
    return new Promise((resolve, reject) => {
      try {
        const requestOptions = Object.assign({}, options, {
          method: options.method || 'GET',
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
  static getUserPages(accessToken, proof) {
    return FB.get(accessToken, proof, 'name,id,access_token,fan_count', {
      url: 'me/accounts',
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
  static getAdCampaigns(accessToken, proof, adAccountId) {
    return FB.get(accessToken, proof, 'name,objective,status', {
      url: `${ adAccountId }/campaigns`,
    });
  }
  static getAdSets(accessToken, proof, campaignId) {
    return FB.get(accessToken, proof, 'name,configured_status,effective_status', {
      url: `/${ campaignId }/adsets/`,
    });
  }
  static getAds(accessToken, proof, adSetId) {
    return FB.get(accessToken, proof, 'name,ad_draft_id,date_preset,effective_status,time_range,updated_since,insights,total_count', {
      url: `/${ adSetId }/ads`,
    });
  }
  static createAd({ accessToken, parentId, accountId, page, paused, name }, { url }) {
//    const { name, id, access_token, fan_count } = page;
    debug('createAd', accessToken, parentId, accountId, page, paused, name);

    const creative = {
      object_story_spec: {
        link_data: {
          link: url,
          attachment_style: "link"
        },
        page_id: page.id,
      },
      object_type: "SHARE"
    };
    const now = new Date();
    const data = {
      name: `${ now.getMonth()+1 }/${ now.getDate() } ${ now.getHours() }:${ now.getMinutes() } Ad From Flow ${ name }`,
      account_id: accountId,
      action: 'add',
      ad_object_type: 'ad',
      parent_ad_object_id: parentId,
      adset_id: parentId,
      creative: JSON.stringify(creative),
    }
    const options = {
      method: 'POST',
      url: `${ accountId }/ads`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      formData: data,
    }
    return FB.get(accessToken, FB.getProof(accessToken), '', options);
  }
/*
  static createAd(doc, websiteData) {
    const { url, title, favicon, description, article, images, html } = websiteData;
    const { accessToken, parentId, paused, page } = doc;
    const imageUrl = images[0].url;
    const imageName = images[0].url.split('/').pop();
    debug('createAd', parentId, paused, page.id);
    const proof = FB.getProof(accessToken);
    // download image
    return new Promise((resolve, reject) => {
      debug('start download', imageUrl);
      try {
        request({
          url: imageUrl,
          encoding: null
        }, (error, response, body) => {
          debug('end download', error, body == null);
          if(error) reject(error);
          else resolve(body);
        })
      }
      catch(e) {
        console.error('Error download image', imageUrl, e);
        reject(e);
      }
    })
    .then(data => {
      debug('============= image downloaded');
      return data;
    })
    // Upload image
    .then(imageData => {
      debug('imageData', imageName, Buffer.from(imageData).toString('base64').substr(-100));
      debug('Upload image', doc.accountId, accessToken, proof);

      return FB.get(accessToken, proof, '', {
        url: `/${ doc.accountId }/adimages`,
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        formData: {
          bytes: Buffer.from(imageData).toString('base64'),
          name: imageName,
          encoding: 'data:image/png;base64',
        },
      })
    })
    .then(data => {
      debug('============= image uploaded', data);
      if(data.error) {
        console.error('Image upload ERROR', data.error);
        return Promise.reject(data.error.message);
      }
      return data;
    })
    // create creative
    // create ad
    // https://developers.facebook.com/docs/marketing-api/buying-api#book-ad
    .then(imageData => {
    })
    .then(data => {
      debug('============= creative OK', data, data.error);
      if(data.error) return Promise.reject(data.error.error_user_title + ': ' + data.error.error_user_msg);
      return data.id;
    })
  }
*/
}

module.exports = FB;
