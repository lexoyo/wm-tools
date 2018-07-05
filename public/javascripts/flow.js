window.Flow = {
  init: function(pages) {
    console.log('flow init', pages);
    this.pages = pages;
  },
  create: function(account, parent, options) {
    console.log('Create a flow', options);
    this.editOrCreate(account, parent, this.saveNew, options, {
      accountId: account.id,
      parentId: parent.id,
      paused: true,
    });
  },
  edit: function(account, parent, flow, options) {
    console.log('Edit a flow', flow, options);
    this.editOrCreate(account, parent, this.save, options, flow);
  },
  editOrCreate: function(account, parent, method, {success, error, cancel}, data) {
    this.openEditDialog({
      data: data,
      success: data => method(account, parent, {
        data: data,
        success: success,
        error: error,
      }),
      cancel: cancel,
    });
  },
  saveNew: function(account, parent, {data, success, error}) {
    console.log('saveNew', account, data);
    Api.createFlow(parent.id, {
      data: data,
      success: response => success(response),
      error: response => error(response),
    });
  },
  save: function(account, parent, {data, success, error}) {
    console.log('saveNew', account, data);
    Api.updateFlow(parent.id, {
      data: data,
      success: response => success(response),
      error: response => error(response),
    });
  },
  openEditDialog: function({data, success, cancel}) {
    console.log('openEditDialog');
    document.body.classList.add('show-edit-ad-flow');
    const flowEditDialogEl = document.body.querySelector('#flowEditDialogEl');
    const cancelBtn = flowEditDialogEl.querySelector('.cancelBtn');
    flowEditDialogEl.onsubmit = e => {
      console.info('SUBMIT');
      e.preventDefault();
      this.closeEditDialog(true);
    }
    cancelBtn.onclick = e => {
      e.preventDefault();
      this.closeEditDialog();
    }
    const pageSelect = flowEditDialogEl.querySelector('.pageSelect');
    pageSelect.innerHTML = this.pages.map(page => `
      <option value='${ JSON.stringify(page) }'>${ page.name }</option>
    `).join('');

    this.setData(data);
    // store for use in closeEditDialog
    this.onclose = {success: success, cancel: cancel};
  },
  closeEditDialog: function(isOk) {
    console.log('closeEditDialog', isOk);
    document.body.classList.remove('show-edit-ad-flow');
    if(isOk) {
      if(this.onclose && this.onclose.success) {
        console.log('closeEditDialog ok', this.getData());
        this.onclose.success(this.getData());
      }
    }
    else {
      if(this.onclose && this.onclose.cancel) {
        this.onclose.cancel();
      }
    }
  },
  setData(data) {
    const dataElements = flowEditDialogEl.querySelectorAll('[data-name]');
    for(idx=0; idx<dataElements.length; idx++) {
      const el = dataElements[idx];
      console.log('aaa', el)
      const name = el.getAttribute('data-name');
      const type = el.getAttribute('data-type');
      if(data[name]) {
        if(type === 'boolean')
          el.checked = data[name];
        else
          el.value = data[name];
      }
    }
  },
  getData() {
    const flowEditDialogEl = document.body.querySelector('#flowEditDialogEl');
    const dataElements = flowEditDialogEl.querySelectorAll('[data-name]');
    const data = {};
    for(idx=0; idx<dataElements.length; idx++) {
      const el = dataElements[idx];
      const type = el.getAttribute('data-type');
      const name = el.getAttribute('data-name');
      if(type === 'boolean')
        data[name] = el.checked;
      else if(type === 'object')
        data[name] = (el.value);
        //data[name] = JSON.parse(el.value);
      else if(el.value)
        data[name] = el.value;
    }
    return data;
  }
}