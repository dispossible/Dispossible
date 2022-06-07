const fs = require("fs-extra");
const postcss = require('postcss');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const { output } = require("./path");

const fileOpts = { encoding: "utf-8" };

const css = fs.readFileSync("./src/css/index.css", fileOpts);
postcss([
    precss({}),
    postcssPresetEnv({stage: 0}),
    autoprefixer({}),
    cssnano({})
])
.process(css, {from: "./src/css/index.css", to: `${output}/style.css`})
.then(result => {
    fs.writeFileSync(`${output}/style.css`, result.css, fileOpts);
    if( result.map ){
        fs.writeFileSync(`${output}/style.css.map`, result.map, fileOpts);
    }
});