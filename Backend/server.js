const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const fileUpload = require('express-fileupload');
require("dotenv").config();

// Import Routes
const { validateToken, authenticateToken, authenticateOrganization, authenticateClinicToken, authenticateConsultantToken, authenticateHospitalToken } = require('./middleware/authMiddleware');
const hospitalRoutes = require('./routes/hospitalRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const doctorRoutes = require("./routes/doctorRoutes");
const searchRoutes = require('./routes/patientSearch');
const usernavRoutes = require('./routes/usernavRoutes')
const nearbyRoutes = require('./routes/nearbyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const webReviewRoutes = require('./routes/webReviewRoutes');
const userRoutes = require('./routes/userRoutes'); 
const appointmentRoutes = require('./routes/appointmentRoutes');
const consultantRoute = require('./routes/consultantRoutes')
const hospitalDashRoutes = require('./routes/hospitalDashRoutes');
const clinicDashRoutes = require('./routes/clinicDashRoutes');
const consultantDashRoutes = require('./routes/consultantDashRoutes');
const healthRoutes = require('./routes/HealthTracker/healthRoutes');
const findHospitalRoutes = require('./routes/FindHospital/findHospitalRoutes');


const app = express();
// Middleware
// const cors = require("cors");

const corsOptions = {
  origin: ["https://medico-healthcare.vercel.app", "http://localhost:5173"], // Your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// Add logging middleware before routes
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/token/validate", validateToken);
app.use("/api/users", userRoutes);//
app.use("/api/clinics", clinicRoutes);//
app.use("/api/appointments", appointmentRoutes);//
app.use("/api/consultant", consultantRoute);//
app.use("/api/health/v2", healthRoutes);//
app.use("/api/hospitals", hospitalRoutes);//
app.use("/api/user/clinics", clinicRoutes);//
app.use("/api/v1/reviews", reviewRoutes);//
app.use("/api/user/v2", usernavRoutes);//
app.use("/api/user/hospitals", usernavRoutes);//
app.use("/api/search", nearbyRoutes);//
app.use("/api/webreviews", webReviewRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/clinic", clinicDashRoutes);
app.use("/api/v1/consultant", consultantDashRoutes);//
app.use("/api/v2/doctors", hospitalDashRoutes);//
app.use("/api/search", searchRoutes);//
// app.use("/api/clinic/daashboard", clinicRoutes);
// app.use("/api/v2/hospitals", findHospitalRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Medico API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Port configuration
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});