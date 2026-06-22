import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import {
  getComplaintById,
  toggleUpvote,
  getUpvoteCount,
  updateComplaint,
  deleteComplaint,
} from "../../services/complaintService";

import {
  getComments,
  addComment,
  deleteComment,
} from "../../services/commentService";

// Keep this in sync with the loader's pop-in animation length in Loaderr.css
// (outer 0.4s + middle delay 0.4s + inner delay 0.8s + star delay ~1.35s
// rounds up to ~1.6s before the shield starts spinning).
const MIN_LOADER_MS = 1600;

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

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvotes, setUpvotes] = useState(0);
  const [loadingVote, setLoadingVote] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchComplaint = async () => {
    try {
      const data = await getComplaintById(id);
      setComplaint(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load complaint");
    }
  };

  const fetchUpvotes = async () => {
    try {
      const data = await getUpvoteCount(id);
      setUpvotes(data.totalUpvotes || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    setLoading(true);

    const loadAll = async () => {
      await Promise.all([fetchComplaint(), fetchUpvotes(), fetchComments()]);

      const elapsed = Date.now() - startTime;
      const remaining = MIN_LOADER_MS - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpvote = async () => {
    try {
      setLoadingVote(true);
      const data = await toggleUpvote(id);
      setUpvotes(data.totalUpvotes);
      toast.success("Vote Updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to vote");
    } finally {
      setLoadingVote(false);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      await addComment(id, commentText);
      setCommentText("");
      await fetchComments();
      toast.success("Comment Added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      await fetchComments();
      toast.success("Comment Deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };

  const startEditing = () => {
    setEditForm({
      title: complaint.title || "",
      description: complaint.description || "",
      category: complaint.category || "",
      address: complaint.location?.address || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleEditChange = (field) => (e) => {
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveEdit = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error("Title and description can't be empty");
      return;
    }

    try {
      setSavingEdit(true);
      const updated = await updateComplaint(id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        location: { address: editForm.address.trim() },
      });
      setComplaint(updated.complaint || updated);
      setIsEditing(false);
      toast.success("Complaint updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update complaint");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteComplaint = async () => {
    const confirmed = window.confirm(
      "Delete this complaint? This can't be undone.",
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteComplaint(id);
      toast.success("Complaint deleted");
      navigate("/complaints");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete complaint");
      setDeleting(false);
    }
  };

  if (loading) {
    return <DashboardLayout><Loader /></DashboardLayout>;
  }

  if (!complaint) {
    return <DashboardLayout>Complaint Not Found</DashboardLayout>;
  }

  const isOwnerComplaint =
    userInfo?._id &&
    complaint.createdBy?._id &&
    String(userInfo._id) === String(complaint.createdBy._id);

  const canManage = isOwnerComplaint && complaint.status === "Submitted";

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow p-4 sm:p-5">
        {isEditing ? (
          <div className="space-y-4">
            <h1 className="text-xl sm:text-2xl font-bold">Edit Complaint</h1>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={handleEditChange("title")}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={handleEditChange("description")}
                rows="4"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={handleEditChange("category")}
                  className="w-full border rounded-lg p-3"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={handleEditChange("address")}
                  className="w-full border rounded-lg p-3"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="flex-1 bg-blue-600 text-white rounded-lg p-3 disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={cancelEditing}
                disabled={savingEdit}
                className="flex-1 border rounded-lg p-3 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Title + owner actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold break-words">
                {complaint.title}
              </h1>

              {canManage && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={startEditing}
                    className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteComplaint}
                    disabled={deleting}
                    className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mt-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                {complaint.status}
              </span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="font-semibold">Description</h2>
              <p className="mt-2 text-gray-600">{complaint.description}</p>
            </div>

            {/* Category */}
            <div className="mt-6">
              <h2 className="font-semibold">Category</h2>
              <p className="text-gray-600">{complaint.category}</p>
            </div>

            {/* Address */}
            <div className="mt-6">
              <h2 className="font-semibold">Address</h2>
              <p className="text-gray-600">{complaint.location?.address}</p>
            </div>

            {/* Reporter */}
            <div className="mt-6">
              <h2 className="font-semibold">Reported By</h2>
              <p className="text-gray-600">{complaint.createdBy?.name}</p>
              <p className="text-gray-500 text-sm">
                {complaint.createdBy?.email}
              </p>
            </div>

            {/* Citizen Images */}
            {complaint.media && complaint.media.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold mb-3">Uploaded Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaint.media.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt=""
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Resolution */}
            {complaint.resolutionNote && (
              <div className="mt-8">
                <h2 className="font-semibold">Resolution Note</h2>
                <p className="mt-2 text-gray-600">{complaint.resolutionNote}</p>
              </div>
            )}

            {/* Upvote */}
            <div className="mt-5">
              <button
                onClick={handleUpvote}
                disabled={loadingVote}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                👍 Upvote
              </button>
              <p className="mt-2 text-gray-600">
                Total Supporters:{" "}
                <span className="font-semibold">{upvotes}</span>
              </p>
            </div>

            {/* Proof Images */}
            {complaint.proofMedia && complaint.proofMedia.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold mb-3">Resolution Proof</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaint.proofMedia.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt=""
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="mt-8 border-t pt-5">
              <p className="text-sm text-gray-500">
                Created: {new Date(complaint.createdAt).toLocaleString()}
              </p>
              {complaint.resolvedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Resolved: {new Date(complaint.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Comments */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>

        <div className="bg-gray-50 p-4 rounded-lg">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows="3"
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={submitComment}
            disabled={commentLoading || !commentText.trim()}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {commentLoading ? "Posting..." : "Add Comment"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No comments yet. Be the first to comment.
            </p>
          ) : (
            comments.map((comment) => {
              const isOwner =
                userInfo?._id &&
                comment.user?._id &&
                String(userInfo._id) === String(comment.user._id);

              const isAdmin =
                userInfo?.role === "admin" || userInfo?.role === "superadmin";

              return (
                <div
                  key={comment._id}
                  className="bg-white border rounded-lg p-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {comment.user?.name || "Anonymous"}
                    </p>
                    <p className="text-gray-600 mt-1">{comment.text}</p>
                    {comment.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {(isOwner || isAdmin) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 text-sm hover:text-red-700 self-start"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetails;