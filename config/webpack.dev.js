const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const getStyleLoaders = (preProcessor = []) => {
    return [
        "style-loader",
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env",
                    ],
                },
            },
        },
        ...preProcessor,
    ].filter(Boolean);
};

module.exports = {
    entry: "./src/main.js",
    output: {
        path: undefined,
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/js/[hash:10][ext][query]",
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: getStyleLoaders(),
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoaders(["less-loader"]),
                    },
                    {
                        test: /\.s[ac]ss$/,
                        use: getStyleLoaders(["sass-loader"]),
                    },
                    {
                        test: /\.(png|jpe?g|gif|svg|webp)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                // ～15kb以下图片 base64
                                maxSize: 15000,
                            },
                        },
                    },
                    {
                        test: /\.(ttf|woff2?)$/,
                        type: "asset/resource",
                    },
                    {
                        test: /\.(jsx?)$/,
                        include: path.resolve(__dirname, "../src"),
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            plugins: [
                                // "@babel/plugin-transform-runtime", // presets中包含了
                                "react-refresh/babel", // 开启js的HMR功能
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new ESLintWebpackPlugin({
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true,
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        new ReactRefreshWebpackPlugin(), // 解决js的HMR功能运行时全局变量的问题
        // 将public下面的资源复制到dist目录去（除了index.html）
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true, // 不生成错误
                    globOptions: {
                        // 忽略文件
                        ignore: ["**/index.html"],
                    },
                    info: {
                        // 跳过terser压缩js
                        minimized: true,
                    },
                },
            ],
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
    },
    resolve: {
        extensions: [".jsx", ".js", ".json"],
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 8000,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    mode: "development",
    devtool: "cheap-module-source-map",
};