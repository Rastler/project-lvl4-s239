import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default () => ({
  // mode: 'production',
  entry: {
    app: './src/client-app/app.js',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/client-app'),
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
      filename: 'index.html',
      template: './src/client-app/testing.html',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
