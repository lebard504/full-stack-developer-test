/* eslint-disable max-len */
/* eslint-disable camelcase */
const axios = require('axios');
const { validationResult } = require('express-validator');

function userController() {
  async function getPermissions(req, res) {
    var responseBody = { code: null, message: null, payload: {} };
    var { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseBody.message = { errors: errors.array() };
      return res.status(422).json(responseBody);
    }
    // Get auth0 authorization
    try {
      const loginRequest = await axios.post(`${process.env.AUTH_API_URI}token`, {
        grant_type: process.env.GRAND_TYPE,
        client_id: process.env.CLIENT_ID,
        username,
        password,
        scope: process.env.SCOPE
      });

      if (loginRequest.status !== 200) {
        throw new Error('Auth connection fail!');
      }

      responseBody.payload = loginRequest.data;
      responseBody.message = 'Connected successfully!';

      return res.json(responseBody);
    }
    catch (error) {
      if (error.response && error.response.status) {
        if (error.response.status === 403) {
          responseBody.message = 'The credentials are wrong!';
        }
      }
      else {
        responseBody.message = error.message;
      }
      return res.status(500).send(responseBody);
    }
  }

  return {
    getPermissions
  };
}

module.exports = userController;
