import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/user/User.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Cate from '../views/goods/Cate.vue'
import Admin from '../views/auth/Admin'
import AdminLog from '../views/auth/AdminLog'
import Group from '../views/auth/Group'
import Rule from '../views/auth/Rule'
import Config from '../views/general/Config'
import Attachment from '../views/general/Attachment'
import Database from '../views/general/Database'
import Profile from '../views/general/Profile'
import BookIndex from '../views/books/BookIndex'
import Category from '../views/books/Category'
import Preg from '../views/books/Preg'
import UserGroup from '../views/user/UserGroup'
import UserRule from '../views/user/UserRule'
import AdvertGroup from '../views/advert/AdvertGroup'
import AdvertList from '../views/advert/AdvertList'
import CmsCategory from '../views/cms/Category'
import Article from '../views/cms/Article'
import Block from '../views/cms/Block'
import Tags from '../views/cms/Tags'
import Demo from '../views/Demo'

// 解决elementUI导航菜单点击报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  { path: '/demo', component: Demo },
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/user/user', component: Users },
      { path: '/user/group', component: UserGroup },
      { path: '/user/rule', component: UserRule },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/auth/admin', component: Admin },
      { path: '/auth/adminlog', component: AdminLog },
      { path: '/auth/group', component: Group },
      { path: '/auth/rule', component: Rule },
      { path: '/general/config', component: Config },
      { path: '/general/attachment', component: Attachment },
      { path: '/general/database', component: Database },
      { path: '/general/profile', component: Profile },
      { path: '/book/list', component: BookIndex },
      { path: '/book/preg', component: Preg },
      { path: '/book/category', component: Category },
      { path: '/advert/list', component: AdvertList },
      { path: '/advert/group', component: AdvertGroup },
      { path: '/cms/category', component: CmsCategory },
      { path: '/cms/article', component: Article },
      { path: '/cms/block', component: Block },
      { path: '/cms/tags', component: Tags },
      {path:'/wechat/menu',component:Menu}
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  // 响应拦截器
  axios.interceptors.response.use(
    function (res) {
      // 对响应数据做点什么
      return res
    },
    function () {
      // 对响应错误做点什么
      // return Promise.reject(error)
      return next('/login')
    }
  )
  next()
})

export default router
