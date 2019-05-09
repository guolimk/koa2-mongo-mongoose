'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let checkSchema = new Schema({
  start: Number,
  end: Number,
  mobile: String,
  count: Number,
  total: Number,
  ok: Boolean,
  id: String,
  meta: {
    createAt: {
      type: Date,
      dafault: Date.now()
    }
  }
})

checkSchema.statics.findOneById = (id, cb) => this.find({ id: id }, cb)

// Defines a pre hook for the document.
checkSchema.pre('save', function save(next) {
  if (this.isNew) {
    this.meta.createAt = Date.now()
  }
  next()
})


/**
 * 定义模型check
 * 模型用来实现我们定义的模式，调用mongoose.model来编译Schema得到Model
 * @type {[type]}
 */
// 参数check 数据库中的集合名称, 不存在会创建.
let check = mongoose.model('check', checkSchema)

module.exports = check