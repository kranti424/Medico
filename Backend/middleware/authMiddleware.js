const jwt = require("jsonwebtoken");
const Hospital = require("../models/hospitalReg");
const User = require("../models/user"); // Ensure the correct path to the User model
const Clinic = require("../models/clinicReg");
const Doctor = require("../models/addDoctor");

// exports.validateToken = async (req, res) => {
//   try {
//     const token =
//       req.cookies.token || req.headers["authorization"]?.split(" ")[1];
//     // console.log("🔐 Token from cookies:", token);
//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No token provided" });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const hospital = await Hospital.findById(decoded.hospitalId);
//     const clinic = await Clinic.findById(decoded.id);
//     const doctor = await Doctor.findById(decoded.id);
//     // console.log("decode", decoded);

//     if (hospital) {
//       return res.json({ success: true, message: "Token is valid" });
//     }
//     if (clinic) { 
//       return res.json({ success: true, message: "Token is valid" });
//     }
//     if (doctor) {
//       return res.json({ success: true, message: "Token is valid" });
//     }
  
//     else{
//   return res.status(401).json({ success: false, message: "Invalid token" });
//     }

//   } catch (error) {
//     console.error("Error validating token", error);
//     res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token" });
//   }
// };

exports.validateToken = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await Hospital.findById(decoded.hospitalId);
    if (user) {
      return res.json({ success: true, message: "Token is valid", user });
    }

    user = await Clinic.findById(decoded.id);
    if (user) {
      return res.json({ success: true, message: "Token is valid", user });
    }

    user = await Doctor.findById(decoded.id);
    if (user) {
      return res.json({ success: true, message: "Token is valid", user });
    }

    return res.status(401).json({ success: false, message: "Invalid token" });

  } catch (error) {
    console.error("Error validating token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateUserToken = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user = await User.findById(decoded.id);
    // console.log(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user; // Attach user info to request
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.log("Error validating token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateHospitalToken = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.hospitalId);

    if (!hospital) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.hospital = hospital;
    next();
  } catch (error) {
    console.error("Error validating token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateClinicToken = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const clinic = await Clinic.findById(decoded.id);

    if (!clinic) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.clinic = clinic;
    next();
  } catch (error) {
    console.error("Error validating clinic token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

exports.authenticateConsultantToken = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  console.log("Consultant token:", token);
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded consultant token:", decoded);
    const consultant = await Doctor.findById(decoded.id);
    // console.log("Consultant:", consultant);
    // console.log(decoded.id)

    if (!consultant) {
      console.log("Invalid token");
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.consultant = consultant;
    next();
  } catch (error) {
    console.error("Error validating consultant token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
exports.authenticateOrganization = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // console.log("Token:", token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.hospitalId);
    const clinic = await Clinic.findById(decoded.id);

    if (hospital || clinic) {
      console.log("Hospital or Clinic found");
      return next();
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  } catch (error) {
    console.error("Error validating token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
exports.authenticateMultipleRoles = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded: ", decoded);
    const clinic = await Clinic.findById(decoded.id);
    const doctor = await Doctor.findById(decoded.id);
    const user = await User.findById(decoded.id);
    // console.log("Doctor:", doctor);

    ///
    if (doctor || user || clinic) {
      return next();
    }

    return res.status(401).json({ success: false, message: "Invalid token" });
  } catch (error) {
    console.error("Error validating token", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
