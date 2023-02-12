/** 配置项 */
const config = {
  /** 本地启动项目的端口 */
  projectPort: 3000,
  /** 项目的后端地址 */
  projectBackEndUrl: '',
  /** 当前道理服务的端口 */
  proxyPort: 8000,
  /** 从相应环境的浏览器中拿一下 */
  cookie: '',
  /** 是否开启 mock */
  mock: true,
  /**
   * 自定义的 mock api
   *
   * key: 'method|路径|mockFile'
   *    - method 不区分大小写
   *    - 路径可以使 path-to-regexp 路径字符串
   *    - mockFile,可选,对应 mock/method/下的文件,这里的 method 目录是小写
   * value: object | () => object
   * 返回值的优先级 value > mockFile
   */
  mockApi: {
    // 直接返回值,优先级高
    'get|/api/detail': () => {
      return {
        name: 'mock',
      };
    },
    // 读取 mockFile 文件,即 mock/get/user
    'get|/api/book|user': undefined,
  },
};

module.exports = config;
