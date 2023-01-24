const path = require('path');
const os = require('os');
//获取电脑进程数
const threads = os.cpus().length;
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack');
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');
//开启一个单独的进程检查ts语法，不然ts-loader 为单进程执行类型检查和转译，因此效率有些慢，可以用多进程方案：即关闭ts-loader的类型检查，类型检查由
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  entry: './src/main.ts',
  output: {
    path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
    filename: isProduction
      ? 'static/js/[name].[contenthash].js'
      : 'static/js/[name].js',
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash].js'
      : 'static/js/[name].js',
    assetModuleFilename: 'static/media/[hash:8][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      //处理css
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            //处理浏览器css样式兼容
            //配合package.json中的browserlist中的配置解决浏览器css兼容
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            //处理浏览器css样式兼容
            //配合package.json中的browserlist中的配置解决浏览器css兼容
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|git|webp|svg)$/,
        //asset表示可以转化为base64格式输出，但是需要符合条件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
          },
        },
      },
      {
        test: /\.(ttf|woff2?|map4|map3)$/,
        //asset/resource表示原封不动的输出
        type: 'asset/resource',
      },
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', //开启多进程
            options: {
              workers: threads, //进程数量
            },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, //开启Babel缓存，只针对修改过的js进行降版本打包
              cacheCompression: isProduction, //缓存文件不进行压缩，节约时间
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node-modules/,
        options: {
          cacheDirectory: path.resolve(
            __dirname,
            '../node_modules/.cache/vue-loader'
          ),
        },
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        '../node_modules/.cache/eslintcache'
      ),
      threads,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
        chunkFilename: 'static/css/[name].[contenthash].chunk.css',
      }),
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist'),
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
    isProduction ? '' : new VueLoaderPlugin(),
    //cross-env是定义打包工具的环境变量，是给webpack使用的
    //DefinePlugin是定义源代码的环境变量，用于解决浏览器警告的问题
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    //自动按需加载element-plus
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    new ForkTsCheckerWebpackPlugin(),
  ].filter(Boolean),
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vue: {
          test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
          name: 'chunk-vue',
          priority: 40,
        },
        elementPlus: {
          test: /[\\/]node_modules[\\/]element-plus[\\/]/,
          name: 'chunk-elementPlus',
          priority: 30,
        },
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-libs',
          priority: 20,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
    minimize: isProduction,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin({
        parallel: threads,
      }),
    ],
  },
  //webpack解析模块加载选项
  resolve: {
    //引入时自动补全文件后缀
    extensions: ['.vue', '.js', '.ts', 'json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  devServer: {
    host: 'localhost', // 启动服务器域名
    port: 'auto', // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, //热模块加载，加快编译速度，js代码更新不刷新浏览器
    historyApiFallback: true, //解决前端history刷新404的问题
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true, // 表示是否跨域
        pathRewrite: {
          '^/api': '/api',
        },
        secure: false,
        onProxyRes: function (proxyRes) {
          console.log(proxyRes.statusCode);
        },
        onError: function (err, req, res) {
          console.log(`req.body: ${req.body}`); // here it returned undefined
          console.log(`err.code: ${err.code}`);
          if (err.code === 'ECONNRESET') {
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
          }
        },
      },
    },
  },
  performance: false, //关闭性能分析，提高打包速度
};
