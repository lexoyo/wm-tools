window.Utils = {
  copyBtn: function(copyButton, targetInput) {
    copyButton.onclick = e => {
      targetInput.focus();
      targetInput.setSelectionRange(0, targetInput.value.length);
      const success = document.execCommand('copy');
      if(success) copyButton.innerHTML = 'Copied!'
    };
  },
  removePrefix: function(adAccountId) {
    return adAccountId.substr(4);
  },
}