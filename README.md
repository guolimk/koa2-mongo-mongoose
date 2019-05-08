#koa2-mongo-mongoose
一套基于koa2+mongo+mongoose的简单的nodejs server，实现数据库增删改查逻辑

## server

nodejs的话采用koa框架(koa 2)，数据库用了mongo。

**因为使用了许多es6/7 新语法,所以请使用7.x版本node**

### 使用说明

```
config/development or config/product 配置数据库地址

npm install

dev node/bin/dev.js

product node/bin/product.js

```

### 目录结构

```
├─ app
│  ├─ controllers  // server执行函数
│  │  └─ i18n.js
│  ├─ models
│  │  └─ i18n.js   // 定义mongo模型
│  └─ router
│     ├─ i18n.js   
│     └─ router.js  // 路由koa-better-router
├─ bin
│  ├─ dev.js
│  ├─ product.js
│  └─ www.js
├─ config
│  ├─ development.js // 开发环境数据库地址及端口配置
│  ├─ index.js
│  ├─ log.js    // 日志配置
│  └─ product.js    // 生产环境数据库地址及端口配置
├─ middlewares
│  ├─ ApiError.js   
│  ├─ ApiErrorName.js
│  ├─ response_formatter.js // 格式化输出中间件
│  └─ throw_error.js    // 统一抛错中间件
├─ utils
│  └─ log_util.js // log输出格式
├─ .babelrc
├─ .eslintrc    // eslint规范
├─ .gitignore
├─ README.md
├─ app.js
├─ package-lock.json
└─ package.json

```


```
# 示例接口
/api/i18n/dict 获取词条列表
/api/i18n/create 创建
/api/i18n/update 修改
/api/i18n/delete 删除
/api/i18n/import 批量添加

```


```
curl -H "Content-Type: application/json" -X POST -d '{ "user": { "username": "johndoe", "password": "secretpasas" } }' http://localhost:9009/api/i18n/create



en, cn, projectName
Post:
curl -H "Content-Type: application/json" -X POST -d '{ "projectName": "limk",  "en": "guolimk", "cn": "Limkguo98" }' http://localhost:9090/api/i18n/create

Get:
curl http://localhost:9090/api/i18n/dict


Post Events:

curl -H "Content-Type: application/json" -X POST -d '{ "d": "ewogICJ4bWkiIDogIjNmMWQ4M2NkLjE1NTQ3NzU2N3Q1OTIuMGI2Mjc0ZTc3NDMwZDMiLAogICJsaXN0IiA6IFsKICAgIHsKICAgICAgInh0IiA6IDE1NTY1MjU0Nzg0MTIsCiAgICAgICJwIiA6IHsKICAgICAgICAibGliX2RldGFpbCIgOiAiRGVtb0NvbnRyb2xsZXIjIyMjIyMiLAogICAgICAgICJudCIgOiAiV0lGSSIsCiAgICAgICAgImlmZCIgOiB0cnVlCiAgICAgIH0sCiAgICAgICJfdHJhY2tfaWQiIDogMTY1NjU3NjEzMywKICAgICAgInQiIDogInRyYWNrIiwKICAgICAgIl9mbHVzaF90aW1lIiA6IDE1NTY1MjU2ODMxMzEsCiAgICAgICJlIiA6ICJwYWdlVmlldyIsCiAgICAgICJkaXN0aW5jdF9pZCIgOiAibmV3SWQiLAogICAgICAiY3AiIDogewogICAgICAgICJhdiIgOiAiMS4zIiwKICAgICAgICAiZWMiIDogIua1i+ivlVRvbSIsCiAgICAgICAgInRpdGxlIiA6ICJRaW5nbHVhbkFuYWx5dGljcyBpT1MgRGVtbyIsCiAgICAgICAgImVsZW1lbnRfc2VsZWN0b3IiIDogIlVJTmF2aWdhdGlvbkNvbnRyb2xsZXJcL1VJVGFiQmFyQ29udHJvbGxlclwvRGVtb0NvbnRyb2xsZXJcL1VJVGFibGVWaWV3XC9VSVRhYmxlVmlld0NlbGxbMF0iLAogICAgICAgICJtZiIgOiAiQXBwbGUiLAogICAgICAgICJBQUEiIDogIjRDMzk0NzZGLUVDQjQtNEQ5Ny05NkUxLTY1NUUwQzdFQjUwMSIsCiAgICAgICAgInNuIiA6ICJEZW1vQ29udHJvbGxlciIsCiAgICAgICAgImRldmljZV9pZCIgOiAiNEMzOTQ3NkYtRUNCNC00RDk3LTk2RTEtNjU1RTBDN0VCNTAxIiwKICAgICAgICAic3ciIDogNDE0LAogICAgICAgICJlbGVtZW50X3R5cGUiIDogIlVJVGFibGVWaWV3IiwKICAgICAgICAiaXMiIDogdHJ1ZSwKICAgICAgICAib3MiIDogImlPUyIsCiAgICAgICAgInNoIiA6IDg5NiwKICAgICAgICAiZWxlbWVudF9wb3NpdGlvbiIgOiAiMDowIiwKICAgICAgICAibCIgOiAiaU9TIiwKICAgICAgICAib3NfdmVyc2lvbiIgOiAiMTIuMSIsCiAgICAgICAgImx2IiA6ICIxLjEwLjI2IiwKICAgICAgICAiX19BUFBTdGF0ZV9fIiA6IDAsCiAgICAgICAgIm1kIiA6ICJ4ODZfNjQiLAogICAgICAgICJ3aSIgOiAibnVsbCIKICAgICAgfSwKICAgICAgImxpYiIgOiB7CiAgICAgICAgImxpYl9tZXRob2QiIDogImF1dG9UcmFjayIsCiAgICAgICAgImwiIDogImlPUyIsCiAgICAgICAgImF2IiA6ICIxLjMiLAogICAgICAgICJsdiIgOiAiMS4xMC4yNiIsCiAgICAgICAgImxpYl9kZXRhaWwiIDogIkRlbW9Db250cm9sbGVyIyMjIyMjIgogICAgICB9CiAgICB9CiAgXQp9",  "reporter": "limk"}' http://localhost:9090/api/events/reportg 

```
