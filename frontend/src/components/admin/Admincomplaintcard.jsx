const statusStyles = {
  Submitted: "bg-gray-100 text-gray-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const AdminComplaintCard = ({ complaint, onUpdateClick }) => {
  const badgeClass = statusStyles[complaint.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h2 className="font-bold truncate">{complaint.title}</h2>
        <p className="text-gray-500 text-sm">{complaint.category}</p>
        <p className="text-gray-400 text-xs mt-1 truncate">
          {complaint.location?.address}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Reported by {complaint.createdBy?.name || "Unknown"}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
          {complaint.status}
        </span>

        <button
          onClick={() => onUpdateClick(complaint)}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default AdminComplaintCard;