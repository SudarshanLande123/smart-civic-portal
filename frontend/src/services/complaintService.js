import api from "./api";

export const createComplaint = async (formData) => {
  try {
    const response = await api.post("/complaints", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Token should be automatically added by the api interceptor
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create Complaint Error:", error.response?.data || error.message);
    throw error;
  }
};

// Other functions remain the same...
export const getAllComplaints = async () => {
  const response = await api.get("/complaints");
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

// ... rest of your exports

export const toggleUpvote = async (complaintId) => {
  const response = await api.put(`/complaints/upvote/${complaintId}`);

  return response.data;
};

export const getUpvoteCount = async (complaintId) => {
  const response = await api.get(`/complaints/upvotes/${complaintId}`);

  return response.data;
};

export const searchComplaints = async (keyword) => {
  const response = await api.get(`/complaints/search?keyword=${keyword}`);

  return response.data;
};

export const filterComplaints = async (category, status) => {
  const response = await api.get(`/complaints/filter`, {
    params: {
      category,
      status,
    },
  });

  return response.data;
};


export const updateComplaint = async (id, payload) => {
  const response = await api.put(`/complaints/${id}`, payload);
  return response.data;
};
 
export const deleteComplaint = async (id) => {
  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};