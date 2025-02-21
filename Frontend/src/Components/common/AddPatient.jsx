import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaUser, 
  FaCalendar, 
  FaHeartbeat, 
  FaPhone, 
  FaEnvelope, 
  FaHome, 
  FaUpload, 
  FaUserPlus, 
  FaStethoscope,
  FaNotesMedical,
  FaIdCard,
  FaUserCircle
} from 'react-icons/fa';

const AddPatient = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      phone: "",
      email: "",
      address: "",
      chronicDiseases: "",
      pastSurgeries: "",
      currentMedications: "",
      allergies: "",
      emergencyName: "",
      emergencyRelation: "",
      emergencyPhone: "",
      reports: [],
      notes: "",
      status: "Active"
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const generatePatientId = () => {
    return 'PT' + Date.now().toString().slice(-6);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const patientData = {
        ...data,
        patientId: generatePatientId(),
        registrationDate: new Date().toISOString(),
        reports: files
      };
      // console.log("Form submitted:", patientData);
      toast.success("Patient added successfully!");
      reset();
      setFiles([]);
    } catch (error) {
      toast.error("Failed to add patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 bg-fixed bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-vector/abstract-background-health-care-science-icon-pattern-medical-innovation-concept_44392-177.jpg?semt=ais_hybrid')`,
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-white/80 backdrop-blur-sm"></div>

      {/* Form Container */}
      <div className="relative z-10">
        <form onSubmit={handleSubmit(onSubmit)} 
          className="max-w-4xl mx-auto backdrop-blur-md bg-white/40 rounded-xl shadow-2xl p-8 border border-white/50"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 drop-shadow-md">
            Add New Patient
          </h2>

          {/* Form Sections with improved visibility */}
          <div className="mb-8 p-6 border border-blue-100 rounded-lg backdrop-blur-md bg-white/80 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
              <FaUser className="mr-3 text-blue-600" /> 
              <span className="border-b-2 border-blue-400 pb-1">Basic Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">First Name *</label>
                <input
                  type="text"
                  {...register("firstName", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">First name is required</span>
                )}
              </div>
              <div>
                <label className="block mb-2">Last Name *</label>
                <input
                  type="text"
                  {...register("lastName", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block mb-2">Date of Birth *</label>
                <input
                  type="date"
                  {...register("dateOfBirth", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2">Blood Group *</label>
                <select 
                  {...register("bloodGroup", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Gender *</label>
                <select 
                  {...register("gender", { required: true })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical History Section */}
          <div className="mb-8 p-6 border border-blue-100 rounded-lg backdrop-blur-md bg-white/80 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
              <FaHeartbeat className="mr-3 text-blue-600" />
              <span className="border-b-2 border-blue-400 pb-1">Medical History</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Chronic Diseases</label>
                <textarea
                  {...register("chronicDiseases")}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="3"
                  placeholder="List any chronic diseases"
                />
              </div>
              <div>
                <label className="block mb-2">Past Surgeries</label>
                <textarea
                  {...register("pastSurgeries")}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="3"
                  placeholder="List past surgeries"
                />
              </div>
              <div>
                <label className="block mb-2">Current Medications</label>
                <textarea
                  {...register("currentMedications")}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="3"
                  placeholder="List current medications"
                />
              </div>
              <div>
                <label className="block mb-2">Allergies</label>
                <textarea
                  {...register("allergies")}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="3"
                  placeholder="List any allergies"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="mb-8 p-6 border border-blue-100 rounded-lg backdrop-blur-md bg-white/80 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
              <FaUserPlus className="mr-3 text-blue-600" />
              <span className="border-b-2 border-blue-400 pb-1">Emergency Contact</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Contact Name *</label>
                <input
                  type="text"
                  {...register("emergencyName", { required: true })}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <label className="block mb-2">Relation *</label>
                <select
                  {...register("emergencyRelation", { required: true })}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Select Relation</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Contact Phone *</label>
                <input
                  type="tel"
                  {...register("emergencyPhone", { required: true })}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="mb-8 p-6 border border-blue-100 rounded-lg backdrop-blur-md bg-white/80 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
              <FaNotesMedical className="mr-3 text-blue-600" />
              <span className="border-b-2 border-blue-400 pb-1">Additional Information</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Upload Reports/Prescriptions</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-md"
                  accept=".pdf,image/*"
                />
              </div>
              <div>
                <label className="block mb-2">Notes</label>
                <textarea
                  {...register("notes")}
                  className="w-full px-4 py-2 border rounded-md"
                  rows="3"
                  placeholder="Additional notes"
                />
              </div>
              <div>
                <label className="block mb-2">Status</label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => {
                reset();
                setFiles([]);
              }}
              className="px-6 py-3 bg-white/80 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors text-blue-600 font-medium shadow-sm"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md
                hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 font-medium shadow-md"
            >
              {isSubmitting ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPatient;