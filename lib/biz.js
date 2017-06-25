const DBHelper = require('./db-helper');
const BizResult = require('./biz-result');
const TYPES = require('tedious').TYPES;
const _ = require('lodash');
const BizSql=require('./biz-sql');
const BizCheck=require('./biz-check');
const BizParameter=require('./biz-parameter');

class Biz {
    constructor(bizName, checks, sqls, type, isSys, isMetaCache, params,  countSql, hiddenFields, scenes, readOnly4Adds, readOnly4Edits, notNulls) {
        if (!_.isWeakSet(checks)) throw new Error('Type Error:checks is a WeakSet');
        if (!_.isWeakSet(sqls)) throw new Error('Type Error:sqls is a WeakSet');
        
        this.bizName = bizName
        this.checks = checks
        this.sqls = sqls
        this.type = type
        this.isSys = isSys
        this.params = params
        this.countSql = countSql
        this.hiddenFields = hiddenFields
        this.scenes = scenes
        this.readOnly4Adds = readOnly4Adds
        this.readOnly4Edits = readOnly4Edits
        this.notNulls = notNulls
    }

    static async getBiz(bizName) {
        var dbhelper = new DBHelper();
        var biz_arr = [];
        const biz_content = `select [Type]=n_Type,IsSys=isnull(b_IsSys,0),CountSql=s_CountSql,HiddenFields=s_HiddenFields,Scenes=s_Scenes,ReadOnly4Adds=s_ReadOnly4Adds,ReadOnly4Edits=s_ReadOnly4Edits,NotNulls=s_NotNulls from FRM_Biz where s_BizName=@BizName`;
        const biz_sql = `select  [Sql]=s_Sql,ID=n_ID,[Name]=s_Name,IsRun=b_IsRun,LoopField=s_LoopField,[Key]=s_Key,AssistKey=s_AssistKey  from FRM_Sql where s_BizName=@BizName`;
        const checks_sql = `select  BizName=s_BizName,ID=n_ID,[Cue]=s_Cue,[Sql]=s_Sql,IsRun=b_IsRun,CheckField=s_CheckField from FRM_Check where s_BizName=@BizName`;
        const params_sql = `select BizName=s_BizName,[Param]=s_Param,ParamName=s_ParamName,ParamType=s_ParamType,IsReturn=b_IsReturn,IsLoop=b_IsLoop,[Default]=s_Default,[IsNull]=b_IsNull,[Index]=n_Sort FROM FRM_Parameter where s_BizName=@BizName`;
        var ps = [{ name: 'BizName', type: TYPES.VarChar, value: bizName }];
        biz_arr.push(await dbhelper.query(biz_content, ps));
        biz_arr.push(await dbhelper.query(biz_sql, ps));
        biz_arr.push(await dbhelper.query(checks_sql, ps));
        biz_arr.push(await dbhelper.query(params_sql, ps));
        dbhelper.close();

        //获取BizSql
        var sqls = new WeakSet();
        for(let o of biz_arr[1]){
            sqls.add(new BizSql(
                o['ID'],
                o['Name'],
                o['Sql'],
                o['Key'],
                o['AssistKey'],
                o['AssistKey'].split(','),
                o['LoopField'],
                o['IsRun']
            ))
        }       

        //获取Checks
        var checks=new WeakSet();
        for(let o of biz_arr[2]){
            checks.add(new BizCheck(
                o['ID'],
                o['Cue'],
                o['Sql'],
                o['IsRun'],
                o['CheckField']
            ))
        } 

        //获取params
        var params=new WeakSet();
        for(let o of biz_arr[3]){
            params.add(new BizParameter(
                o['Param'],
                o['ParamName'],
                o['ParamType'],
                o['IsReturn'],
                o['IsLoop'],
                o['IsNull'],
                o['ID'],
                o['Default'],                
            ))
        }
        return new Biz(
            bizName,
            checks,
            sqls,
            biz_arr[0][0]['Type'],
            biz_arr[0][0]['IsSys'],
            'fields',
            biz_arr[0][0]['CountSql'],
            biz_arr[0][0]['HiddenFields'],
            biz_arr[0][0]['Scenes'],
            biz_arr[0][0]['ReadOnly4Adds'],
            biz_arr[0][0]['ReadOnly4Edits'],
            biz_arr[0][0]['NotNulls']
        )
    }
}


module.exports = Biz;