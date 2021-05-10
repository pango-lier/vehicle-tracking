export default [
  {
    path: '/driver',
    name: 'driver',
    component: () => import('@/views/driver/Index.vue'),
    meta: {
      pageTitle: 'Drivers List',
      breadcrumb: [
        {
          text: 'Drivers List',
          active: true,
        },
      ],
    },
  },
]
