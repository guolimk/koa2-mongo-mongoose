var log4js = require('log4js')
var log_config = require('../config/log')

// 加载配置文件
log4js.configure(log_config)

var logUtil = {}

var errorLogger = log4js.getLogger('errorLogger')
var resLogger = log4js.getLogger('resLogger')

// 格式化请求日志
var formatReqLog = function (req, resTime) {

  var logText = new String()

  var method = req.method

  // 访问方法
  // logText += 'request method: ' + method + '\n'

  // 请求原始地址
  // logText += `request ${method}:  ` + req.originalUrl + '\n'

  // 客户端ip
  // logText += 'request client ip:  ' + req.ip + '\n'

  // 开始时间
  // logText += 'start time:  ' + req.query.requestStartTime + '\n'

  // 请求参数
  if (method === 'GET') {
    logText += ' request query:  ' + JSON.stringify(req.query) + '\n'
  } else {
    logText += ' request body: \n' + JSON.stringify(req.body) + '\n'
  }

  // 服务器响应时间
  // logText += 'response time: ' + resTime + '\n'

  return logText
}

// 格式化错误日志
var formatError = function (ctx, err, resTime) {
  var logText = new String()

  // 错误信息开始
  logText += '\n *************** error log start *************** \n'

  // 添加请求日志
  logText += formatReqLog(ctx.request, resTime)

  // 错误名称
  logText += 'err name: ' + err.name + '\n'

  // 错误信息
  logText += 'err message: ' + err.message + '\n'

  // 错误详情
  logText += 'err stack: ' + err.stack + '\n'

  // 错误信息结束
  logText += '*************** error log end *************** \n'

  return logText
}

// 封装错误日志
logUtil.logError = (ctx, error, resTime) => {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, error, resTime))
  }
}

// 格式化响应日志
var formatRes = function (ctx, resTime) {
  var logText = new String()

  // 响应日志开始
  // logText += '\n *************** response log start *************** \n'

  // 添加请求日志
  logText += formatReqLog(ctx.request, resTime)

  // 响应状态码
  // logText += 'response status: ' + ctx.status + '\n'

  // 响应内容
  logText += 'response:' + JSON.stringify(ctx.body) + '\n'

  // 响应日志结束
  // logText += '*************** response log end *************** \n'

  return logText

}

// 封装响应日志
logUtil.logResponse = (ctx, resTime) => {
  if (ctx) {
    resLogger.info(formatRes(ctx, resTime))
  }
}


// 格式化响应日志
var formatEvent = function (event, eTime) {
  var logText = new String()
  // 响应日志开始
  // logText += '\n *************** event log start *************** \n'
  logText += 'event:' + JSON.stringify(event) + ''
  // 响应日志结束
  // logText += '*************** event log end *************** \n'
  // logText += 'event time: ' + eTime + '\n'
  return logText
}

// 封装事件日志
logUtil.logEvent = (event, eTime) => {
  if (event) {
    resLogger.info(formatEvent(event, eTime))
  }
}

// 格式化响应日志
var formatEvents = function (events, eTime) {
  var logText = new String()
  // 响应日志开始
  // logText += '\n *************** event log start *************** \n'
  logText += 'event:' + JSON.stringify(events) + ''
  // 响应日志结束
  // logText += '*************** event log end *************** \n'
    // 服务器响应时间
  // logText += 'events time: ' + eTime + '\n'
  return logText
}

// 封装事件队列日志
logUtil.logEvents = (event, eTime) => {
  if (event) {
    resLogger.info(formatEvents(event, eTime))
  }
}

module.exports = logUtil