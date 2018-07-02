window.Api = {
  get({route, method, success, error, data}) {
    $.ajax({
      url: `./${ route }/`,
      method: method || 'GET',
      success: success,
      error: error,
      data: data,
      dataType: 'json',
    });
  },
  getPages: function(options) {
    this.get(Object.assign({}, options, {
      route: 'me/pages',
    }));
  },
  getAdAccounts: function(options) {
    this.get(Object.assign({}, options, {
      route: 'ads',
    }));
  },
  getAdSets: function(accountId, options) {
    this.get(Object.assign({}, options, {
      route: `ads/${ accountId }/sets`,
    }));
  },
  getAdCampaigns: function(accountId, options) {
    this.get(Object.assign({}, options, {
      route: `ads/${ accountId }/campaigns`,
    }));
  },
  getAds: function(accountId, options) {
    this.get(Object.assign({}, options, {
      route: `ads/${ accountId }/ads`,
    }));
  },
  getFlows: function(options) {
    this.get(Object.assign({}, options, {
      route: `flows`,
      method: 'GET',
    }));
  },
  updateFlow: function(flowId, options) {
    this.get(Object.assign({}, options, {
      route: `flows/${ flowId }`,
      method: 'POST',
    }));
  },
  deleteFlow: function(flowId, options) {
    this.get(Object.assign({}, options, {
      route: `flows/${ flowId }`,
      method: 'DELETE',
    }));
  },
  createFlow: function(parentId, options) {
    options.data.parentId = parentId;
    this.get(Object.assign({}, options, {
      route: `flows`,
      method: 'POST',
    }));
  },
  setCreds: function (options) {
    this.get(Object.assign({}, options, {
      route: 'me',
      method: 'POST',
    }));
  },
  resetCreds: function (options) {
    this.get(Object.assign({}, options, {
      route: 'me',
      method: 'DELETE',
    }));
  },
}