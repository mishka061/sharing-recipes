const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: (pathData) => {
                        if (pathData.filename.includes('public/images')) {
                            return 'images/[name][ext]';
                        } else if (pathData.filename.includes('public/img/')) {
                            return 'img/[name][ext]';
                        } 
                        return '[name][ext]';
                    },
                },
                include: path.resolve(__dirname, 'public'),
            }
            
            
        ],
    },
};




