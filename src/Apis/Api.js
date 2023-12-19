import { axiosBase, axiosInstance } from "./axios";

export const login = (data) => axiosInstance.post("/user/login", data);

export const signUp = (data) => axiosInstance.post("/auth/register", data);

export const getListItem = async () => {
  const response = await axiosBase.get("/item/getAll");
  return response;
};

export const getListCmt = async (id) => {
  const response = await axiosBase.get(`/book/${id}/comments`);
  return response;
};

export const getListBuy = async (userId) => {
  const response = await axiosInstance.get(
    `lending/getItemLending?idCus=${userId}`
  );
  return response;
};

export const postCmt = (data) =>
  axiosInstance.post(`/book/${data.book_id}/comment`, data);

export const getDetailBook = async (id) => {
  const response = await axiosInstance.get(`/item/getItem?idItem=${id}`);
  return response;
};

export const backBook = (data) =>
  axiosInstance.post("/lending/returnItem", data);

export const buyBook = (data) =>
  axiosInstance.post("/lending/lendingItem", data);

export const deleteBook = (data) =>
  axiosInstance.post(`/item/deleteItem`, data);

export const editBook = (data) => {
  axiosInstance.post("/item/editItem", data);
};

export const addBook = (data) => {
  console.log(data);
  axiosInstance.post("/item/createBook", data);
};
