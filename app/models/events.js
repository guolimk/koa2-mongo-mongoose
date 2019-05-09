'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let eventsSchema = new Schema({
  // e: String,
  // xt: String,
  // os_version: String,
  // os: String,
  // av: String,
  // trackId: Number,
  xmi: String,
  partner: String,
  origin: String,
  appVersion: String,
  identity: String,
  sourceId: Number,
  userFlag: Number,
  mobile: String,
  userId: String,
  productCode: String,
  element: Object,
  id: String,
  meta: {
    createAt: {
      type: Date,
      dafault: Date.now()
    },
    updateAt: {
      type: Date,
      dafault: Date.now()
    }
  }
})

eventsSchema.statics.findOneById = (id, cb) => this.find({ id: id }, cb)

// Defines a pre hook for the document.
eventsSchema.pre('save', function save(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})


/**
 * 定义模型events
 * 模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model
 * @type {[type]}
 */
// 参数events 数据库中的集合名称, 不存在会创建.
let events = mongoose.model('events', eventsSchema)

module.exports = events