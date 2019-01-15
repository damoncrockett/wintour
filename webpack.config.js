const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const paths = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
}

module.exports = {
  entry: path.resolve(paths.src,'index.js'),
  resolve: {
    extensions: ['.js', '.jsx', ],
  },
  output: {
    path: paths.dist,
    filename: 'bundle.js',
  },

  devServer: {
    contentBase: paths.dist, //where webpack puts new index.html
    compress: true,
    port: 8080,
    stats: 'errors-only',
    open: true
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'buble-loader',
          options: {
            objectAssign: 'Object.assign'
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ]
};
