import api from "./api";

// Get all complaints

export const getAllAdminComplaints = async () => {
  const response = await api.get(
    "/admin/complaints"
  );

  return response.data;
};

// Filter complaints

export const filterAdminComplaints = async (
  category,
  status
) => {
  const response = await api.get(
    "/admin/complaints/filter",
    {
      params: {
        category,
        status,
      },
    }
  );

  return response.data;
};

// Update complaint status

export const updateComplaintStatus = async (
  id,
  status
) => {
  const response = await api.put(
    `/admin/status/${id}`,
    {
      status,
    }
  );

  return response.data;
};

// Upload resolution proof

export const uploadResolutionProof =
  async (id, formData) => {
    const response =
      await api.put(
        `/admin/proof/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  };