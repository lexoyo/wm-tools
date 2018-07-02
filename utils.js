const debug = require('debug')('webmaster-tools:utils');

module.exports = {
  sendError: function(res, err) {
    debug('Send error', err);
    res.status(500).json({
      success: false,
      error: err,
    });
  },
  sendSuccess: function(res, data) {
    // debug('Send success', data);
    res.json({
      success: true,
      data: data,
    });
  },
  sendOkPromise: function(res) {
    return data => {
      if(data.error) this.sendError(res, data.error);
      else {
        this.sendSuccess(res, data);
      }
    }
  },
  sendOk: function(res, data) {
    this.sendSuccess(res, data);
  },
  sendKoPromise: function(res) {
    return err => {
      this.sendError(res, err);
    }
  },
  sendKo: function(res, err) {
    this.sendError(res, err);
  },
}
