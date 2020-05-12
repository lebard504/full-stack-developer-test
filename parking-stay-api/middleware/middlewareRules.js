const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

require('dotenv').config();

function middlewareRules() {
  const jwtObject = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.JWSKURI
    }),
    aud: process.env.AUD,
    issuer: process.env.ISSUER,
    algorithms: ['RS256']
  });

  return { jwtObject };
}

module.exports = middlewareRules();
