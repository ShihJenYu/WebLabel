module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpe|jpg|woff2|woff|eot|ttf|svg)(\?.*$|$)/,
                loader: 'file-loader?name=assets/fonts/[name].[ext]',
            },
        ],
    },
};
