import { useState } from "react";
import toast from "react-hot-toast";

import {
  updateComplaintStatus,
  uploadResolutionProof,
} from "../../services/adminService";

const statusOptions = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

const UpdateStatusModal = ({ complaint, onClose, onUpdated }) => {
  const [status, setStatus] = useState(complaint.status);
  const [resolutionNote, setResolutionNote] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const isResolving = status === "Resolved";

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (isResolving && files.length === 0 && !complaint.proofMedia?.length) {
      toast.error("Please attach at least one proof image to mark as Resolved");
      return;
    }

    setSubmitting(true);

    try {
      if (isResolving && files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("proofMedia", file));
        if (resolutionNote.trim()) {
          formData.append("resolutionNote", resolutionNote.trim());
        }

        await uploadResolutionProof(complaint._id, formData);
      } else {
        await updateComplaintStatus(complaint._id, status);
      }

      toast.success("Status updated successfully");
      
      // Refresh list and close modal
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to update status"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Update Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4 truncate">{complaint.title}</p>

        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
          disabled={submitting}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {isResolving && (
          <div className="mb-4 space-y-3 border-t pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Resolution note
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows="3"
                placeholder="Describe how this was resolved..."
                className="w-full border rounded-lg p-3"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Proof images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm"
                disabled={submitting}
              />
              {files.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 border rounded-lg p-3 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white rounded-lg p-3 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;