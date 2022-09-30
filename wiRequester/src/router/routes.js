
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', name: 'Services', component: () => import('pages/Index.vue') },
      { path: '/view_WiSkillers', name: 'Available wiSkillers', component: () => import('pages/viewWiSkiller') },
      { path: '/booking', name: 'On-Schedule', component: () => import('pages/booking.vue') },
      { path: '/history', name: 'History', component: () => import('pages/history.vue') },
      { path: '/settings', name: 'Settings', component: () => import('pages/settings.vue') },
      { path: '/profile', name: 'Profile', component: () => import('pages/profile.vue') },
      { path: '/status', name: 'Status', component: () => import('pages/status.vue') },
      { path: '/transaction', name: 'Transaction', component: () => import('pages/transaction.vue') },
      { path: '/onschedule/:id', name: 'Profile On-Schedule', component: () => import('pages/onSchedule.vue') },
      { path: '/viewOnschedule', name: 'Book On-Schedule', component: () => import('pages/viewOnschedule.vue') }
    ]
  },
  {
    path: '/chat/:id',
    component: () => import('pages/chat.vue')
  },
  {
    path: '/login',
    component: () => import('pages/login.vue')
  },
  {
    path: '/verify_account',
    component: () => import('pages/verifyAccount.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
