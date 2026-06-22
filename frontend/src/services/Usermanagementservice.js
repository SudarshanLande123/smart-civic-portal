import api from "./api";

export const getAllUsers = async (search = "") => {
  const response = await api.get("/users", {
    params: search ? { search } : {},
  });
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

export const activateUser = async (id) => {
  const response = await api.put(`/users/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await api.put(`/users/${id}/deactivate`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};