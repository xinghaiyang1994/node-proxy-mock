const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const config = require('./config');
const app = express();
const { onProxyReq } = require('./index');

app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${config.projectPort}`,
  })
);

app.use(
  createProxyMiddleware({
    target: config.projectBackEndUrl,
    changeOrigin: true,
    onProxyReq,
  })
);

app.listen(config.proxyPort, () => {
  console.log(`proxy server: http://localhost:${config.proxyPort}`);
});
