import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";
import AdminComplaintCard from "../../components/admin/Admincomplaintcard";
import UpdateStatusModal from "../../components/admin/UpdateStatusModel";

import {
  getAllAdminComplaints,
  filterAdminComplaints,
} from "../../services/adminService";

const categoryOptions = [
  "Pothole",
  "Garbage",
  "Water Leakage",
  "Street Light",
  "Drainage",
  "Illegal Parking",
  "Public Safety",
  "Other",
];

const statusOptions = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllAdminComplaints();
      setComplaints(data.complaints || data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const data = await filterAdminComplaints(category, status);
      setComplaints(data.complaints || data);
    } catch (error) {
      console.log(error);
      toast.error("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setStatus("");
    loadComplaints();
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Manage Complaints</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option value="">All Status</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="flex-1 bg-green-600 text-white rounded-lg p-3"
          >
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="flex-1 border rounded-lg p-3"
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : complaints.length === 0 ? (
        <p className="text-gray-500 text-sm">No complaints found.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <AdminComplaintCard
              key={complaint._id}
              complaint={complaint}
              onUpdateClick={setSelectedComplaint}
            />
          ))}
        </div>
      )}

      {selectedComplaint && (
        <UpdateStatusModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdated={loadComplaints}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminComplaints;
