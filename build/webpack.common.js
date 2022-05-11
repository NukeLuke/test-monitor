const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const os = require('os');
const HappyPack = require('happypack');
const { GenerateSW } = require('workbox-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const srcDir = path.join(__dirname, '../src');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        main: path.join(__dirname, '../src/main.js'),
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].[hash:8].js',
        // publicPath: "/",
        chunkFilename: 'chunk/[name].[chunkhash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [srcDir],
                exclude: /(node_modules|bower_components)/,
                use: ['happypack/loader?id=happybabel'],
            },
            {
                test: /\.less$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            },
                        },
                    },
                    'postcss-loader',
                    'less-loader',
                ],
                exclude: [
                    path.join(`${srcDir}/styles`)
                ],
            },
            {
                test: /\.less$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
                include: [
                    path.join(`${srcDir}/styles`)
                ],
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: ['url-loader'],
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: ['url-loader'],
                include: [srcDir],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: ['url-loader'],
                include: [srcDir],
            },
        ],
    },
    plugins: [
        // 开启 happypack 的线程池
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool,
            cache: true,
            verbose: true,
        }),
        new HtmlWebpackPlugin({
            template: `${srcDir}/index.html`,
        }),
        new CopyWebpackPlugin([
            // {
            //     from: `${srcDir}/assets/images/123.jpg`,
            //     to: '123.jpg',
            // },
        ]),
        new GenerateSW({
            skipWaiting: true, // 强制等待中的 Service Worker 被激活
            clientsClaim: true // Service Worker 被激活后使其立即获得页面控制权
        }),
        new WebpackPwaManifest({
            name: 'test',
            short_name: 'test',
            description: 'test',
            background_color: '#333',
            theme_color: '#333',
            filename: 'manifest.[hash:8].json',
            publicPath: '/',
            icons: [
                {
                    src: path.resolve('src/img/icon.png'),
                    sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                    destination: path.join('icons')
                }
            ],
            // ios: {
            //     'apple-mobile-web-app-title': 'test',
            //     'apple-mobile-web-app-status-bar-style': '#000',
            //     'apple-mobile-web-app-capable': 'yes',
            // },
        })
    ],
    resolve: {
        alias: {
            '@': srcDir,
            '@pages': `${srcDir}/pages`,
        },
    },
    // optimization: {
    //   removeAvailableModules: true, // 删除已解决的chunk (默认 true)
    //   removeEmptyChunks: true, // 删除空的chunks (默认 true)
    //   mergeDuplicateChunks: true // 合并重复的chunk (默认 true)
    // }
    externals: {
        'BMap': 'BMap',
    }
};
