window.Templates = {
  getUserInfo(user) {
    return `
      <section id="user_${user.id}">
        <img src="${ user.picture.data.url }" />
        <p>${user.name} ${ user.business_name ? '(' + user.business_name + ')' : ''}</p>
        <p>${user.email}</p>
      </section>
    `;
  },
  getAdAccountsList: function(adAccounts) {
    return adAccounts.map((adAccount, idx) => `
      <input class="hidden" value="${ adAccount.id }" type="radio" id="id_${ adAccount.id }" name="account" ${ idx===0?'checked':'' } />
      <label class="radiogroup" for="id_${ adAccount.id }">
        ${ adAccount.name }
      </label>
    `).join('');
  },
  getAdCampaignsList: function(adAccount, adCampaigns) {
    return adCampaigns.map((adCampaign, idx) => `
      <input class="hidden" value="${ adCampaign.id }" type="radio" id="id_${ adCampaign.id }" name="campaign" />
      <label class="radiogroup" for="id_${ adCampaign.id }">
        <h3>${ adCampaign.name }</h3>
        <ul>
          <li>Objective: ${ adCampaign.objective }</li><li>Status: ${ adCampaign.status }</li>
          <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ adAccount.id }&selected_campaign_ids=${ adCampaign.id }">Edit</a>
        </ul>
      </label>
    `).join('');
  },
  getAdSetsList: function(adSets) {
    return adSets.map((adSet, idx) => `
      <input class="hidden" value="${ adSet.id }" type="radio" id="id_${ adSet.id }" name="set" />
      <label class="radiogroup" for="id_${ adSet.id }">${ adSet.name }</label>
    `).join('');
  },
  getAdsList: function(ads) {
    return ads.map(ad => `
      <form>
        <h4>${ ad.name }</h4>
        <div class="code">
          ${ JSON.stringify(ad) }
        </div>
      </form>
    `).join('');
  },
  getFlowsList: function(flows) {
    return flows.map(flow => {
      const webhookUrl = `/webhooks?webhookToken=${ flow.webhookToken }&flowId=${ flow._id }&url=`;
      return `
      <form>
        <h4>${ flow.name }</h4>
        <input readonly type="text" value="${ webhookUrl }"/>
        <a target="_blank" href="${ webhookUrl }https://www.silex.me">Test</a>
        <button data-delete-flow-id="${ flow._id }">x</button>
        <button data-edit-flow-id="${ flow._id }">Edit</button>
        <div class="code debug">
          ${ JSON.stringify(flow) }
        </div>
      </form>
    `}).join('');
  },
  getSelectionDetails: function(adAccount, adCampaign, adSet, ads, flows) {
    return `
      Current Ad Account: 
      <ul>
        <li>${ adAccount.business_name } (${ adAccount.name })</li><li>Spent since ${ adAccount.created_time }: ${ adAccount.amount_spent }${ adAccount.currency }</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ adAccount.id }&selected_campaign_ids=${ adCampaign.id }">Edit</a></li>
      </ul>
      Current Ad Campaign:
      <ul>
        <li>${ adCampaign.name }</li><li>Objective: ${ adCampaign.objective }</li><li>Status: ${ adCampaign.status }</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ adAccount.id }&selected_campaign_ids=${ adCampaign.id }">Edit</a>
      </ul>
      Current Ad Set:
      <ul>
        <li>${ adSet.name }</li><li>Status: ${ adSet.effective_status }</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ adAccount.id }&selected_adset_ids=${ adSet.id }">Edit</a></li>
      </ul>
      Ads in this selection:
      <ul>
        <li>${ ads.length } ads</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ adAccount.id }&selected_campaign_ids=${ adCampaign.id }&selected_adset_ids=${ adSet.id }">View in Facebook Ads Manager</a></li>
      </ul>
    `;
  },
}