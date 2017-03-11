const Promise = require('bluebird');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
	entry: [
		'babel-polyfill',
		path.join(__dirname, 'client')
	],
	output: {
		path: path.join(__dirname, 'static'),
		filename: 'js/bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			use: [{
				loader: 'babel-loader',
				options: {
					presets: ['react', 'es2015', 'stage-0'],
					plugins: [
						['resolver', { resolveDirs: [path.join(__dirname, 'client')] }],
						'transform-async-to-generator'
					]
				}
			}]
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: [{
					loader: 'style-loader'
				}],
				use: [{
					loader: 'css-loader',
					options: {
						modules: true,
						importLoaders: 1,
						localIdentName: '[name]__[local]__[hash:base64:5]'
					}
				}]
			})
		}]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'css/style.css',
			allChunks: true
		})
	],
	resolve: {
		alias: {
			commonCss: path.join(__dirname, 'client', 'common')
		}
	},
	devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		})
	);
}

function build(callback) {
	if (callback) {
		return webpack(config, callback);
	} else {
		return Promise.promisify(webpack)(config);
	}
}

module.exports = build;
module.exports.config = config;