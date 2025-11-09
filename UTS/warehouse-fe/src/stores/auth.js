import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("w_token") || null,
    user: JSON.parse(localStorage.getItem("w_user") || "null"),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    role: (state) => (state.user ? state.user.role_name : null),
  },
  actions: {
    async login(username, password) {
      // NOTE: php-crud-api by default doesn't provide auth endpoints.
      // For demo, we query users with filters (INSECURE - demo only).
      try {
        const res = await api.get("/records/users", {
          params: {
            filter: [`username,eq,${username}`, `password,eq,${password}`],
          },
        });
        const rows = res.data ? res.data.records || res.data : res.data;
        if (rows && rows.length > 0) {
          const u = rows[0];
          // create a fake token for demo
          const token = btoa(`${u.id}:${Date.now()}`);
          this.token = token;
          this.user = u;
          localStorage.setItem("w_token", token);
          localStorage.setItem("w_user", JSON.stringify(u));
          return { ok: true };
        }
        return { ok: false, message: "Invalid credentials" };
      } catch (err) {
        console.error(err);
        return { ok: false, message: "Login failed" };
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("w_token");
      localStorage.removeItem("w_user");
    },
  },
});
