const request = require('request');
const debug = require('debug')('webmaster-tools:ad-generator');

module.exports = {
  startJob: function(doc, { url }) {
    return new Promise((resolve, reject) => {
      debug('start job!', doc, url);
      const embedUrl = `https://api.embed.rocks/api/?key=85f6a5c5-06f8-45d9-b3cc-c41f931c79d2&url=${ url }`;
      request({
        url: embedUrl,
        json: true,
      }, (error, response, body) => {
        if(error) reject(error);
        else resolve({
          websiteData: body,
          doc: doc,
        });
      });
    });
  },
}