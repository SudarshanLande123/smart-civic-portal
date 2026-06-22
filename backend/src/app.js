const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");

const errorHandler = require("./middleware/errorMiddleware");

//for the security purpose
const helmet = require("helmet");

const rateLimit = require("express-rate-limit");


const morgan = require("morgan");

app.use(helmet());

app.use(morgan("dev"));

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: "Too many requests. Try again later.",
});

app.use("/api", limiter);
//without this react cannot call backend becuese browser block request


app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/notifications", notificationRoutes);  

app.use("/api/analytics", analyticsRoutes);

app.use("/api/users", userManagementRoutes);

//at bottom
app.use(errorHandler);  

app.get("/", (req, res) => {
  res.send("smart-civic-portal running!");
});

module.exports = app;
