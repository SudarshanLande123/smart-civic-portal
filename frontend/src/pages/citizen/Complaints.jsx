import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import {
  getAllComplaints,
  searchComplaints,
  filterComplaints,
} from "../../services/complaintService";

import toast from "react-hot-toast";

const statusStyles = {
  Submitted: "bg-gray-100 text-gray-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const ComplaintCard = ({ complaint }) => {
  const badgeClass =
    statusStyles[complaint.status] || "bg-gray-100 text-gray-700";
  const hasImage = complaint.media && complaint.media.length > 0;
  const extraCount = hasImage ? complaint.media.length - 1 : 0;

  if (!hasImage) {
    // Compact list-style card for complaints with no uploaded image
    return (
      <Link to={`/complaints/${complaint._id}`}>
        <div className="bg-white p-4 rounded-xl shadow mb-4">
          <h2 className="font-bold">{complaint.title}</h2>
          <p className="text-gray-500">{complaint.category}</p>
          <div className="flex items-center justify-between mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs ${badgeClass}`}>
              {complaint.status}
            </span>
            <span className="text-xs text-gray-400">
              {complaint.createdBy?.name}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/complaints/${complaint._id}`}>
      <div className="bg-white rounded-xl shadow overflow-hidden mb-4">
        <div className="relative aspect-square">
          <img
            src={complaint.media[0].url}
            alt={complaint.title}
            className="w-full h-full object-cover"
          />

          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
          >
            {complaint.status}
          </span>

          {extraCount > 0 && (
            <span className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              +{extraCount}
            </span>
          )}
        </div>

        <div className="p-3">
          <p className="text-sm font-semibold text-gray-800">
            {complaint.createdBy?.name || "Anonymous"}
          </p>
          <h2 className="font-bold mt-0.5 truncate">{complaint.title}</h2>
          <p className="text-gray-500 text-sm">{complaint.category}</p>
        </div>
      </div>
    </Link>
  );
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await getAllComplaints();
      setComplaints(data.complaints || data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      if (search.trim() === "") {
        await loadComplaints();
        return;
      }

      const data = await searchComplaints(search);
      setComplaints(data.complaints || data);
    } catch (error) {
      console.log(error);
      toast.error("Search Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const data = await filterComplaints(category, status);
      setComplaints(data.complaints || data);
    } catch (error) {
      console.log(error);
      toast.error("Filter Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Complaints</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search Complaint"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={handleSearch}
          className="mt-3 w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Search
        </button>
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border rounded-lg p-3 mt-4"
      >
        <option value="">All Categories</option>
        <option value="Pothole">Pothole</option>
        <option value="Garbage">Garbage</option>
        <option value="Water Leakage">Water Leakage</option>
        <option value="Street Light">Street Light</option>
        <option value="Drainage">Drainage</option>
        <option value="Illegal Parking">Illegal Parking</option>
        <option value="Public Safety">Public Safety</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border rounded-lg p-3 mt-4"
      >
        <option value="">All Status</option>
        <option value="Submitted">Submitted</option>
        <option value="Under Review">Under Review</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button
        onClick={handleFilter}
        className="mt-4 w-full bg-green-600 text-white p-3 rounded-lg"
      >
        Apply Filters
      </button>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {complaints.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-full">
              No complaints found.
            </p>
          ) : (
            complaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Complaints;