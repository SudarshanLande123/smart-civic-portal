import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { createComplaint } from "../../services/complaintService";

const CATEGORIES = [
  "Pothole",
  "Garbage",
  "Water Leakage",
  "Street Light",
  "Drainage",
  "Illegal Parking",
  "Public Safety",
  "Other",
];

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("address", data.address);

      files.forEach((file) => {
        formData.append("media", file);
      });

      const response = await createComplaint(formData);

      toast.success("Complaint Submitted Successfully");

      // Reset form
      reset();
      setFiles([]);

      const complaintId = response?.complaint?._id || response?._id;
      if (complaintId) {
        navigate(`/complaints/${complaintId}`);
      } else {
        navigate("/complaints");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed To Submit");
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Complaint</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Title</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief title of your complaint"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              rows="5"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your complaint in detail..."
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Address / Location</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Location of the complaint"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Upload Images */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Upload Images <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
            {files.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {files.length} image(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg disabled:opacity-70 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Submitting Complaint..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateComplaint;