import { defineStore } from "pinia";
import api from "../services/api";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const res = await api.get("/records/products?order=id,desc");
        this.products = res.data.records;
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        this.loading = false;
      }
    },
    async addProduct(data) {
      await api.post("/records/products", data);
      await this.fetchProducts();
    },
    async updateProduct(id, data) {
      await api.put(`/records/products/${id}`, data);
      await this.fetchProducts();
    },
    async deleteProduct(id) {
      await api.delete(`/records/products/${id}`);
      this.products = this.products.filter((p) => p.id !== id);
    },
  },
});
