/**
 * koa集成next、
 * koa-session关联redis
 */
const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const session = require('koa-session');
const Redis = require('ioredis');
const bodyparser = require('koa-bodyparser');
const atob = require('atob');
const proxy = require('./server/proxy');
const auth = require('./server/auth');
const RedisSessionStore = require('./server/session-store');
// 创建一个app，并指定为开发状态
const dev = process.env.NODE_ENV !== 'production';
const app = next({
  dev
});
// 创建redis client
const client = new Redis();
const handle = app.getRequestHandler();
// 设置nodejs全局增加一个atob方法
global.atob = atob;
// 等pages下面的所有页面编译完成之后启动服务，响应请求
app.prepare().then(() => {
  // 实例化KoaServer
  const server = new Koa();
  const router = new Router();
  // 给cookie加密，加密之后的密文是jwt
  server.keys = ['ainuo develop github apps'];
  server.use(bodyparser());
  const SESSION_CONFIG = {
    key: 'jid',
    // 当没有配置store时，session是以jwt存储在cookie中的
    store: new RedisSessionStore(client),
    // 过期时间默认7天
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  // 对服务端的session进行加密
  server.use(session(SESSION_CONFIG, server));
  // 配置处理github oauth登陆
  auth(server);
  // 配置github接口代理
  proxy(server);
  server.use(router.routes());
  // 访问/a/1等网站时，打印session
  // router.get('/a/:id', async ctx => {
  //   const id = ctx.params.id;
  //   if (ctx.session.user) {
  //     console.log(`session is :` + ctx.session.user.name || {});
  //   } else {
  //     console.log(`session is not config`);
  //   }
  //   await app.render(ctx.req, ctx.res, '/a', {id});
  //   ctx.respond = false
  // });
  router.get('*', async ctx => {
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    ctx.respond = false
  });
  // 使用中间件
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next()
  });
  // 监听端口
  server.listen(3000, '127.0.0.1', () => {
    console.log('koa server listening on 3000')
  });
});
