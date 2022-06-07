const webpack = require('webpack');

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