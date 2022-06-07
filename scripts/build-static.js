const fs = require("fs-extra");
const { output } = require("./path");

fs.copySync("./src/static", output);