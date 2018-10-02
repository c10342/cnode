const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports={
    module: {
        loaders: [
            {
                test:/.(js|jsx)$/,
                use: "babel-loader",
                exclude:[
                    path.join(__dirname,'../node_modules')
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!autoprefixer-loader"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]!autoprefixer-loader!less-loader"
                })
                // loader: 'style-loader!css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]!autoprefixer-loader!less-loader'
            },
            {
                test: /\.(jpg|png|svg|ttf|woff|woff2|gif|otf|eot)$/,
                loader: 'url-loader',
                options: {
                    limit: 4096, //4096字节以上生成文件，否则base6
                    name: '[name].[ext]'
                }
            }
        ]
    },
    output: {
        path: path.join(__dirname,'../dist'),
    },
    resolve: {
        extensions: ['.js','.jsx']
    },
    plugins: [
        new ExtractTextPlugin("style.css")
    ]
}