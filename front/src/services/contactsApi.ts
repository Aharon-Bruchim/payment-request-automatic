import axios from "axios";
import { PaymentFormData } from "../types/formData";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
});

export const contactsApi = {
  async create(formData: PaymentFormData) {
    const response = await api.post("/", formData);
    return response.data;
  },
};
