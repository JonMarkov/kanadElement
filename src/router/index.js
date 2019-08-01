import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home', noCache: true }
    }]
  },

  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/deliver',
    meta: { title: '管理', icon: 'component', noCache: true },
    // hidden: true,
    children: [
      {
        path: 'deliver',
        component: () => import('@/views/deliver/list'),
        name: 'deliverList',
        meta: { title: '投放管理', icon: 'guide' }
      },
      {
        path: 'deliver/add',
        component: () => import('@/views/deliver/add'),
        name: 'addDeliver',
        meta: { title: '新增投放任务', icon: 'add' },
        hidden: true
      },
      {
        path: 'deliver/edit/:id(\\d+)',
        component: () => import('@/views/deliver/edit'),
        name: 'editDeliver',
        meta: { title: '编辑投放任务', noCache: true },
        hidden: true
      },
      {
        path: 'deliver/view/:id(\\d+)',
        component: () => import('@/views/deliver/view'),
        name: 'viewDeliver',
        meta: { title: '查看投放任务', noCache: true },
        hidden: true
      },
      {
        path: 'channel',
        component: () => import('@/views/channel/list'),
        name: 'channelList',
        meta: { title: '集成方管理', icon: 'channel' }
      },
      {
        path: 'channel/add',
        component: () => import('@/views/channel/add'),
        name: 'addChannel',
        meta: { title: '新增集成方', icon: 'add', noCache: true },
        hidden: true
      },
      {
        path: 'channel/edit/:id(\\d+)',
        component: () => import('@/views/channel/edit'),
        name: 'editChannel',
        meta: { title: '编辑集成方', noCache: true },
        hidden: true
      },
      {
        path: 'apk',
        component: () => import('@/views/apk/list'),
        name: 'apkList',
        meta: { title: 'APK管理', icon: 'apk' }
      },
      {
        path: 'apk/add',
        component: () => import('@/views/apk/add'),
        name: 'addApk',
        meta: { title: '新增APK', icon: 'add', noCache: true },
        hidden: true
      },
      {
        path: 'apk/edit/:id(\\d+)',
        component: () => import('@/views/apk/edit'),
        name: 'editApk',
        meta: { title: '编辑APK', noCache: true },
        hidden: true
      },
      {
        path: 'manufacturer',
        component: () => import('@/views/manufacturer/list'),
        name: 'manufacturerList',
        meta: { title: '内容方管理', icon: 'manufacturer' }
      },
      {
        path: 'manufacturer/add',
        component: () => import('@/views/manufacturer/add'),
        name: 'addManufacturer',
        meta: { title: '新增内容方', icon: 'add', noCache: true },
        hidden: true
      },
      {
        path: 'manufacturer/edit/:id(\\d+)',
        component: () => import('@/views/manufacturer/edit'),
        name: 'editManufacturer',
        meta: { title: '编辑内容方', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/data',
    component: Layout,
    redirect: '/data/deliver',
    meta: { title: '数据', icon: 'data', noCache: true },
    children: [
      {
        path: 'deliver',
        component: () => import('@/views/data/deliver'),
        name: 'deliverData',
        meta: { title: '投放数据', icon: 'guide', noCache: true }
      },
      {
        path: 'user',
        component: () => import('@/views/data/user'),
        name: 'userData',
        meta: { title: '用户数据', icon: 'user', noCache: true }
      }
    ]
  },

  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/account',
    meta: { title: '设置', icon: 'setting', noCache: true },
    children: [
      {
        path: 'account',
        component: () => import('@/views/settings/account'),
        name: 'accountSetting',
        meta: { title: '账户设置', icon: 'account' }
      },
      {
        path: 'account/add',
        component: () => import('@/views/settings/addAccount'),
        name: 'addAccount',
        meta: { title: '新增账户', icon: 'add', noCache: true },
        hidden: true
      },
      {
        path: 'account/edit/:id(\\d+)',
        component: () => import('@/views/settings/editAccount'),
        name: 'editAccount',
        meta: { title: '编辑账户', noCache: true },
        hidden: true
      },
      {
        path: 'container',
        component: () => import('@/views/settings/container/list'),
        name: 'containerConfigList',
        meta: { title: '容器配置', icon: 'setting2' }
      },
      {
        path: 'container/add',
        component: () => import('@/views/settings/container/add'),
        name: 'addContainerConfig',
        meta: { title: '新增容器配置', icon: 'add', noCache: true },
        hidden: true
      },
      {
        path: 'container/edit/:id(\\d+)',
        component: () => import('@/views/settings/container/edit'),
        name: 'editContainerConfig',
        meta: { title: '编辑容器配置', noCache: true },
        hidden: true
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
