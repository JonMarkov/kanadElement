#  kanad-service-container-admin-web

#### 介绍
看广告容器管理后台

#### 仓库地址
https://gitee.com/tiantiankankan/kanad-service-container-admin-web

#### 软件架构
```
├── build                      // 构建相关
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                         // 所有请求
|   |   ├── account.js                  // 账户相关接口
|   |   ├── apk.js                      // APK模块相关接口
|   |   ├── channel.js                  // 集成方（渠道）模块相关接口
|   |   ├── container.js                // 容器配置相关接口
|   |   ├── data.js                     // 数据模块相关接口
|   |   ├── deliver.js                  // 投放模块相关接口
|   |   ├── login.js                    // 登录相关接口
|   |   ├── manufacturer.js             // 内容方（厂商）模块相关接口
|   |   └── upload.js                   // 图片上传相关接口
│   ├── assets                      // 主题 字体等静态资源
│   ├── components                  // 全局公用组件
|   |   └── Tinymce                     // 富文本编辑器组件
│   ├── directive                   // 全局指令
│   ├── filters                     // 全局 filter
│   ├── icons                       // 项目所有 svg icons
│   ├── mock                        // 项目mock 模拟数据
|   |   ├── account.js                  // 账户相关接口模拟数据
|   |   ├── channel.js                  // 集成方（渠道）模块相关接口模拟数据
|   |   ├── container.js                // 容器配置相关接口模拟数据
|   |   ├── deliver.js                  // 投放模块相关接口模拟数据
|   |   ├── index.js
|   |   ├── login.js                    // 登录验证相关接口模拟数据
|   |   ├── manufacturer.js             // 内容方（厂商）模块相关接口模拟数据
|   |   └── upload.js                   // 图片上传相关接口模拟数据
│   ├── router                      // 路由
│   ├── store                       // 全局 store管理
│   ├── styles                      // 全局样式
│   ├── utils                       // 全局公用方法
│   ├── vendor                      // 公用vendor
│   ├── views                       // views 所有页面
|   |   ├── apk                         // apk管理模块
|   |   ├── channel                     // 集成方（渠道）管理模块
|   |   ├── dashboard                   // 首页模块
|   |   ├── data                        // 数据模块
|   |   ├── deliver                     // 投放管理模块
|   |   ├── layout                      // 页面结构模块
|   |   ├── login                       // 登录模块
|   |   ├── manufacturer                // 内容方（厂商）管理模块
|   |   └── settings                    // 设置模块
|   |       └── container                    // 容器配置模块
│   ├── App.vue                     // 入口页面
│   ├── main.js                     // 入口文件 加载组件 初始化等
│   └── permission.js               // 权限管理
├── static                          // 第三方不打包资源
│   └── Tinymce                         // 富文本插件
├── .babelrc                   // babel-loader 配置
├── .eslintrc.js               // eslint 配置项
├── .gitignore                 // git 忽略项
├── .travis.yml                // 自动化CI配置
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json
```

#### 使用说明
运行npm run dev，本地开发服务默认打开http://admin-test.ikancloud.com 链接，需注意先配置好hosts `192.168.xxx.xxx admin-test.ikancloud.com`，192.168.xxx.xxx为你自己电脑的本地IP，否则服务将启动不了。或者可以修改/config/index.js文件中dev配置下的host为`0.0.0.0`，即可通过`http://localhost`进行访问。

```
npm install          安装依赖
npm run dev          本地启动开发服务
npm run build:mock   mock模式打包
npm run build:test   测试环境打包
npm run build        生成环境打包
```


