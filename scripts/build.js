const fs = require("fs-extra");

const { output } = require("./path");

// Create build folder
if(!fs.existsSync(output)){
    fs.mkdirSync(output);
}
fs.emptyDirSync(output);


// Copy static files
require("./build-static");

// Minify HTML
require("./build-html");

// Build styles
require("./build-style");

// Build scripts
require("./build-script");

//Gallery images
require("./build-img");