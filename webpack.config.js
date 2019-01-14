const path = require('path');

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
    publicPath: '/', //webpack content served from
  },

  devServer: {
    contentBase: __dirname, //content not from webpack served from
    compress: true,
    port: 8080,
    stats: 'errors-only',
    open: true
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'buble-loader',
          options: {
            objectAssign: 'Object.assign'
          }
        },
        include: paths.src,
      },
    ]
  }
};
