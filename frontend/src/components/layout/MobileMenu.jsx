import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/authSlice";

const MobileMenu = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const isAdmin = userInfo?.role === "admin" || userInfo?.role === "superadmin";

  const logoutHandler = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="w-64 h-full bg-white p-4">
        <button onClick={() => setIsOpen(false)}>Close</button>

        <div className="flex flex-col gap-4 mt-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/create-complaint">Create Complaint</Link>
          <Link to="/complaints">Complaints</Link>
          <Link to="/admin/analytics">Analytics</Link>

          {isAdmin && (
            <>
              <Link
                to="/admin/complaints"
                className="hover:text-blue-600 font-medium"
              >
                Manage Complaints
              </Link>

              <Link
                to="/admin/manage-users"
                className="hover:text-blue-600 font-medium"
              >
                Manage Users
              </Link>
  
              <Link to="/admin/problem-areas">Problem Areas</Link>
            </>
          )}

          <button
            onClick={logoutHandler}
            className="bg-red-500 text-white p-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
