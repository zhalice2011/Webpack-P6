const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包html模块
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制文件模块
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // js压缩插件 文档:http://www.css88.com/doc/webpack2/plugins/uglifyjs-webpack-plugin/
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 你的样式将不再内嵌到 JS bundle 中
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除dist文件夹中重复的文件


module.exports = {
    entry: './src/js/index.js',  // 入口文件
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js'  // 输入文件
    },
    module: {
        rules:[
            {
              test: /\.js$/,   // js结尾的文件
              use: 'babel-loader?presets[]=es2015',
              exclude:[  //忽略掉下面的文件 不进行检测
                path.resolve(__dirname,'node_modules')
                ]
            },
            {
		        test: /\.css$/,
		        use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
	        	})
      		}
        ]
    },
    resolve: {
        extensions: ['.js','.css']
    },
    devServer: { // 关于https://webpack.js.org/configuration/dev-server/
        contentBase: path.resolve(__dirname, 'dist'),
        host: "0.0.0.0", // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定如下： 所有的都能访问 通过ip或者通过localhost
        // compress: true,  // 启用gzip压缩一切服务
        // hotOnly: true,   // 使热模块更换(见devServer.hot)无需刷新页面作为候选构建失败。     
        port: 9999,
        inline: true,
        //hot: true,      //  启动热更新模块
        overlay: {      //  在编译的时候出现任何错误 就会在网页上面显示黑色的背景和错误的信息
            warnings: true,
            errors: true
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // 热更新
        new HtmlWebpackPlugin({
            // 模板文件
            template: 'src/index.html',
            // 打包后文件名称，会自动放到 output 指定的 dist 目录
            filename: 'index.html'
        }),
        new CopyWebpackPlugin( // 复制文件
            [
                {
                    from: 'src/images', 
                    to: 'images',
                    ignore: ['images.textClipping'], // 忽略images.textClipping这个文件 不进行复制
                    copyUnmodified: true  // 默认是false 默认情况下只会复制修改的文件,修改成true之后复制所有的文件               
                }
            ]
        ),
        new UglifyJsPlugin(), // 代码压缩
        new ExtractTextPlugin("styles.css"), // CSS
        new CleanWebpackPlugin(
            ['dist'],
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
                dry:      false        　　　　　　　　　　//启用删除文件
            }
        ) // 删除dist  文件
        
    ],
};