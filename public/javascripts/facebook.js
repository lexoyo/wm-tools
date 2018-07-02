function checkLoginState() {
  console.log('checkLoginState');
  FB.getLoginStatus(function(response) {
    console.log('login status', response);
    if(response.status === 'connected') {
      document.body.classList.add('loggedin');
      document.body.classList.remove('loggedout');
      const accessToken = response.authResponse.accessToken;
      const expiresIn = response.authResponse.expiresIn;
      console.log('user logged in:', response.authResponse.userID);
      Api.setCreds({
        data: {
          accessToken: accessToken,
          expiresIn: expiresIn,
        },
        success: (response) => {
          console.log('token stored', response);
          Dashboard.refresh(response.data);
        },
        error: (response) => Dashboard.error('Error, token NOT stored.', response),
      });
    }
    else {
      document.body.classList.add('loggedout');
      document.body.classList.remove('loggedin');
    }
  });
}
function logout() {
  FB.logout(function(response) {
    console.log('logged out', response);
    checkLoginState();
    Api.resetCreds({
      success: (response) => console.log('user logged out', response),
      error: (response) => Dashboard.error('Error, user NOT logged out', response),
    });
  });
}
window.fbAsyncInit = function() {
  const CLIENT_ID = '1948258332120118';
  
  FB.init({
    appId            : CLIENT_ID,
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v3.0',
  });
  console.log('init');
  Dashboard.init();
  document.getElementById('logoutBtn').onclick = logout;
  checkLoginState();
};
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
