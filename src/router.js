'use strict'
const controller = require('./controller');
const Router = require('koa-router');
const router = new Router();
const DBHelper=require('../lib/db-helper');
const TYPES = require('tedious').TYPES;
const Biz=require('../lib/biz');
controller(router);
router.get('/', async (ctx, next) => {
    await ctx.render('/ind/index');

})

router.get('/AjaxGet/:QueryName',async(ctx,next)=>
{
    var dbHelper = new DBHelper();
    var ps=[{
        name:'UserNO',
        type:TYPES.VarChar,
        value:'admin'
    }]
    let data = await dbHelper.query(`select top 1 * from tUser where s_UserNO=@UserNO`,ps);        
    ctx.response.body=JSON.stringify([...data]);
})

router.get('/AjaxGridData/:QueryName',async(ctx,next)=>
{
    var a=await Biz.getBiz(ctx.params.QueryName)
    ctx.response.body=a
})

router.get('/ToolsAjaxGet/:QueryName',async(ctx,next)=>
{
    try{
        var dbHelper = new DBHelper();
        await dbHelper.executeSqlTran(`insert into c values(1,1)
                insert into c values(1,null)`);
        dbHelper.close();
    }
    catch(ex){
        console.error(ex);
        dbHelper.close();
    }
})

router.get('/ToolsAjaxGridData/:QueryName',async(ctx,next)=>
{
    ctx.response.body=ctx.url
})

router.post('/AjaxPost/:BizName',async(ctx,next)=>
{
    ctx.response.body=ctx.url
})

router.post('/ToolsAjaxPost/:BizName',async(ctx,next)=>
{
    ctx.response.body=ctx.url
})
module.exports = router;
