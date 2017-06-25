'use strict'

const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./src/router.js');
const path=require('path');
const staticCache=require('koa-static-cache');
const views = require('koa-views');
const fs=require('fs');

app.use(staticCache(path.join(__dirname, 'public')));
app.use(views(__dirname + '/views' ));
app.use(bodyParser());
app.use(router.routes());
app.use(async (ctx, next) => {
    if(fs.existsSync(__dirname+ '/views/'+ctx.url+'.html')){
        await ctx.render(ctx.url);
    }
    else{
        await ctx.redirect('404');
    }    
    
})
app.listen(3000);
console.log('app started at port 3000...');




