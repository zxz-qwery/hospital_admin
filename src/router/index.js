import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutPage.vue'),
      redirect: '/data',
      children: [
        {
          path: '/users',
          component: () => import('@/views/users/UsersPage.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: '/appointments',
          component: () => import('@/views/appointments/AppointmentsPage.vue'),
          meta: { title: '预约管理' }
        },
        {
          path: '/departments',
          component: () => import('@/views/departments/DepartmentsPage.vue'),
          meta: { title: '科室管理' }
        },
        {
          path: '/doctors',
          component: () => import('@/views/doctors/DoctorsPage.vue'),
          meta: { title: '医生管理' }
        },
        {
          path: '/schedules',
          component: () => import('@/views/schedules/SchedulesPage.vue'),
          meta: { title: '排班模块' }
        },
        {
          path: '/data',
          component: () => import('@/views/data/dataPage.vue'),
          meta: { title: '数据分析' }
        },
        {
          path: '/announcement',
          component: () => import('@/views/announcement/AnnouncementPage.vue'),
          meta: { title: '公告模块' }
        }, {
          path: '/medicalRecord',
          component: () => import('@/views/medicalRecord/MedicalRecordPage.vue'),
          meta: { title: '就诊记录' }
        }
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  // 白名单（不用登录）
  const whiteList = ['/login']

  // ✅ 已登录
  if (token) {
    // 访问登录页 → 回首页
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  }

  // ❌ 未登录
  else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
