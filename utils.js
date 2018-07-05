const debug = require('debug')('webmaster-tools:utils');

module.exports = {
  requiresLogin: function (req, res, next) {
    const { accessToken, userId, proof } = req.session;
    if(accessToken && userId && proof) {
      next();
    }
    else {
      this.sendError(res, 'Need to login');
    }
  },
  sendError: function(res, err) {
    debug('Send error', err);
    res.status(500).json({
      success: false,
      error: err || 'Unknown error',
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
      console.log('sendOkPromise', data);
      if(data && !data.error) 
        this.sendSuccess(res, data);
      else if(data) this.sendError(res, data.error);
      else this.sendError(res);
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
