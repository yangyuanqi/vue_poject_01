import Vue from 'vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Admin from '../components/auth/Admin'
import AdminLog from '../components/auth/AdminLog'
import Group from '../components/auth/Group'
import Rule from '../components/auth/Rule'
import Config from '../components/general/Config'
import Attachment from '../components/general/Attachment'
import Database from '../components/general/Database'
import Profile from '../components/general/Profile'
import BookIndex from '../components/books/BookIndex'
import Category from '../components/books/Category'
import Preg from '../components/books/Preg'
import UserGroup from '../components/user/UserGroup'
import UserRule from '../components/user/UserRule'
import AdvertGroup from '../components/advert/AdvertGroup'
import AdvertList from '../components/advert/AdvertList'
import CmsCategory from '../components/cms/Category'
import Article from '../components/cms/Article'
import Block from '../components/cms/Block'
import Tags from '../components/cms/Tags'

// 解决elementUI导航菜单点击报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login
  },
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
      { path: '/cms/tags', component: Tags }
    ]
  }
]

const router = new VueRouter({
  
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
