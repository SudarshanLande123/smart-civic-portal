import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import {
  getDashboardSummary,
  getCategoryStatistics,
  getStatusStatistics,
  getMonthlyTrends,
} from "../../services/analyticsService";

const MONTH_NAMES = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_COLORS = {
  Submitted: "#6b7280",
  "Under Review": "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved: "#22c55e",
  Rejected: "#ef4444",
};

const CATEGORY_COLOR = "#3b82f6";

const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl shadow p-4 border-l-4 ${color}`}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold mt-1">{value ?? "—"}</p>
  </div>
);

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        const [summaryData, categoryData, statusData, trendData] =
          await Promise.all([
            getDashboardSummary(),
            getCategoryStatistics(),
            getStatusStatistics(),
            getMonthlyTrends(),
          ]);

        if (!isMounted) return;

        setSummary(summaryData);

        // Recharts needs { name, value } shape
        setCategoryStats(
          categoryData.map((item) => ({
            name: item._id || "Unknown",
            value: item.total,
          })),
        );

        setStatusStats(
          statusData.map((item) => ({
            name: item._id || "Unknown",
            value: item.total,
            color: STATUS_COLORS[item._id] || "#6b7280",
          })),
        );

        setTrends(
          trendData.map((item) => ({
            name: `${MONTH_NAMES[item._id.month]} ${item._id.year}`,
            Complaints: item.total,
          })),
        );
      } catch (error) {
        console.log(error);
        if (isMounted) toast.error("Failed to load analytics");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          label="Total Complaints"
          value={summary?.totalComplaints}
          color="border-blue-500"
        />
        <SummaryCard
          label="Pending"
          value={summary?.pendingComplaints}
          color="border-yellow-500"
        />
        <SummaryCard
          label="Resolved"
          value={summary?.resolvedComplaints}
          color="border-green-500"
        />
        <SummaryCard
          label="Rejected"
          value={summary?.rejectedComplaints}
          color="border-red-500"
        />
      </div>

      {/* Category Bar Chart + Status Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Bar Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Complaints by Category</h2>
          {categoryStats.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={categoryStats}
                margin={{ top: 5, right: 10, left: -10, bottom: 60 }}
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
                <Bar dataKey="value" fill={CATEGORY_COLOR} radius={[4, 4, 0, 0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Complaints by Status</h2>
          {statusStats.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Trend Line Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-4">Monthly Complaint Trends</h2>
        {trends.length === 0 ? (
          <p className="text-gray-400 text-sm">No trend data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={trends}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Complaints"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;