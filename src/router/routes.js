
const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      /* Auth homepage */
      { name: 'auth', path: '/', component: () => import('pages/auth/Home.vue') },

      /* Auth manual mode */
      { name: 'auth-manual', path: '/manual', component: () => import('pages/auth/Manual.vue') },

      /* Auth qrcode mode */
      { name: 'auth-qrcode', path: '/qrcode', component: () => import('pages/auth/QRCode.vue') }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      /* Tab */
      { path: '/tabs/:slug', name: 'dropZone', component: () => import('pages/home/DropZone.vue') }
    ]
  }
]

/* Always leave this as last one */
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes
