const path = require('path');
const fs = require('fs');

const outputFileName = "Entry.MouseAccuracy";
const outputFilePath = "./website/js";

module.exports = {
    devtool: "source-map",
    mode: "development",
    entry: {
        [outputFileName]: './source/Entry.MouseAccuracy.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [
            '.ts',
            '.js',
        ],
        modules: ['node_modules']
    },
    target: 'node',
    output: {
        path: path.resolve(__dirname, outputFilePath),
        filename: '[name].js',
    },
};