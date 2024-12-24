module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: "last 2 version, > 1%, not dead",
                useBuiltIns: "entry",
                corejs: 3,
            },
        ],
        "@babel/preset-react",
    ],
    plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-private-methods",
        "@babel/plugin-proposal-private-property-in-object",
    ],
};
