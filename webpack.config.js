const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js', // projenin giriş noktası
  output: {
    filename: 'bundle.js', // çıktı dosyası adı
    path: path.resolve(__dirname, 'dist') // çıktı dosyasının konumu
  },
  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },
  resolve: {
    fallback: {
      async_hooks: false,
      "fs": false,
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "net": false,
      "os": require.resolve("os-browserify/browser"),
      "buffer": false,
      "assert": false,
      "querystring": false,
      "url": false,
      "util": false 
    }
  }
};
