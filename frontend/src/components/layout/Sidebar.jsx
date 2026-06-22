import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const isAdmin = userInfo?.role === "admin" || userInfo?.role === "superadmin";

  const logoutHandler = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <aside
      className="
        hidden
        lg:flex
        flex-col
        w-64
        bg-white
        shadow-md
        min-h-screen
        p-6
      "
    >
      <h2
        className="
          text-xl
          font-bold
          mb-8
        "
      >
        Smart Civic
      </h2>

      <nav className="flex flex-col gap-4">
        <Link to="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>

        <Link to="/create-complaint" className="hover:text-blue-600">
          Create Complaint
        </Link>

        <Link to="/complaints" className="hover:text-blue-600">
          Complaints
        </Link>
       

        {isAdmin && (
          <>
            <Link to="/admin/analytics">Analytics</Link>
            <Link to="/admin/problem-areas">Problem Areas</Link>
            <Link to="/admin/complaints">Manage Complaints</Link>
            <Link to="/admin/manage-users">Manage Users</Link>
          </>
        )}
      </nav>

      <button
        onClick={logoutHandler}
        className="
          mt-auto
          bg-red-500
          text-white
          p-2
          rounded-lg
          hover:bg-red-600
        "
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
