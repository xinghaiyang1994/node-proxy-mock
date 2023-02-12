# node-proxy-mock

通用的前端代理后端接口，支持 mock 功能。

日常使用只需要修改 lib/config.js 配置文件

## 使用

2 种使用方式

### 1.集成进 webpack（推荐）

步骤:

1. 将 lib 下的所有文件(除了 lib/express.js )拷贝进开发项目根目录的 proxy 目录中
2. 主要修改 devServer.proxy 中的 onProxyReq 函数。

```js
// 重新定义,避免循环依赖
/** 清除 require 文件的缓存 */
const requireWithNoCache = (path) => {
  delete require.cache[require.resolve(path)];
  const data = require(path);
  return data;
};

module.exports = {
  devServer: {
    proxy: {
      xxx: {
        // 新增
        onProxyReq(...rest) {
          const { onProxyReq } = requireWithNoCache('./proxy/index.js');
          return onProxyReq(...rest);
        },
      },
    },
  },
};
```

3. 安装依赖，`npm i path-to-regexp -D`
4. 重启开发项目即可

### 2.作为单独的 Node 服务

步骤:

1. 将 lib 下的所有文件拷贝进开发项目根目录的 proxy 目录中
2. 需要将开发项目的 devServer.proxy 下的 target 指向当前 node 服务。在 node 服务种配置开发项目的后端 url，即 lib/config.js 中的 projectBackEndUrl 字段。
3. 安装依赖，查看 node 的 package.json
4. 开发项目中启动 `nodemon proxy/express.js`
5. 重启开发项目即可
