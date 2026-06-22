import { useEffect } from "react";
import { useSelector } from "react-redux";

import { connectSocket, disconnectSocket } from "../../services/socket";

// Renders nothing. Mount this once near the root of your app (e.g. in
// App.jsx, alongside your <Routes>) so it can react to login/logout
// regardless of which page the user is on.
const SocketManager = () => {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?._id) {
      connectSocket(userInfo._id);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?._id]);

  return null;
};

export default SocketManager;