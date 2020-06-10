const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  // ###### CHECK INTERNAL IMPORTS:
  let _colorsModuleSrc = `src/style/templates/${env['TEMPLATE']}/backroom/exportable/_app.colors.scss`;
  const _importsModuleSrc = `src/style/templates/${env['TEMPLATE']}/imports.js`;
  if (fs.existsSync(path.resolve(__dirname, _importsModuleSrc))) {
    const imports = require(path.resolve(__dirname, _importsModuleSrc));
    _colorsModuleSrc = `src/style/templates/${imports.colors}/backroom/exportable/_app.colors.scss`;
  }

  return {
    mode: 'development',
    entry: {
      [env['TEMPLATE']]: path.resolve(__dirname, `src/style/templates/${env['TEMPLATE']}/${env['TEMPLATE']}.scss`)
    },
    output: {
      path: path.resolve(__dirname, `dist/${env['TEMPLATE']}`)
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'postcss-loader', options: {
                ident: 'postcss',
                plugins: () => [
                  postcssPresetEnv({
                    stage: 0,
                    browsers: 'last 2 versions'
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(eot|otf|svg|ttf|woff|woff2)$/i,
          loader: 'file-loader?name=fonts/[name].[ext]'
        },
        // {
        //   test: /\.(jpe?g|png|gif|svg)$/i,
        //   loader: 'file-loader?name=assets/img/[name].[ext]'
        // }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/style/global/exportable/_app.mixins.scss'),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/_mixins.scss`)
          },
          {
            from: path.resolve(__dirname, _colorsModuleSrc),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/_colors.scss`)
          },
          {
            from: path.resolve(__dirname, `src/style/templates/${env['TEMPLATE']}/package.json`),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/package.json`)
          },
          {
            from: path.resolve(__dirname, `src/style/templates/${env['TEMPLATE']}/README.md`),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/README.md`)
          },
          {
            from: path.resolve(__dirname, `src/style/templates/${env['TEMPLATE']}/LICENSE`),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/LICENSE`),
            toType: 'file'
          },
          {
            from: path.resolve(__dirname, `.npmignore`),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/.npmignore`),
            toType: 'file'
          },
          {
            from: path.resolve(__dirname, `.npmrc`),
            to: path.resolve(__dirname, `dist/${env['TEMPLATE']}/.npmrc`),
            toType: 'file'
          }
        ]
      })
    ]
  };
};
