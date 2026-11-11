import { createRouter, createWebHistory } from 'vue-router'

function getSavedUser() {
  const savedUser = localStorage.getItem('taste-user')
  if (!savedUser) return null
  try {
    const user = JSON.parse(savedUser) as { id?: string; role?: string }
    const databaseRole = user.id === 'fmr-001' ? 'farmer' : user.id === 'usr-002' ? 'customer' : undefined
    if (databaseRole && user.role !== databaseRole) {
      user.role = databaseRole
      localStorage.setItem('taste-user', JSON.stringify(user))
    }
    return user
  } catch {
    return null
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
    { path: '/signup', name: 'signup', component: () => import('../views/auth/SignUpView.vue') },
    { path: '/forgot-password', name: 'forgot-password', component: () => import('../views/auth/ForgotPasswordView.vue') },
    { path: '/crops', name: 'crops', component: () => import('../views/CropsView.vue') },
    { path: '/browse', name: 'customer-browse', component: () => import('../views/CustomerBrowseView.vue') },
    { path: '/farmer-portal', name: 'farmer-portal', component: () => import('../views/FarmerPortalView.vue'), meta: { farmerOnly: true } },
    { path: '/account', name: 'customer-account', component: () => import('../views/CustomerAccountView.vue'), meta: { customerOnly: true } },
    { path: '/messages', name: 'customer-messages', component: () => import('../views/CustomerChatView.vue'), meta: { customerOnly: true } },
    { path: '/history', name: 'customer-history', component: () => import('../views/CustomerHistoryView.vue'), meta: { customerOnly: true } },
    { path: '/saved', name: 'customer-saved', component: () => import('../views/CustomerSavedView.vue'), meta: { customerOnly: true } },
    { path: '/farmer-verification', name: 'farmer-verification', component: () => import('../views/FarmerVerificationView.vue'), meta: { customerOnly: true } },
    { path: '/admin', name: 'admin-dashboard', component: () => import('../views/AdminDashboardView.vue'), meta: { adminOnly: true } },
    { path: '/crops/:id', name: 'crop-detail', component: () => import('../views/CropDetailView.vue'), props: true },
    { path: '/submit', name: 'submit', component: () => import('../views/SubmitView.vue'), meta: { farmerOnly: true } },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.farmerOnly) {
    const user = getSavedUser()
    return user ? user.role === 'farmer' ? true : '/' : '/login'
  }
  if (to.meta.adminOnly) {
    const user = getSavedUser()
    return user ? user.role === 'admin' ? true : '/' : '/login'
  }
  if (!to.meta.customerOnly) return true
  const user = getSavedUser()
  return user ? user.role === 'customer' || user.role === 'farmer' ? true : user.role ? '/' : '/login' : '/login'
})

export default router
