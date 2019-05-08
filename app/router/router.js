'use strict'

const i18nRouter = require('./i18n')
const evnetsRouter = require('./events')
const response_formatter = require('../../middlewares/response_formatter')
let api = require('koa-better-router')({
  prefix: '/api'
})

api.extend(i18nRouter)
api.extend(evnetsRouter)
api.routes.forEach(item => {
  item.middlewares.push(response_formatter)
})

module.exports = api