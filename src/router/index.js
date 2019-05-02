import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home/Home'
import Welcome from '@/components/Home/Welcome'
import Users from '@/components/Users/Users'
import Roles from '@/components/Right/Roles'
import Rights from '@/components/Right/Rights'
import Goods from '@/components/Goods/Goods'
import Categories from '@/components/Goods/Categories'
import Params from '@/components/Goods/Params'
import GoodsAdd from '@/components/Goods/Goods-Add'
import Reports from '@/components/Reports/Reports'
import Orders from '@/components/Orders/Orders'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', name: 'welcome', component: Welcome},
        {path: '/users', name: 'users', component: Users},
        {path: '/roles', name: 'roles', component: Roles},
        {path: '/rights', name: 'rights', component: Rights},
        {path: '/goods', name: 'goods', component: Goods},
        {path: '/categories', name: 'categories', component: Categories},
        {path: '/params', name: 'params', component: Params},
        {path: '/goods/add', name: 'goodsadd', component: GoodsAdd},
        {path: '/reports', name: 'reports', component: Reports},
        {path: '/orders', name: 'orders', component: Orders}
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!sessionStorage.getItem('token')) return next('/login')
  next()
})

export default router
