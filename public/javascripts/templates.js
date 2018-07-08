window.Templates = {
  getUserInfo: function(user) {
    return `
      <section id="user_${user.id}">
        <img src="${ user.picture.data.url }" />
        <p class="only-hover">${user.name} ${ user.business_name ? '(' + user.business_name + ')' : ''}</p>
        <p class="only-hover">${user.email}</p>
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
        <h4 class="head">${ adCampaign.name }</h4 class="head">
        <ul class="body">
          <li>Objective: ${ adCampaign.objective }</li><li>Status: ${ adCampaign.status }</li>
        </ul>
        <ul class="footer">
          <li>Select</li>
          <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/campaigns/edit?act=${ Utils.removePrefix(adAccount.id) }&selected_campaign_ids=${ adCampaign.id }">Edit</a></li>
        </ul>
      </label>
    `).join('');
  },
  getAdSetsList: function(adAccount, adSets) {
    return adSets.map((adSet, idx) => `
      <input class="hidden" value="${ adSet.id }" type="radio" id="id_${ adSet.id }" name="set" />
      <label class="radiogroup" for="id_${ adSet.id }">
        <h4 class="head">${ adSet.name }</h4 class="head">
        <ul class="body">
          <li>${ window.config.fbFields.adSets
            .filter(field => !!adSet[field.name] && adSet[field.name].toString().toLowerCase() != 'undefined')
            .map(field => `${field.displayName}: ${typeof(adSet[field.name])==='object'?JSON.stringify(adSet[field.name]):adSet[field.name]}`).join('</li><li>') }
          </li>
        </ul>
        <ul class="footer">
          <li>Select</li>
          <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ Utils.removePrefix(adAccount.id) }&selected_adset_ids=${ adSet.id }">Edit</a></li>
        </ul>
      </label>
    `).join('');
  },
  getAdsList: function(ads) {
    return ads.map(ad => `
      <article>
        <h4>${ ad.name }</h4>
        <div class="code">
          ${ JSON.stringify(ad) }
        </div>
      </article>
    `).join('');
  },
  getFlowsList: function(flows) {
    return flows.map(flow => {
      const webhookUrl = `${ window.location.origin }/webhooks?webhookToken=${ flow.webhookToken }&flowId=${ flow._id }&url=`;
          //<input readonly type="text" value="${ webhookUrl }"/>
      return `
      <article>
        <h4 class="head">${ flow.name }</h4>
        <div class="body">
          <button data-open-flow-id="${ flow._id }">Link It !</button>
        </div>
        <div class="footer">
          <a target="_blank" href="${ webhookUrl }https://www.silex.me">Test</a>
          <button data-delete-flow-id="${ flow._id }">Delete</button>
          <button data-edit-flow-id="${ flow._id }">Edit</button>
        </div>
      </article>
    `}).join('');
  },
  getSelectionDetails: function(adAccount, adCampaign, adSet, ads, flows) {
    return `
      Current Ad Account: 
      <ul>
        <li>${ adAccount.business_name } (${ adAccount.name })</li><li>Spent since ${ adAccount.created_time }: ${ adAccount.amount_spent }${ adAccount.currency }</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ Utils.removePrefix(adAccount.id) }&selected_campaign_ids=${ adCampaign.id }">Edit</a></li>
        <div class="code">${ JSON.stringify(adAccount) }</div>
      </ul>
      Current Ad Campaign:
      <ul>
        <li>${ adCampaign.name }</li><li>Objective: ${ adCampaign.objective }</li><li>Status: ${ adCampaign.status }</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ Utils.removePrefix(adAccount.id) }&selected_campaign_ids=${ adCampaign.id }">Edit</a>
        <div class="code">${ JSON.stringify(adCampaign) }</div>
      </ul>
      Current Ad Set:
      <ul>
        <li>${ adSet.name }</li><li>Status: ${ adSet.status }</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ Utils.removePrefix(adAccount.id) }&selected_adset_ids=${ adSet.id }">Edit</a></li>
        <div class="code">${ JSON.stringify(adSet) }</div>
      </ul>
      Ads in this selection:
      <ul>
        <li>${ ads.length } ads</li>
        <li><a target="_blank" href="https://www.facebook.com/adsmanager/manage/adsets/edit?act=${ Utils.removePrefix(adAccount.id) }&selected_campaign_ids=${ adCampaign.id }&selected_adset_ids=${ adSet.id }">View in Facebook Ads Manager</a></li>
        <div class="code">${ JSON.stringify(ads) }</div>
      </ul>
    `;
  },
}