const path = require('path');
const webpack = require('webpack');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

let config = {
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    indent: 'postcss',
                    syntax: 'postcss-scss',
                    plugins: () => [
                        // Purge unused CSS from .js and .jsx files
                        require('@fullhuman/postcss-purgecss')({
                            // You'll want to modify this glob if you're using TypeScript
                            content: glob.sync('src/**/*.{js,jsx}', { nodir: true }),
                            extractors: [
                                {
                                    extractor: class {
                                        static extract(content) {
                                            // See a note on this in the #addenum section below
                                            return content.match(/\w+/g) || [];
                                        }
                                    },
                                    extensions: ['js', 'jsx']
                                }
                            ]
                        }),
                        require('cssnano')
                    ]
                }
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './index.html',
            favicon: './favicon.png',
        }),
    ],
};

module.exports = (env, argv) => {
    config.mode = argv.mode;
    if (argv.mode === 'development') {
        config.entry = ['react-hot-loader/patch', './src/index.js'];
        config.devtool = 'inline-source-map';
        config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
        config.optimization = {
            usedExports: true,
        }
        config.devServer = {
            compress: true,
            hot: true,
            contentBase: './build',
            historyApiFallback: true, //For react router
        };
    }

    if (argv.mode === 'production') {
        config.entry = ['./src'];
        config.devtool = 'source-map';
        config.output.filename = '[name].[chunkhash].bundle.js';
        config.output.chunkFilename = '[name].[chunkhash].bundle.js';
        config.optimization = {
            moduleIds: 'hashed',
            runtimeChunk: {
                name: 'manifest',
            },
            usedExports: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'endor',
                        chunks: 'all',
                        priority: -10,
                        reuseExistingChunk: true,
                    }
                },
            },
        };
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
            }),
            new CompressionPlugin({
                test: /\.js(\?.*)?$/i,
            }),
            new CopyPlugin({
                patterns: [
                    { from: './_redirects' },
                ],
            })
        );
        config.performance = {
            hints: 'warning',
            // Calculates sizes of gziped bundles.
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js.gz');
            },
        };
    }

    return config;
};
