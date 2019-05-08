'use strict'

const events = require('../controllers/events')
const koaBodyparser = require('koa-bodyparser')
let router = require('koa-better-router')().loadMethods()

router.get('/events', events.getList)
router.get('/events/count', events.getCount)
router.post('/events/report', koaBodyparser(), events.report)
router.post('/events/delete', koaBodyparser(), events.delete)

module.exports = router