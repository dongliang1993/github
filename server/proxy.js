/**
 * github接口代理，防止因请求过多而被禁用ip，并且添加认证头部
 */
const {requestGithub} = require('../lib/api');
// const githubBaseUrl = 'https://api.github.com';
const axios = require('axios');
module.exports = server => {
  server.use(async (ctx, next) => {
    const path = ctx.path;
    if (path.startsWith('/github/')) {
      const {method} = ctx;
      const githubAuth = ctx.session && ctx.session.githubAuth;
      // 对应的github接口地址
      const githubPath = `${ctx.url.replace('/github/', '/')}`;
      const token = githubAuth && githubAuth.access_token;
      // 根据token的有无增加字段
      let headers = {};
      if (token) {
        headers['Authorization'] = `${githubAuth.token_type} ${token}`
      }
      const res = await requestGithub(method, githubPath, ctx.request.body || {}, headers);
      ctx.status = res.status;
      ctx.body = res.data;
    } else {
      await next()
    }
  })
};
