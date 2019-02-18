# shop-cms

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目开发步骤

- 完成 vue-cli 初始化 + 后台登陆功能
- 路由守卫+退出登陆、后台页面搭建(导航列表、子组件)
  - `请求数据需要使用（axios拦截器）带着token信息`
- 用户管理：列表页面结构、用户信息读取
- 用户管理：添加用户(自定义表单验证)、删除用户、修改用户
- 权限管理：完成权限列表 + 角色列表 渲染
- 权限管理：角色列表功能(xxxxxxxxxxxxxxxxx)

### 遗留未做：

- 用户管理：分配角色功能
