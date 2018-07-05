const request = require('request');
const debug = require('debug')('webmaster-tools:ad-generator');
const API_KEY = process.env.EMBED_ROCKS_API_KEY || 'c15b2993-5b07-4e32-b4c0-a14a52b40f61';

module.exports = {
  startJob: function(doc, { url }) {
    return new Promise((resolve, reject) => {
      debug('start job!', url);
      const embedUrl = `https://api.embed.rocks/api/?key=${ API_KEY }&url=${ url }`;
      request({
        url: embedUrl,
        json: true,
      }, (error, response, body) => {
        debug('embed.rocks', error, body);
        if(error) reject(error);
        else if(body.type === 'error') reject(body.msg);
        else resolve({
          websiteData: body,
          doc: doc,
        });
      });
    });
  },
}