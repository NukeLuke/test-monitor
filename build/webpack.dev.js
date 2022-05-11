const webpack = require('webpack');
const merge = require('webpack-merge');
const fs = require('fs')
const path = require('path')

const commonConfig = require('./webpack.common');

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = merge(commonConfig, {
    mode: 'development',
    // 开发环境本地启动的服务配置
    devServer: process.env.USE_LOCAL_MOCK === 'true' ?
        {
            port: 9003,
            hot: true,
            open: true,
            historyApiFallback: true,
            compress: true,
            // 接口代理转发
            proxy: {
                '/testapi/*': {
                    target: `http://localhost:9003`,
                    changeOrigin: true,
                    secure: false,
                    pathRewrite: function (path) {
                        return path.replace(/^\/testapi/, '/mock')
                    },
                    onProxyReq: function (proxyReq) {
                        proxyReq.method = 'GET'
                        proxyReq.setHeader('Access-Control-Allow-Origin', true)
                    },
                },
            },
        } :
        {
            port: 9008,
            host: getIPAdress(),
            historyApiFallback: true,
            hot: true,
            open: true,
            https: true,
            key: fs.readFileSync(path.resolve(__dirname, "../localhost+1-key.pem")),
            cert: fs.readFileSync(path.resolve(__dirname, "../localhost+1.pem")),
            // 接口代理转发
            proxy: {
                // '/testapi/api/*': {
                //     target: 'http://39.105.57.176:16001',
                //     changeOrigin: true,
                //     secure: false,
                //     pathRewrite: function (path) {
                //         return path.replace(/^\/testapi/, '')
                //     },
                // },
                // '/testapi/api/eam/*': {
                //     target: 'http://192.168.8.198:80',
                //     changeOrigin: true,
                //     secure: false,
                //     pathRewrite: function (path) {
                //         return path.replace(/^\/testapi/, '')
                //     },
                // },
                // '/testapi/workflow/*': {
                //     target: 'http://192.168.8.198:80',
                //     changeOrigin: true,
                //     secure: false,
                //     pathRewrite: function (path) {
                //         return path.replace(/^\/testapi/, '')
                //     },
                // },
                '/testapi/*': {
                    target: 'http:/ehr.com',
                    changeOrigin: true,
                    secure: false,
                    pathRewrite: function (path) {
                        return path.replace(/^\/testapi/, '')
                    },
                },
            },
        },
    plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()],
    devtool: 'eval-source-map',
});
