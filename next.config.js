const { createProxyMiddleware } = require('http-proxy-middleware');  
  
module.exports = {  
  async rewrites() {  
    return [  
      {  
        source: '/api/:path*',  
        destination: 'http://104.46.232.133/api/:path*', // Proxy to Backend  
      },  
    ];  
  },  
  async headers() {  
    return [  
      {  
        source: '/api/:path*',  
        headers: [  
          { key: 'Access-Control-Allow-Origin', value: '*' },  
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },  
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },  
        ],  
      },  
    ];  
  },  
};  