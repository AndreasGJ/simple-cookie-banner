const path = require("path");

module.exports = {
    entry: "./main.js",
    output: {
        filename: "cookie-banner.min.js",
        path: path.resolve(__dirname, "dist")
    }
};
