const isProduction = process.env.NODE_ENV === 'production'
// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    chunkFilename: '[name].[contenthash].js', // вже не важливо, бо нижче maxChunks: 1
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: isProduction ? './' : '/'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    client: {
      overlay: true
    }
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
      publicPath: isProduction ? './' : '/'
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new CopyPlugin({
      patterns: [{ from: 'public/assets', to: 'assets' }]
    })
  ]
}
