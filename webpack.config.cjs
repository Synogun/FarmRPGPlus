const { UserscriptPlugin } = require('webpack-userscript');
const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');

const productionEnvironment =
    process.env.NODE_ENV &&
    process.env.NODE_ENV === 'production' &&
    {
        filename: 'FarmRPGPlus.user.js',
        path: path.resolve(__dirname, 'dist'),
        scriptName: pkg.userscript.name,
    };

module.exports = {
    entry: './src/main.js',
    output: {
        filename: productionEnvironment?.filename ?? 'FarmRPGPlusDEVMODE.user.js',
        path: productionEnvironment?.path ?? path.resolve(__dirname, 'build'),
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            VERSION: pkg.version,
        }),

        new UserscriptPlugin({
            headers: {
                name: productionEnvironment?.scriptName ?? `${pkg.userscript.name} DEV`,
                namespace: pkg.userscript.namespace,
                match: pkg.userscript.match,
                grant: pkg.userscript.grant,
                license: pkg.license,
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
                    options: { presets: ['@babel/preset-env'] },
                },
            },
            { test: /\.css$/, type: 'asset/source' },
        ],
    },
};
