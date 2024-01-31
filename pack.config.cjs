const path = require('path');
module.exports = {
  dev_web: {
    name: 'chat_web',
    title: 'AI助手',
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build_spa: {
    name: 'chat_web',
    title: 'AI助手',
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
