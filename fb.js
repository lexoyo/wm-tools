const crypto = require('crypto');
const request = require('request');
const debug = require('debug')('webmaster-tools:fb');

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
  static createAd(accessToken, proof, doc, websiteData) {
    const { url, title, favicon, description, article, images, html } = websiteData;
    const { parentId, paused, pageId } = doc;
    debug('==============', doc, parentId, paused, pageId);
    // Upload image
    // create creative
    // create ad
    // https://developers.facebook.com/docs/marketing-api/buying-api#book-ad
    // 
      // 'Generated creative ' + Date.now()
      // url: url,
      // image: image,
      // title: title,
      // description: description,
    return FB.get(accessToken, proof, '', {
      url: `/${ parentId }/adimages`,
      method: 'POST',
      data: {
        url: images[0].url,
      }
    })
    .then(data => {
      debug('image uploaded', data);
      return data;
    })
    .then(imageData => FB.get(accessToken, proof, '', {
      url: `/${ parentId }/adcreatives`,
      method: 'POST',
      data: {
        name: 'Ad Flows Generated Ad Creative ' + Date.now(),
        object_story_spec: {
          link_data: {
            image_hash: imageData.hash,
            link: url,
            message: title,
            body: description,
          },
          page_id: doc.pageId,
        }
      }
    }))
    .then(data => {
      console.log('xxxxxx adcreative done', data);
      return data.id;
    })
    .then(creativeId => FB.get(accessToken, proof, '', {
      url: `/${ parentId }/ads`,
      method: 'POST',
      data: {
        name: 'Ad Flows Generated Ad ' + Date.now(),
        adset_id: parentId,
        status: paused ? 'PAUSED' : 'ACTIVE',
        creative: {
          creative_id: creativeId,
        }
      }
    }));
  }
}

module.exports = FB;
