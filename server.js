const express = require('express');  
const next = require('next');  
const { createProxyMiddleware } = require('http-proxy-middleware');
// const { initialize } = require('./db/init');
  
const dev = process.env.NODE_ENV !== 'production';  
const app = next({ dev });  
const handle = app.getRequestHandler();  
  
app.prepare().then(() => {
  const server = express();  
  
  // Proxy middleware  
  server.use('/api', createProxyMiddleware({  
    target: 'http://104.46.232.133',  
    changeOrigin: true,  
    pathRewrite: {  
      '^/api': '/api', // Keep the /api prefix  
    },  
  }));  
  
  server.all('*', (req, res) => {  
    return handle(req, res);  
  });  
  
  server.listen(3002, (err) => {  
    if (err) throw err;  
    console.log('> Ready on http://localhost:3002');  
  });

  // 连接数据库
  // initialize()
});  