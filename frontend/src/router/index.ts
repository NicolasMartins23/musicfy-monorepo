import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
    { path: '/artists', name: 'artists', component: () => import('@/views/ArtistsView.vue') },
    { path: '/artists/:id/songs', name: 'artists-songs', component: () => import('@/views/ArtistSongsView.vue') },
    { path: '/albums', name: 'albums', component: () => import('@/views/AlbumsView.vue') },
    { path: '/albums/:id/songs', name: 'album-songs', component: () => import('@/views/AlbumSongsView.vue'), props: true },
    { path: '/songs', name: 'songs', component: () => import('@/views/SongsView.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    },
    
  ]
})

export default router
