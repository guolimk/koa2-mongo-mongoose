'use strict'

const base64 = require('hi-base64')
const uuid = require('uuid')
const mongoose = require('mongoose')
const events = mongoose.model('events')
const ApiError = require('../../middlewares/ApiError')
const ApiErrorNames = require('../../middlewares/ApiErrorName')
const logUtil = require('../../utils/log_util')

class eventsController {
  // 查询
  static async getList(ctx, next) {
    const query = ctx.query
    const page = Number(query.page || 1)
    const pageSize = Number(query.pageSize || 10)
    const { id, mobile } = query
    let total, res

    if (id) {
      res = await events.findOne({ id }, { _id: 0 })
        .catch(err => ctx.throw(500, err))

      ctx.body = res
    } else if(mobile) {
      res = await events.find({mobile}, { _id: 0 })
        .sort('-meta.updateAt')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec()
        .catch(err => ctx.throw(500, err))

      ctx.body = {
        total: res.length,
        list: res
      }
    } else {
      res = await events.find({}, { _id: 0 })
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
    const origin = dObj["x-origin"]
    const appVersion = dObj["x-app-version"]
    const identity = dObj["x-user-identity"]
    const sourceId = dObj["x-source-id"]
    const userFlag = dObj["x-user-flag"]
    const mobile = dObj["x-user-mobile"]
    const userId = dObj["x-user-id"]
    const productCode = dObj["x-product-code"]

    // console.log(`Request xmi:${xmi}, partner:${partner}, origin:${origin}, appVersion:${appVersion}, identity:${identity}, sourceId:${sourceId}, userFlag:${userFlag}, mobile:${mobile},`)
    if (!list || !xmi || !partner || !origin || !appVersion || !identity || !sourceId || !userFlag || !mobile || !userId || !productCode) {
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
        id, e, xt, os_version, os, av, trackId, xmi, partner, origin, appVersion, identity, sourceId, userFlag, mobile, userId, productCode,
        jsfy: JSON.stringify(element)
      })
      item = await item.save()
      eventArray.push({xmi, trackId, e, xt, os_version, os, av, partner, origin, appVersion, identity, sourceId, userFlag, mobile});
      logUtil.logEvent({e, xt, os, av, sourceId, appVersion, origin, mobile});
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
}

exports = module.exports = eventsController