import api from "./api";

export const getComments = async (
  complaintId
) => {
  const response =
    await api.get(
      `/comments/complaint/${complaintId}`
    );

  return response.data;
};

export const addComment = async (
  complaintId,
  text
) => {
  const response =
    await api.post(
      `/comments/complaint/${complaintId}`,
      { text }
    );

  return response.data;
};

export const deleteComment =
  async (commentId) => {
    const response =
      await api.delete(
        `/comments/${commentId}`
      );

    return response.data;
  };