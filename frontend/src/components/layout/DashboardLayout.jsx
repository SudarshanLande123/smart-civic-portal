import {
  useState,
} from "react";

import Navbar from "./Navbar";

import Sidebar from "./Sidebar";

import MobileMenu from "./MobileMenu";

const DashboardLayout = ({
  children,
}) => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  return (
    <div
      className="
      min-h-screen
      bg-gray-100
      "
    >
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={
          setIsOpen
        }
      />

      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Navbar
            setIsOpen={
              setIsOpen
            }
          />

          <main
            className="
            p-4
            md:p-6
            lg:p-8
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;