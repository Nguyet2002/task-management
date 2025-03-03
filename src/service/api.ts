import { List } from "@/types/task";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Đảm bảo đây là URL từ MockAPI.io của bạn
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => Promise.reject(error)
);

export const getLists = async (): Promise<List[]> => {
  return api.get("/task-management");
};

export const createList = async (title: string): Promise<List> => {
  return api.post("/task-management", { title });
};

export { };

