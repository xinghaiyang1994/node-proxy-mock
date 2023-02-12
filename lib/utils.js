const { pathToRegexp } = require('path-to-regexp');

/** 将 config.mockApi 处理成数组 */
const mockApiToMockArray = (mockApi) =>
  Object.keys(mockApi).map((key) => {
    const [method, path, mockFile] = key.split('|');
    return {
      method: method.toUpperCase(),
      /** 路径正则 */
      pathReg: pathToRegexp(path),
      /** 响应 */
      response: mockApi[key],
      mockFile,
    };
  });

/** 清除 require 文件的缓存 */
const requireWithNoCache = (path) => {
  delete require.cache[require.resolve(path)];
  const data = require(path);
  return data;
};

module.exports = {
  mockApiToMockArray,
  requireWithNoCache,
};
