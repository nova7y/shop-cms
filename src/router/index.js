import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue' // 后台首页
import Welcome from '../components/children/Welcome.vue' // 欢迎页面
import User from '../components/children/UsersList.vue' // 用户列表

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
