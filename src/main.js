import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// 全局样式表
import './assets/css/global.css'
// 图标字体
import './assets/fonts/iconfont.css'
// element-ui库
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// axios配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.axios = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
