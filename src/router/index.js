import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import params from '../components/goods/params.vue'
import goodsList from '../components/goods/list.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'

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
        { path: '/orders', component: order }
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
