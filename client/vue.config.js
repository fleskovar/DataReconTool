const path = require('path')
console.log();


module.exports = {
    outputDir: path.resolve(__dirname, "../server/static")
    
    //chainWebpack: config => {
    //    config.resolve.alias
    //        .set("@api", path.resolve(__dirname, "./src/api"));
  //}
}
