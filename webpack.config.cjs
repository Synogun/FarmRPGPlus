const { UserscriptPlugin } = require('webpack-userscript');
const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'FarmRPGPlus.user.js',
        path: path.resolve(__dirname, 'dist'),

    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        }),

        new UserscriptPlugin({
            headers: {
                name: pkg.userscript.name,
                namespace: pkg.userscript.namespace,
                match: pkg.userscript.match,
                grant: pkg.userscript.grant,
                version: pkg.version,
                author: pkg.author,
                description: pkg.description,
                icon: pkg.userscript.icon,
            },
        }),
    ],
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
