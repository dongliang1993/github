const axios = require('axios');
const isServer = typeof window === 'undefined';

async function request({method = 'GET', url, data = {}}, req, res) {
  if (isServer) {
    let headers = {};
    const session = req.session;
    const githubAuth = session && session.githubAuth;
    if (githubAuth && githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    return await requestGithub(method, url, data, headers)
  } else {
    return await axios({
      method,
      url: `/github${url}`,
      data
    })
  }
}

const githubBaseUrl = `https://api.github.com`;

async function requestGithub(method, url, data, headers) {
  if (url) {
    return await axios({
      method,
      url: `${githubBaseUrl}${url}`,
      data,
      headers
    })
  } else {
    throw Error('url must required')
  }
}

module.exports = {
  request, requestGithub
};
