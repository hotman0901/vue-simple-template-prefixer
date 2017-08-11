var path = require('path')
var webpack = require('webpack')
// 抽離css個別檔案
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 清除dist資料夾
var CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            
            // 官方原本的設定，css會直接寫在js內部
            // 'scss': 'vue-style-loader!css-loader!sass-loader',
            // 'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
            
            // 我後來改成產出css檔
            scss: ExtractTextPlugin.extract({
              // 加上?sourceMap 就不會爆錯誤
              use: [ 'css-loader', 'sass-loader', 'postcss-loader?sourceMap' ]
            }),
            css: ExtractTextPlugin.extract({
              // 加上?sourceMap 就不會爆錯誤
              use: [ 'css-loader', 'style-loader', 'postcss-loader?sourceMap' ]
            }),
          }
          // other vue-loader options go here
        }
      },
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //      use: [ 'css-loader', 'style-loader', 'postcss-loader' ]
      //   })
       
      // },
      //  {
      //   test: /\.scss$/,
      //   use: ExtractTextPlugin.extract({
      //     use: [ 'css-loader', 'sass-loader', 'postcss-loader' ]
      //   })
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: './img/[name]-[hash].[ext]',
          // outputPath: 'img/', 不曉得為什麼加上這個反而會多一個img路徑
          // publicPath: '../',
          limit: 10000/* 小於 10kB 的圖片轉成 base64 */
        }
      }, 
      {
        // 另外將font獨立一個資料夾
        test: /\.(svg|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]',
              outputPath: 'font/',
              publicPath: '../'
            }
          },
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    // extractPlugin, html 模板參考
    new HtmlWebpackPlugin({
      template: './index.html',
      // 加上這一段讓CommonsChunkPlugin不會產稱error
      // chunksSortMode: 'dependency',
    }),
    //  new CleanWebpackPlugin(['dist'], {
      // "verbose": true,
      // 可以增加判斷說不要刪掉哪個檔案 "exclude": ['05ef02be5a02714eab77.vendor.js']
    // }),
    // 打包css用
    // new ExtractTextPlugin({filename: "./css/[name].[hash].css", allChunks: true})
    new ExtractTextPlugin({filename: "./css/[name].[hash].css", allChunks: true}),
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CleanWebpackPlugin(['dist'], {
      "verbose": true,
      // 可以增加判斷說不要刪掉哪個檔案 "exclude": ['05ef02be5a02714eab77.vendor.js']
    }),
  ])
}
