'use strict'

const base64 = require('hi-base64')
const uuid = require('uuid')
const mongoose = require('mongoose')
const events = mongoose.model('events')
const check = mongoose.model('check')
const ApiError = require('../../middlewares/ApiError')
const ApiErrorNames = require('../../middlewares/ApiErrorName')
const logUtil = require('../../utils/log_util')

class eventsController {

    // 检查event数量
    static async checklist(ctx, next) {
      const query = ctx.query
      const page = Number(query.page || 1)
      const pageSize = Number(query.pageSize || 10)
      const start = Number(query.start || 0)
      const end = Number(query.end || 0)
      const { mobile } = query
      let total, res
      let ex  = {start:{$gte:start}, start:{$lte:end}}
      if( !mobile ) {
        if(!start && !end) {
          ex = {}
        } else if(start && !end){
          ex = {start:{$gte:start}}
        } else if(!start && end){
          ex = {start:{$lte:end}}
        } else {
          ex = {start:{$gte:start}, start:{$lte:end}}
        }
      } else if ( mobile ) {
        if(!start && !end) {
          ex = {mobile}
        } else if(start && !end){
          ex = {mobile, start:{$gte:start}}
        } else if(!start && end){
          ex = {mobile, start:{$lte:end}}
        } else {
          ex = {mobile, start:{$gte:start}, start:{$lte:end}}
        }
      }

      res = await check.find(ex, { _id: 0, id:0, __v:0 })
      .sort('-meta.createAt')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec()
      .catch(err => ctx.throw(500, err))

      ctx.body = {
        total: res.length,
        list: res
      }
      next()
    }

  // 检查event数量
  static async check(ctx, next) {
    const query = ctx.query
    const count = Number(query.count || 0)
    const start = Number(query.start || 0)
    const end = Number(query.end || 0)
    const { mobile } = query

    if( !mobile || !count || !start || !end ) {
      throw new ApiError(ApiErrorNames.PARAMS_NOT_EXIST)
    } else {
      let total, ok
      total = await events.count({mobile, xt:{$gte:start}, xt:{$lte:end}}).exec().catch(err => ctx.throw(500, err))
      ok = total === count
      const id = uuid.v4()
      let item = new check({
        id, mobile, start, end, total, count, ok
      })
      const ret = await item.save()

      ctx.body = {
        ret
      }
    }
    next()
  }

  // 查询
  static async getList(ctx, next) {
    const query = ctx.query
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 10)
    const { id, mobile, e } = query
    let total, res

    // id, xmi, partner, origin, appVersion, identity, sourceId, userFlag, mobile, token, productCode, element
    if (id) {
      res = await events.findOne({ id }, { _id: 0, identity: 0, partner: 0 , userFlag: 0, __v:0 })
        .catch(err => ctx.throw(500, err))
      ctx.body = res
    } else {
      let ex = {}
      if(mobile) {
        ex = !e ? {mobile} : {mobile, e}
      } else if(!e){
        ex = {e}
      }

      res = await events.find(ex, { _id: 0, identity: 0, partner: 0 , userFlag: 0, __v:0 },)
        .sort('-meta.updateAt')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec()
        .catch(err => ctx.throw(500, err))

      ctx.body = {
        total: res.length,
        list: res
      }
    }

    next()
  }

  // 查询event数量
  static async getCount(ctx, next) {
    const query = ctx.query
    // const start = Number(query.start || 0)
    // const end = Number(query.end || 0)
    const { mobile } = query
    if( !mobile ) {
      let total, res
      total = await events.count({mobile}).exec().catch(err => ctx.throw(500, err))
      //res = await events.find({mobile}).exec().catch(err => ctx.throw(500, err))
      ctx.body = {
        total
      }
    } else {
      let total, res
      total = await events.count({mobile}).exec().catch(err => ctx.throw(500, err))
      // res = await events.find({mobile}).exec().catch(err => ctx.throw(500, err))
      ctx.body = {
        total
      }
    }
    next()
  }

  // 创建新词条
  static async report(ctx) {
    const header = ctx.request.header
    const { d } = ctx.request.body
    if (!d) {
      throw new ApiError(ApiErrorNames.PARAMS_NOT_EXIST)
    }
    // console.log('start  base64.decode d:', JSON.stringify(d))
    const de = base64.decode(d);
    // console.log('finish base64.decode de:', de)
    
    const dObj = JSON.parse(de)

    const { list, xmi } = dObj
    const partner = dObj["x-partner-code"]
    const origin = dObj["X-Origin"]
    const appVersion = dObj["X-App-Version"]
    const identity = dObj["X-User-Identity"]
    const sourceId = dObj["X-Source-Id"]
    const userFlag = dObj["X-User-Flag"]
    const mobile = dObj["X-User-Mobile"]
    const token = dObj["X-User-Token"]
    const productCode = dObj["X-Product-Code"]


    // "X-User-Token" : "t2mtrjl33i76hefc5voe73s9lv",
    // "xmi" : "F8F4E637-C96A-47FC-86F6-252122CDF238",
    // "X-Product-Code" : "WLD",
    // "Content-Type" : "application\/json",
    // "X-User-Flag" : "normal",
    // "X-User-Mobile" : "13600002277",
    // "X-User-Identity" : 2,
    // "X-Origin" : "AppStore",
    // "x-partner-code" : "wld",
    // "X-Source-Id" : "3",
    // "X-App-Version" : "5.2.3",
    // "Accept" : "application\/json"


    // console.log(`Request xmi:${xmi}, partner:${partner}, origin:${origin}, appVersion:${appVersion}, identity:${identity}, sourceId:${sourceId}, userFlag:${userFlag}, mobile:${mobile},`)
    if (!list || !xmi || !partner || !origin || !appVersion || !identity || !sourceId || !userFlag || !mobile || !token || !productCode) {
      throw new ApiError(ApiErrorNames.PARAMS_NOT_EXIST)
    }

    // let item = await events.findOne({
    //   xmi
    // }).exec()
    // if (item) {
    //   throw new ApiError(ApiErrorNames.DATA_ALREADY_EXISTS)
    // }

    let eventArray = [];
    for(let element of list) {
      const {_track_id:trackId,e,xt,cp:{os_version,os,av}} = element
      // console.log('list element:', e,xt,os_version,os,av,trackId)
      const id = uuid.v4()
      let item = new events({
        xmi, partner, origin, appVersion, identity, sourceId, userFlag, mobile, token, productCode, id, e, xt, element
      })
      item = await item.save()
      eventArray.push({xmi, trackId, e, xt, os_version, os, av, partner, origin, appVersion, identity, sourceId, userFlag, mobile});
      logUtil.logEvent({trackId, mobile, origin, appVersion, sourceId, xt, os, av, e });
    }
    // list.forEach(async element  =>  {
    // });
    // console.log('Response:', JSON.stringify(eventArray))
    ctx.body = {
      success: true,
      count: eventArray.length,
    }
  }

  // 删除词条
  static async delete(ctx) {
    const { id } = ctx.params
    if (!id) {
      throw new ApiError(ApiErrorNames.PARAMS_NOT_EXIST)
    }
    await events.remove({ id })
      .exec()
      .catch(err => ctx.throw(500, err))
    ctx.body = {
      success: true
    }
  }

  // 删除词条
  static async clear(ctx) {
    const { mobile } = ctx.query
    // console.log(`ctx.query:`, ctx.query);
    // console.log(`ctx.params:`, ctx.params);

    if (!mobile) {
      const ret = await events.remove({ mobile:{$ne:""} })
      .exec()
      .catch(err => ctx.throw(500, err))

      ctx.body = {
        success: true,
        ret
      }
    } else {
      const ret = await events.remove({ mobile })
      .exec()
      .catch(err => ctx.throw(500, err))

      ctx.body = {
        ret,
        success: true
      }
    }
  }
}

exports = module.exports = eventsController