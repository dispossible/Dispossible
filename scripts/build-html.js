const fs = require("fs-extra");
const nunjucks = require("nunjucks");
const minify = require('html-minifier').minify;
const { output } = require("./path");

const fileOpts = { encoding: "utf-8" };


const env = new nunjucks.Environment();
env.addFilter('padStart', function(str, count = 1, char = "0") {
    return `${str}`.padStart(count, char);
});


const template = fs.readFileSync("./src/index.njk", fileOpts);
const html = env.renderString(template);
const htmlMini =  minify(html, {
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
});
fs.writeFileSync(`${output}/index.html`, htmlMini, fileOpts);