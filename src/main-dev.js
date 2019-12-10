import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 导入nprogress包对应的js和css
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中展示进度条 nprogress.start()
axios.interceptors.request.use(config => {
  console.log(config)
  nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最好必须return config
  return config
})
// 在response拦截器中隐藏进度条 nprogress.done()
axios.interceptors.response.use(config => {
  nprogress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局注册TreeTable
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
