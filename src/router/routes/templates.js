export default [
  {
    path: '/templates',
    name: 'templates',
    component: () => import('@/views/templates/Index.vue'),
    meta: {
      pageTitle: 'Templates List',
      breadcrumb: [
        {
          text: 'Templates List',
          active: true,
        },
      ],
    },
  },
]
