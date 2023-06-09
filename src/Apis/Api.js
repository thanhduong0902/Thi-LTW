import { axiosBase, axiosInstance } from "./axios";

export const login = (data) => axiosInstance.post("/auth/login", data);

export const signUp = (data) => axiosInstance.post("/auth/register", data);

export const getListBook = async () => {
  const response = await axiosBase.get("/book");
  return response;
};

export const getListCmt = async (id) => {
  const response = await axiosBase.get(`/book/${id}/comments`);
  return response;
};

export const getListBuy = async (userId) => {
  const response = await axiosInstance.get(`book/buy/${userId}`);
  return response;
};

export const postCmt = (data) =>
  axiosInstance.post(`/book/${data.book_id}/comment`, data);

export const getDetailBook = async (id) => {
  const response = await axiosInstance.get(`/book/detail/${id}`);
  return response;
};

export const backBook = (data) => axiosInstance.post("/book/back", data);

export const buyBook = (data) => axiosInstance.post("/book/sold", data);

export const deleteBook = (id) => axiosInstance.delete(`/book/${id}`);

export const editBook = (data) => axiosInstance.put("/book/update", data);

export const addBook = (data) => axiosInstance.post("/book/add", data);
