const fs = require('fs');

function addControllers(router, dir) {
    fs.readdirSync(__dirname + '/' + dir)
        .filter((f) => {
            return f.endsWith('.js');
        })
        .forEach((f) => {
            console.log(`process controller:${f}...`);
            let mapping = require(__dirname + '/' + dir + '/' + f);
            let path = f.substring(0, f.length - 3);
            addMapping(router, mapping, path);
        })
}

/* 
    controller统一输出格式
    httpMethod:{
        url:''
        method:''
    }
    httpMethod:get||post
    utl:可为空或不定义，为空或不定义时controller名字映射为对应路由
    method:调用的方法
*/
function addMapping(router, mapping, path) {
    for (let m in mapping) {
        const httpMethod = m.toLowerCase();
        path = mapping[m].url || '/' + path + '/';
        if (router[httpMethod]) {
            router[httpMethod](path, mapping[m].method);
            console.log(`register URL mapping:${httpMethod} ${path}`);
        }
        else {
            console.log(`invalid URL: ${path}`);
        }
    }
}

module.exports = function (router, dir) {
    let controllers_dir = dir || '../controllers'
    router = router || require('koa-router')();
    addControllers(router, controllers_dir);
    return router;
};