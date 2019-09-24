
const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { name: 'auth', path: '/', component: () => import('pages/auth/Home.vue') },
      { name: 'auth-manual', path: '/manual', component: () => import('pages/auth/Manual.vue') }
    ]
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [
      { path: '/tabs/:slug', name: 'dropZone', component: () => import('pages/home/DropZone.vue') }
    ]
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
