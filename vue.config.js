module.exports = {
  css: {
    extract: false
  },

  publicPath: './', // 基本路径
  outputDir: 'dist', // 输出文件目录
  assetsDir: "static", //放置生成的静态文件目录（js css img）
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    port: 3000,
  }
}
