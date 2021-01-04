const fs = require("fs-extra");
const minify = require('html-minifier').minify;
const postcss = require('postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const webpack = require('webpack');

const dir = "./build";
const fileOpts = { encoding: "utf-8" };

// Create build folder
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.emptyDirSync(dir);


// Copy static files
fs.copySync("./src/static", dir);


// Minify HTML
const html = fs.readFileSync("./src/index.html", fileOpts);
const htmlMini =  minify(html, {
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
});
fs.writeFileSync(`${dir}/index.html`, htmlMini, fileOpts);


// Build styles
const css = fs.readFileSync("./src/css/index.css", fileOpts);
postcss([
    precss({}),
    postcssPresetEnv({stage: 0}),
    autoprefixer({}),
    cssnano({})
])
.process(css, {from: "./src/css/index.css", to: `${dir}/style.css`})
.then(result => {
    fs.writeFileSync(`${dir}/style.css`, result.css, fileOpts);
    if( result.map ){
        fs.writeFileSync(`${dir}/style.css.map`, result.map, fileOpts);
    }
});


// Build scripts
const pack = webpack(require("../webpack.config.js"));
pack.run((err, stats) => {
    if(err){
        console.error(err.stack || err);
        if(err.details){
            console.error(err.details);
        }
    }
    if(stats.hasErrors()){
        const info = stats.toJson();
        console.error(info.errors);
    }
});