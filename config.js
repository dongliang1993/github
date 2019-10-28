/**
 * github OAuth的一些配置项
 */
const auth_url = 'https://github.com/login/oauth/authorize';
const scope = 'user';
const client_id = '170b16e19a6b3034227d';
const OAUTH_URL = `${auth_url}?client_id=${client_id}&scope=${scope}`;

module.exports = {
  github: {
    client_id,
    client_secret: '521f1257450ff42f99cf817eb18de606b9002fd5',
    request_token_url: 'https://github.com/login/oauth/access_token',
    auth_url,
    scope,
    user_info_url: 'https://api.github.com/user',
    OAUTH_URL
  }
};
// token: access_token=6dc3303eed32430ef9f45b8c41649a86dda412ce&scope=repo%3Astatus%2Cuser&token_type=bearer
