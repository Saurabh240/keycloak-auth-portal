//npm install keycloak-js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'euranix',
  clientId: 'client1-app2'
});

export default keycloak;
