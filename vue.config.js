module.exports = {
    // 这里要加入一些发布时的配置
    // baseUrl: './',
    // assetsDir: 'static',
    // productionSourceMap: false,
    devServer: {
         proxy: {
             '/api':{
                 target:'http://localhost:5000',
                 changeOrigin:true,
                 pathRewrite:{
                     '/api':''
                 }
             }
         }
     }
}
