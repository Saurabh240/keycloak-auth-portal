import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'euranix',
  clientId: 'client1-app2',
});

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: true,
  pkceMethod: 'S256',
  redirectUri: 'http://localhost:3000/*',
}).then(authenticated => {
  console.log('Authenticated:', authenticated);
  console.log('Token:', keycloak.token);
}).catch(err => {
  console.error('Keycloak init error:', err);
});

export default keycloak;
