/**
 * 对github api进行请求
 */

const axios = require('axios');
const {github} = require('../config');
const {client_id, client_secret, request_token_url, user_info_url, OAUTH_URL} = github;
module.exports = function (server) {
  // 处理第三方登录请求
  server.use(async (ctx, next) => {
    // 处理 http://localhost:3000/auth?code=xxx 这个路径拿到code
    if (ctx.path === '/auth') {
      const code = ctx.query.code;
      if (code) {
        // 发起请求获取access_token
        const res = await axios({
          method: 'POST',
          url: request_token_url,
          data: {
            client_id,
            client_secret,
            code
          },
          // 设置header，标明可接受的返回类型
          headers: {
            Accept: 'application/json',
          }
        });
        // 处理异常情况
        if (res.status === 200 && (res.data && !res.data.error)) {
          // 存储拿到的token
          ctx.session.githubAuth = res.data;
          // 获取到access_token和token_type，进行用户信息的获取
          const {access_token, token_type} = res.data;
          const userInfoRes = await axios({
            method: 'GET',
            url: user_info_url,
            // 添加Authorization字段
            headers: {
              Authorization: `${token_type} ${access_token}`
            }
          });
          // 存储用户信息到session，方便以后注销用户
          ctx.session.userInfo = userInfoRes.data;
          // 拿到之前存储的session.urlBeforeOAuth，跳转到该路径
          if (ctx.session && ctx.session.urlBeforeOAuth) {
            ctx.redirect(ctx.session.urlBeforeOAuth);
            // 清空urlBeforeOAuth session
            ctx.session.urlBeforeOAuth = null;
          } else {
            ctx.redirect('/');
          }
        } else {
          const errorMsg = res.data && res.data.error;
          ctx.body = `request token failed ${errorMsg}`
        }
      } else {
        ctx.body = 'code not exist';
      }
    } else {
      // 处理下一个中间件
      await next()
    }
  });
  // 处理注销请求
  server.use(async (ctx, next) => {
    const path = ctx.path;
    const method = ctx.method;
    if (path === '/logout' && method === 'POST') {
      ctx.session = null;
      ctx.body = `logout success`
      // 处理下一个中间件
    } else {
      await next()
    }
  });
  // 预auth的接口处理，设置一个跳转之前的url，方便登录之后跳转到之前的网页
  server.use(async (ctx, next) => {
    const path = ctx.path;
    const method = ctx.method;
    if (path === '/prepare-auth' && method === 'GET') {
      /*/prepare-auth?url=/?key=2*/
      let url = ctx.originalUrl.replace('/prepare-auth?url=/', '/');
      // console.log(ctx);
      // const {url} = ctx.query;
      // console.log(url);
      // 设置当前的urlBeforeOAuth为跳转之前的url
      ctx.session.urlBeforeOAuth = url;
      // 重定向到OAUTH_URL
      ctx.redirect(OAUTH_URL)
    } else {
      await next()
    }
  });
};
