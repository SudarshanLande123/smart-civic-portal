import { useState } from "react";
import toast from "react-hot-toast";
import { updateComplaintStatus } from "../../services/complaintService";   // or adminService

const UpdateStatusModal = ({ complaint, onClose, onUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);

  const handleUpdate = async () => {
    if (isUpdating || selectedStatus === complaint.status) return;

    setIsUpdating(true);

    try {
      await updateComplaintStatus(complaint._id, selectedStatus);

      toast.success(`Status updated to ${selectedStatus}`);
      
      // Refresh parent list
      if (onUpdated) onUpdated();

      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
    } finally {
      setIsUpdating(false);        // ← This was probably missing
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Update Complaint Status</h2>
        
        <p className="mb-4 text-gray-600">
          <strong>Complaint:</strong> {complaint.title}
        </p>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        >
          {["Submitted", "Under Review", "In Progress", "Resolved", "Rejected"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
            disabled={isUpdating}
          >
            Cancel
          </button>
          
          <button
            onClick={handleUpdate}
            disabled={isUpdating || selectedStatus === complaint.status}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-70"
          >
            {isUpdating ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;