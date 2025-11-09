import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayouts.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Products from "../views/modules/Products.vue";
import Warehouses from "../views/modules/Warehouses.vue";
import Inventory from "../views/modules/Inventory.vue";
import Orders from "../views/modules/Orders.vue";
import Shipments from "../views/modules/Shipments.vue";
import Users from "../views/modules/Users.vue";
import Roles from "../views/modules/Roles.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/app",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", name: "DashboardHome", component: Dashboard },
      {
        path: "products",
        name: "Products",
        component: Products,
        meta: { roles: [1, 2] },
      },
      {
        path: "warehouses",
        name: "warehouses",
        component: Warehouses,
        meta: { roles: [1, 2] },
      },
      {
        path: "inventory",
        name: "inventory",
        component: Inventory,
        meta: { roles: [1, 2] },
      },
      {
        path: "orders",
        name: "orders",
        component: Orders,
        meta: { roles: [1, 2] },
      },
      {
        path: "shipments",
        name: "shipments",
        component: Shipments,
        meta: { roles: [1, 2] },
      },
      {
        path: "users",
        name: "users",
        component: Users,
        meta: { roles: [1, 2] },
      },
      {
        path: "roles",
        name: "roles",
        component: Roles,
        meta: { roles: [1, 2] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// auth check
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) return next({ name: "Login" });

  const allowedRoles = to.meta.roles;
  if (allowedRoles && auth.user) {
    const roleId = auth.user.role_id;
    if (!allowedRoles.includes(roleId)) return next({ name: "DashboardHome" });
  }

  next();
});

export default router;
