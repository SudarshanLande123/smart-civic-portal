import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import { getAllComplaints } from "../../services/complaintService";

const STATUS_COLORS = {
  Submitted: "#6b7280",
  "Under Review": "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved: "#22c55e",
  Rejected: "#ef4444",
};

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    votes: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const data = await getAllComplaints();
        const allComplaints = data.complaints || data;

        // Filter to only this citizen's own complaints
        const mine = allComplaints.filter(
          (c) =>
            String(c.createdBy?._id || c.createdBy) ===
            String(userInfo?._id),
        );

        // Summary counts
        const total = mine.length;
        const resolved = mine.filter((c) => c.status === "Resolved").length;
        const pending = mine.filter(
          (c) => c.status !== "Resolved" && c.status !== "Rejected",
        ).length;
        const votes = mine.reduce(
          (sum, c) => sum + (c.upVotes?.length || 0),
          0,
        );

        // Category breakdown for bar chart
        const categoryMap = {};
        mine.forEach((c) => {
          const cat = c.category || "Other";
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });
        const categories = Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        // Status breakdown for pie chart
        const statusMap = {};
        mine.forEach((c) => {
          statusMap[c.status] = (statusMap[c.status] || 0) + 1;
        });
        const statuses = Object.entries(statusMap).map(([name, value]) => ({
          name,
          value,
          color: STATUS_COLORS[name] || "#6b7280",
        }));

        if (isMounted) {
          setStats({ total, pending, resolved, votes });
          setCategoryData(categories);
          setStatusData(statuses);
        }
      } catch (error) {
        console.log(error);
        if (isMounted) toast.error("Failed to load dashboard stats");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (userInfo?._id) {
      loadStats();
    }

    return () => {
      isMounted = false;
    };
  }, [userInfo]);

  return (
    <DashboardLayout>
      <p className="text-gray-500 text-sm mb-1">
        Welcome back,{" "}
        <span className="font-semibold text-gray-700">{userInfo?.name}</span>
      </p>

      <PageHeader
        title="Citizen Dashboard"
        subtitle="Manage and track your complaints"
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <h3 className="text-gray-500 text-sm">Total</h3>
              <p className="text-2xl font-bold">{stats.total}</p>
            </Card>
            <Card>
              <h3 className="text-gray-500 text-sm">Pending</h3>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </Card>
            <Card>
              <h3 className="text-gray-500 text-sm">Resolved</h3>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </Card>
            <Card>
              <h3 className="text-gray-500 text-sm">Votes Received</h3>
              <p className="text-2xl font-bold">{stats.votes}</p>
            </Card>
          </div>

          {stats.total === 0 ? (
            <p className="text-gray-400 text-sm">
              No complaints filed yet — your charts will appear here once you
              submit your first complaint.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Pie Chart */}
              <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold mb-4">Your Complaints by Status</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Bar Chart */}
              {categoryData.length > 0 && (
                <div className="bg-white rounded-xl shadow p-4">
                  <h2 className="font-semibold mb-4">
                    Your Complaints by Category
                  </h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={categoryData}
                      margin={{ top: 5, right: 10, left: -10, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        name="Complaints"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;