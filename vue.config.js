const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? './'
  : '/'

// module.exports = {
//   baseUrl: './', // 默认'/'，部署应用包时的基本 URL
//   outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
//   assetsDir: '',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
//   lintOnSave: false,
//   runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
//   productionSourceMap: false,  // 生产环境的 source map
//   parallel: require('os').cpus().length > 1,
//   pwa: {}
// };
module.exports = {
  // 引入高德
  configureWebpack: {
    externals: {
      'AMap': 'AMap'
      // 'AMapUI': 'AMapUI'
    }
  },
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  runtimeCompiler: true,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.2.250',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      // '/captcha': {
      //   target: 'http://192.168.2.250/captcha',
      //   changeOrigin: true
      // }
    }
  }
}
