const nodeExternals = require('webpack-node-externals')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  externals: [nodeExternals()],
  mode:'none',
  module: {
    rules: [
        //  使用vue-loader 加载 .vue 结尾的文件
        {
          test: /\.vue$/, 
          loader: 'vue-loader',
          exclude: /node_modules/    
        },
        {
          test: /\.css$/i,
          use: ['css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['sass-loader','css-loader']
        }
    ]         
  },
  plugins:[
    new VueLoaderPlugin()
  ],
  output: {
    // 在源码表中使用绝对路径 (对于在 IDE 中调试时很重要)
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  }
}