const Koa = require('koa');
const cors = require('@koa/cors');
const httpProxy = require('http-proxy');

const config = require('./config');
const app = new Koa();
const { onProxyReq } = require('./index');
const { mockApiToMockArray, requireWithNoCache } = require('./utils');

app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${config.projectPort}`,
  })
);

app.use(async ctx => {

  // 保证 config 文件变动不会有缓存
  const newConfig = requireWithNoCache('./config');

  // 开启本地 mock
  if (newConfig.mock) {
    const mockArray = mockApiToMockArray(newConfig.mockApi);

    const urlPath = ctx.request.url.split('?')[0];
    const method = ctx.request.method;

    // 目标异步函数
    const targetAsyncMock = mockArray.find(
      (el) => el.pathReg.test(urlPath) && el.method === method && Object.prototype.toString.call(el.response) === '[object AsyncFunction]'
    );

    // 执行异步函数
    if (targetAsyncMock) {
      // mock 的返回额外增加 header 标识
      ctx.response.set('x-response-from', 'mock');
      // 保证中文不乱码
      ctx.response.set('Content-Type', 'application/json; charset=utf-8');

      console.log('==>mock', urlPath);
      const result = await targetAsyncMock.response(ctx.request);
      ctx.body = result
      return
    }
  }

  // 走公共代理
  ctx.respond = false;
  const proxy = httpProxy.createProxyServer({});
  proxy.on('proxyReq', onProxyReq);
  proxy.web(ctx.req, ctx.res, {
    target: config.projectBackEndUrl,
    changeOrigin: true,
  });
})

app.listen(config.proxyPort, () => {
  console.log(`proxy server: http://localhost:${config.proxyPort}`);
});
