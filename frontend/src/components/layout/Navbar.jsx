import { HiMenu } from "react-icons/hi";

import NotificationBell from "../common/Notificationbell";

const Navbar = ({ setIsOpen }) => {
  return (
    <nav className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
      <h1 className="text-lg font-bold">Smart Civic</h1>

      <div className="flex items-center gap-2">
        <NotificationBell />

        <button onClick={() => setIsOpen(true)} className="lg:hidden">
          <HiMenu size={28} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;