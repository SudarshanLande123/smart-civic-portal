import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

import { getTopProblemAreas } from "../../services/analyticsService";

// Gradient of reds — most complaints = darkest
const BAR_COLORS = [
  "#991b1b", "#b91c1c", "#dc2626", "#ef4444",
  "#f87171", "#fca5a5", "#fecaca", "#fee2e2", "#fff1f2", "#ffffff",
];

const ProblemAreas = () => {
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const data = await getTopProblemAreas();

        if (!isMounted) return;

        setAreas(
          data.map((item) => ({
            name: item._id || "Unknown",
            Complaints: item.total,
          })),
        );
      } catch (error) {
        console.log(error);
        if (isMounted) toast.error("Failed to load problem areas");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

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
      <h1 className="text-2xl font-bold mb-2">Problem Areas</h1>
      <p className="text-gray-500 text-sm mb-6">
        Top 10 locations by number of complaints filed.
      </p>

      {areas.length === 0 ? (
        <p className="text-gray-400 text-sm">No location data yet.</p>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h2 className="font-semibold mb-4">Complaints per Location</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={areas}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={120}
                />
                <Tooltip />
                <Bar dataKey="Complaints" radius={[0, 4, 4, 0]}>
                  {areas.map((_, index) => (
                    <Cell
                      key={index}
                      fill={BAR_COLORS[index] || BAR_COLORS[BAR_COLORS.length - 1]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranked List */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4">Ranked List</h2>
            <div className="space-y-3">
              {areas.map((area, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      index === 0
                        ? "bg-red-600 text-white"
                        : index === 1
                          ? "bg-red-400 text-white"
                          : index === 2
                            ? "bg-red-300 text-white"
                            : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{area.name}</p>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${(area.Complaints / areas[0].Complaints) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-gray-700 shrink-0">
                    {area.Complaints}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default ProblemAreas;