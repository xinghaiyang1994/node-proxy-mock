const path = require('path');

const { mockApiToMockArray, requireWithNoCache } = require('./utils');

/** 核心代理逻辑 */
const onProxyReq = (proxyReq, req, res) => {
  // 保证 config 文件变动不会有缓存
  const config = requireWithNoCache('./config');

  // 配置 cookie
  if (config.cookie) {
    proxyReq.setHeader('Cookie', config.cookie);
  }

  // 开启本地 mock
  if (config.mock) {
    const mockArray = mockApiToMockArray(config.mockApi);

    const urlPath = proxyReq.path.split('?')[0];
    const method = proxyReq.method;

    const targetMock = mockArray.find(
      (el) => el.pathReg.test(urlPath) && el.method === method
    );

    if (targetMock) {
      // mock 的返回额外增加 header 标识
      res.setHeader('x-response-from', 'mock');
      // 保证中文不乱码
      res.setHeader('Content-Type', 'application/json; charset=utf-8');

      console.log('==>mock', urlPath);
      let response;
      if (typeof targetMock.response === 'function') {
        response = targetMock.response(req);
      } else if (targetMock.response) {
        response = targetMock.response;
      } else {
        response = requireWithNoCache(
          path.join(
            __dirname,
            `./mock/${targetMock.method.toLowerCase()}/${targetMock.mockFile}`
          )
        );
      }
      res.end(JSON.stringify(response));
    }
  }
};

module.exports = {
  onProxyReq,
};
