import Vue from 'vue'
import Router from 'vue-router'

// import login from '../components/login.vue'
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import home from '../components/home.vue'
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
// import welcome from '../components/welcome.vue'
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import users from '../components/user/users.vue'
const users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/users.vue')
// import rights from '../components/power/rights.vue'
const rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue')
// import roles from '../components/power/roles.vue'
const roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue')

// import cate from '../components/goods/cate.vue'
const cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/cate.vue')
// import params from '../components/goods/params.vue'
const params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/params.vue')

// import goodsList from '../components/goods/list.vue'
const goodsList = () => import(/* webpackChunkName: "goodsList_add" */ '../components/goods/list.vue')
// import add from '../components/goods/add.vue'
const add = () => import(/* webpackChunkName: "goodsList_add" */ '../components/goods/add.vue')

// import order from '../components/order/order.vue'
const order = () => import(/* webpackChunkName: "order_report" */ '../components/order/order.vue')
// import report from '../components/report/report.vue'
const report = () => import(/* webpackChunkName: "order_report" */ '../components/report/report.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/home',
      component: home,
      // 重定向到welcome欢迎界面
      redirect: '/welcome',
      children: [
        // 跳转到欢迎界面
        { path: '/welcome', component: welcome },
        // 跳转到用户界面users
        { path: '/users', component: users },
        // 跳转到rights
        { path: '/rights', component: rights },
        // 跳转到roles
        { path: '/roles', component: roles },
        // 商品分类 cate
        { path: '/categories', component: cate },
        // 商品参数分类 params
        { path: '/params', component: params },
        // 商品列表 list
        { path: '/goods', component: goodsList },
        // 添加商品 add
        { path: '/goods/add', component: add },
        { path: '/orders', component: order },
        { path: '/reports', component: report }
      ] }

  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to是路径
  // from是哪个路径条状过来
  // next表示放行是个函数
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
