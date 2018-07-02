window.Flow = {
  create: function(account, {success, error, cancel}) {
    console.log('create a flow');
    this.openEditDialog({
      data: {},
      success: data => this.saveNew(account, {
        data: data,
        success: success,
        error: error,
      }),
      cancel: cancel,
    });
  },
  saveNew: function(account, {data, success, error}) {
    console.log('saveNew', account, data);
    Api.createFlow(account.id, {
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
  getData() {
    const flowEditDialogEl = document.body.querySelector('#flowEditDialogEl');
    return {
      name: flowEditDialogEl.querySelector('.nameEl').value,
    }
  }
}