# shop-cms

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run line

# build for production with minification
npm run pack
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目开发步骤

- 项目初始化：
  - 完成 vue-cli 初始化 + 后台登陆功能 + favicon 配置
  - 路由守卫+退出登陆、后台页面搭建(导航列表、子组件)
  - `请求数据需要使用（axios拦截器）带着token信息`
- 用户管理：
  - 用户列表页面结构、用户信息读取
  - 添加用户(自定义表单验证)、删除用户、修改用户
  - 完成分配角色功能
- 权限管理：
  - 权限列表：页码结构、角色列表渲染
  - 角色列表：页码结构、数据获取、添加角色+编辑+删除
  - 角色列表：分配角色权限功能、删除角色权限功能
- 商品管理：
  - 商品分类：页码结构、列表渲染 + 分页功能 + 编辑 + 删除
  - 商品分类：添加分类功能
  - 分类参数：页面结构、多级 select 列表、选项卡切换功能
