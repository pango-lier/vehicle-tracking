export default [
  {
    path: '/fonts',
    name: 'fonts',
    component: () => import('@/views/fonts/Index.vue'),
    meta: {
      pageTitle: 'Fonts List',
      breadcrumb: [
        {
          text: 'Fonts List',
          active: true,
        },
      ],
    },
  },
]
