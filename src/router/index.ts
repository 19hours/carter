import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "carparks",
      component: () => import("../views/Carparks.vue"),
    },
    {
      path: "/rental",
      name: "rental",
      component: () => import("../views/Rental.vue"),
    },
    {
      path: "/directions",
      name: "directions",
      component: () => import("../views/Directions.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/Search.vue"),
    },
  ],
});

export default router;
