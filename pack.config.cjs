const path = require('path');
module.exports = {
  dev_web: {
    title: 'AI助手',
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  build_spa: {
    title: 'AI助手',
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
