let io;

const initializeSocket = (
  socketInstance
) => {
  io = socketInstance;
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO
};