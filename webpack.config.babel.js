import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default () => ({
  mode: 'development',
  entry: {
    app: './src-frontend/app.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/static'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer, precss],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
    new HtmlWebpackPlugin({
      filename: 'testing.html',
      template: './src-frontend/testing.html',
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([{
      from: 'src-backend/views',
      to: '../views',
    }]),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});
