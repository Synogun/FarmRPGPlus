const { UserscriptPlugin } = require('webpack-userscript');
const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');

const developmentEnvironment =
    process.env.NODE_ENV &&
    process.env.NODE_ENV === 'development' &&
    {
        filename: 'FarmRPGPlusDEVMODE.user.js',
        path: path.resolve(__dirname, 'build'),
        scriptName: `${pkg.userscript.name} DEV`,
    };

module.exports = {
    entry: './src/main.js',
    output: {
        filename: developmentEnvironment?.filename ?? 'FarmRPGPlus.user.js',
        path: developmentEnvironment?.path ?? path.resolve(__dirname, 'dist'),

    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
            'process.env.VERSION': JSON.stringify(pkg.version),
        }),

        new UserscriptPlugin({
            headers: {
                name: developmentEnvironment?.scriptName ?? pkg.userscript.name,
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
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
