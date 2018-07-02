window.Dashboard = {
  init: function() {
    console.log('Dashboard init');
    this.errorEl = document.querySelector('#errorEl');
    this.userEl = document.querySelector('#userEl');
    this.adAccountsEl = document.querySelector('#adAccountsEl');
    this.adAccountsEl.onchange = e => {
      this.refreshAdCampaigns();
    };
    this.adCampaignsEl = document.querySelector('#adCampaignsEl');
    this.adCampaignsEl.onchange = e => {
      this.refreshAdSets();
    };
    this.adSetsEl = document.querySelector('#adSetsEl');
    this.adSetsEl.onchange = e => {
      this.refreshAds();
    };
    this.flowsEl = document.querySelector('#flowsEl');
    this.flowsEl.onclick = e => {
      if(e.target.hasAttribute('data-delete-flow-id')) {
        e.preventDefault();
        Api.deleteFlow(e.target.getAttribute('data-delete-flow-id'), {
          success: response => {
            console.log('create flow success', response);
            this.refreshFlows();
          },
          error: response => {
            this.error('Delete flow error', response);
            this.refreshFlows();
          },
        });
      }
    };

    this.adsEl = document.querySelector('#adsEl');
    this.selectionDetailsEl = document.querySelector('#selectionDetailsEl');


    this.createFlowEl = document.querySelector('#createFlowEl');
    this.createFlowEl.onclick = e => Flow.create(this.getAdSet(), {
      success: response => {
        console.log('create flow success', response);
        this.refreshFlows();
      },
      error: response => {
        this.error('create flow error', response);
      },
      cancel: () => {
        console.log('create flow cancel');
      },
    });

    this.adAccounts = [];
    this.adSets = [];
    this.adCampaigns = [];
    this.ads = [];
  },
  refresh: function(user) {
    console.log('Dashboard refresh');
    this.refreshAdAccounts();
    this.refreshMe(user);
  },
  refreshMe: function(user) {
    this.userEl.innerHTML = Templates.getUserInfo(user);
  },
  error(message, ...params) {
    this.setLoading(false);
    console.error(message, ...params, new Error());
    document.body.classList.add('hasErrors');
    this.errorEl.innerHTML += `<li>${ message }</li>`;
  },
  resetErrors() {
    document.body.classList.remove('hasErrors');
    this.errorEl.innerHTML = '';
  },
  setLoading(isLoading) {
    this.resetErrors();
    this.isLoading = isLoading;
    if(isLoading)
      document.body.classList.add('loading');
    else
      document.body.classList.remove('loading');
  },
  refreshAdAccounts: function() {
    this.adAccountsEl.innerHTML = '';
    this.adCampaignsEl.innerHTML = '';
    this.adSetsEl.innerHTML = '';
    this.adsEl.innerHTML = '';
    this.setLoading(true);
    Api.getAdAccounts({
      success: response => {
        this.adAccounts = response.data;
        console.log('ad accounts', this.adAccounts);
        this.adAccountsEl.innerHTML = Templates.getAdAccountsList(this.adAccounts);
        this.setLoading(false);
        this.refreshAdCampaigns();
      },
      error: response => this.error('Error, could not get ad accounts.', response),
    });
  },
  refreshAdCampaigns: function() {
    this.adSetsEl.innerHTML = '';
    this.adCampaignsEl.innerHTML = '';
    this.adsEl.innerHTML = '';
    console.info('xxx', this.getAdAccount());
    const adAccount = this.getAdAccount();
    if(adAccount) {
      this.setLoading(true);
      Api.getAdCampaigns(adAccount.id, {
        success: response => {
          this.adCampaigns = response.data;
          console.log('adCampaigns', this.adCampaigns);
          this.adCampaignsEl.innerHTML = Templates.getAdCampaignsList(this.adCampaigns);
          this.setLoading(false);
          this.refreshAdSets();
        },
        error: response => this.error('Error, could not get ad campaigns.', response),
      });
    }
    else {
      this.error('You need to create an ad account.')
    }
  },
  refreshAdSets: function() {
    this.adSetsEl.innerHTML = '';
    this.adsEl.innerHTML = '';
    const adCampain = this.getAdCampaign();
    if(adCampain) {
      this.setLoading(true);
      Api.getAdSets(adCampain.id, {
        success: response => {
          this.adSets = response.data;
          console.log('ad sets', this.adSets);
          this.adSetsEl.innerHTML = Templates.getAdSetsList(this.adSets);
          this.setLoading(false);
          this.refreshAds();
        },
        error: response => this.error('Error, could not get ad sets.', response),
      });
    }
    else {
      this.error('You need to create an ad campaign in <a href="https://www.facebook.com/adsmanager/manage/campaigns">Facebook Ad Manager</a>. Or select a different ad account.')
    }
  },
  refreshAds: function() {
    this.adsEl.innerHTML = '';
    const adSet = this.getAdSet();
    if(adSet) {
      this.setLoading(true);
      Api.getAds(adSet.id, {
        success: response => {
          this.ads = response.data;
          console.log('ads', this.ads);
          this.adsEl.innerHTML = Templates.getAdsList(this.ads);
          this.setLoading(false);
          this.refreshFlows();
        },
        error: response => this.error('Error, could not get ads.', response),
      });
    }
    else {
      this.error('You need to create an ad set in <a href="https://www.facebook.com/adsmanager/manage/adsets">Facebook Ad Manager</a>. Or select a different campaign.')
    }
  },
  refreshFlows: function() {
    this.flowsEl.innerHTML = '';
    const adSet = this.getAdSet();
    if(adSet) {
      this.setLoading(true);
      Api.getFlows({
        data: {parentId: adSet.id},
        success: response => {
          this.flows = response.data;
          console.log('flows', this.flows);
          this.flowsEl.innerHTML = Templates.getFlowsList(this.flows);
          this.selectionDetailsEl.innerHTML = Templates.getSelectionDetails(this.getAdAccount(), this.getAdCampaign(), this.getAdSet(), this.ads, this.flows);
          this.setLoading(false);
        },
        error: response => this.error('Error, could not get ad flows.', response),
      });
    }
    else {
      this.error('You need to create an ad set in <a href="https://www.facebook.com/adsmanager/manage/adsets">Facebook Ad Manager</a>. Or select a different campaign.')
    }
  },
  /////////////////////////////
  // Selection
  /////////////////////////////
  getAdAccount() {
    const id = this.adAccountsEl.value;
    return this.adAccounts.find(item => item.id === id); 
  },
  getAdCampaign() {
    if(!this.adCampaignsEl.campaign) return null;
    const id = this.adCampaignsEl.campaign.value;
    return this.adCampaigns.find(item => item.id === id);
  },
  getAdSet() {
    if(!this.adSetsEl.set) return null;
    const id = this.adSetsEl.set.value;
    return this.adSets.find(item => item.id === id);
  },
}