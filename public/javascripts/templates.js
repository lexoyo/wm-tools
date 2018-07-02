window.Templates = {
  getUserInfo(user) {
    return `
      <section id="user_${user.id}">
        <img src="${ user.picture.data.url }" />
        <p>${user.business_name} (${user.name})</p>
        <p>${user.email}</p>
      </section>
    `;
  },
  getAdAccountsList: function(adAccounts) {
    return adAccounts.map(adAccount => `
      <option value="${ adAccount.id }">${ adAccount.name }</option>
    `).join('');
  },
  getAdCampaignsList: function(adCampaigns) {
    return adCampaigns.map((adCampaign, idx) => `
      <input value="${ adCampaign.id }" type="radio" id="id_${ adCampaign.id }" name="campaign" ${ idx===0?'checked':'' } />
      <label for="id_${ adCampaign.id }">${ adCampaign.name }</label>
    `).join('');
  },
  getAdSetsList: function(adSets) {
    return adSets.map((adSet, idx) => `
      <input value="${ adSet.id }" type="radio" id="id_${ adSet.id }" name="set" ${ idx===0?'checked':'' } />
      <label for="id_${ adSet.id }">${ adSet.name }</label>
    `).join('');
  },
  getAdsList: function(ads) {
    return ads.map(ad => `
      <form>
        <h4>${ ad.name }</h4>
        <code>
          ${ JSON.stringify(ad) }
        </code>
      </form>
    `).join('');
  },
  getFlowsList: function(flows) {
    return flows.map(flow => `
      <form>
        <h4>${ flow.name }</h4>
        <input readonly type="text" value="${ window.location.href }webhooks?webhookToken=${ flow.webhookToken }&flowId=${ flow._id }&url="/>
        <code>
          ${ JSON.stringify(flow) }
        </code>
        <button data-delete-flow-id="${ flow._id }">x</button>
        <button data-edit-flow-id="${ flow._id }">Edit</button>
      </form>
    `).join('');
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