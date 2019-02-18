import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue' // 后台首页
import Welcome from '../components/children/Welcome.vue' // 欢迎页面
import User from '../components/children/UsersList.vue' // 用户管理-用户列表
import Rights from '../components/children/Rights.vue' // 权限管理-权限列表
import Roles from '../components/children/Roles.vue' // 权限管理-角色列表

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: User
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }]
  }]
})

// 路径导航守卫：判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    let token = window.sessionStorage.getItem('token')
    if (!token) {
      return next('/login')
    }
  }
  next()
})

export default router
