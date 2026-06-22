import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/citizen/Dashboard";
import CreateComplaint from "../pages/citizen/CreateComplaint";
import Complaints from "../pages/citizen/Complaints";
import ComplaintDetails from "../pages/citizen/ComplaintDetails";
import ManageUsers from "../pages/admin/ManageUsers";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import SocketManager from "../components/common/SocketManager";
import AnalyticsDashboard from "../pages/admin/Analyticsdashboard";
import ProblemAreas from "../pages/admin/ProblemAreas";
import AdminComplaints from "../pages/admin/AdminComplaints";

const AppRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <SocketManager />
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate to={userInfo ? "/dashboard" : "/login"} replace />
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Citizen Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-complaint" element={<CreateComplaint />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/problem-areas" element={<ProblemAreas />} />
        </Route>

        {/* Catch-all: unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;