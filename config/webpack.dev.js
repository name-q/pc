const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// 引入运行时模块
const reactRefreshRuntimeEntry = require.resolve("react-refresh/runtime");

// 工具方法：获取样式加载器
const getStyleLoaders = (preProcessor = []) => {
    return [
        "style-loader",
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: ["postcss-preset-env"],
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
                        use: getStyleLoaders([
                            {
                                loader: "less-loader",
                                options: {
                                    lessOptions: {
                                        strictMath: true,
                                    },
                                },
                            },
                        ]),
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
                                "react-refresh/babel", // 开启 HMR 功能
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
        new ReactRefreshWebpackPlugin({
            overlay: false, // 可选：关闭热更新错误的覆盖层
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true,
                    globOptions: {
                        ignore: ["**/index.html"],
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
        sideEffects: false,
    },
    resolve: {
        extensions: [".jsx", ".js", ".json"],
        alias: {
            "react-refresh/runtime": reactRefreshRuntimeEntry,
        },
    },
    devServer: {
        open: true,
        host: "localhost",
        port: 8000,
        hot: false,
        compress: true,
        historyApiFallback: true,
    },
    mode: "development",
    devtool: "source-map",
};
