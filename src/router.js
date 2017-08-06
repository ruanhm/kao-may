'use strict'
const controller = require('./controller');
const Router = require('koa-router');
const router = new Router();
const DBHelper=require('../lib/db-helper');
const TYPES = require('tedious').TYPES;
const Biz=require('../lib/biz').Biz;
const BizManage=require('../lib/biz').BizManage;
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
    var b=await a.execute();
    //var sql=BizManage.exportBiz(a);
    ctx.response.body={sql:b}
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
    var dbHelper = new DBHelper();
    try{
        await dbHelper.beginTransaction();
        await dbHelper.executeSql(`insert into a values(1,1)`);
        await dbHelper.executeSql(`insert into c values(1,null)`);
        await dbHelper.commitTransaction();
        dbHelper.close();
    }
    catch(ex){
       console.log(ex) 
       await dbHelper.rollbackTransaction();
        dbHelper.close();
    }
})

router.post('/AjaxPost/:BizName',async(ctx,next)=>
{
    console.log(ctx.params.BizName)
    var a=await Biz.getBiz(ctx.params.BizName)
    var b=a._getSqlParamaters(ctx.request.body)
    console.log(b);
    ctx.response.body={sql:a}
})

router.post('/ToolsAjaxPost/:BizName',async(ctx,next)=>
{
    ctx.response.body=ctx.url
})
module.exports = router;
