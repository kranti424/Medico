import React from "react";
import { Link } from "react-router-dom";

function DoctorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header with enhanced styling */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Healthcare Provider Portal
        </h1>
        <p className="text-2xl text-gray-600 font-light">
          Choose your healthcare domain
        </p>
      </div>

      {/* Cards Container with enhanced spacing */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
        {/* Hospital Card */}
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2 border border-blue-100">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <img
              src="https://png.pngtree.com/png-vector/20241101/ourmid/pngtree-colorful-3d-cartoon-hospital-building-illustration-png-image_14219045.png"
              alt="Hospital"
              className="relative w-full h-56 object-contain mb-6 transform transition-transform group-hover:scale-105"
            />
          </div>
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            Hospital Portal
          </h2>
          <p className="text-gray-600 mb-8">
            Manage your hospital ecosystem with advanced tools and analytics
          </p>
            <div className="space-y-4">
          <Link to="/hospitalregistration">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transform transition-all duration-300 hover:scale-105 shadow-lg">
                Register Hospital
              </button></Link><div><Link to="/hospitallogin">
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transform transition-all duration-300">
                Hospital Login
              </button></Link></div>
            </div>
          
        </div>

        {/* Clinic Card */}
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2 border border-green-100">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <img
              src="https://media.istockphoto.com/id/1225898954/vector/medical-clinic-building-simple-flat-illustration.jpg?s=612x612&w=0&k=20&c=JklgLCtm5NpwE5i6yN0JTIqp7vPlA7YB3RPYNIUHXlQ="
              alt="Clinic"
              className="relative w-full h-56 object-contain mb-6 transform transition-transform group-hover:scale-105"
            />
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Clinic Portal
          </h2>
          <p className="text-gray-600 mb-8">
            Streamline your clinic operations with our integrated solutions
          </p>
          <div className="space-y-4">
            <Link to="/clinicregistration">
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transform transition-all duration-300 hover:scale-105 shadow-lg">
                Register Clinic
              </button>
            </Link>
            <div><Link to="/cliniclogin">
            <button className="w-full bg-white text-green-600 py-3 rounded-xl border-2 border-green-600 hover:bg-green-50 transform transition-all duration-300">
              Clinic Login
            </button></Link></div>
          </div>
        </div>

        {/* Consultant Card */}
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 transform hover:-translate-y-2 border border-purple-100">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <img
              src="https://www.shutterstock.com/image-vector/male-doctor-smiling-selfconfidence-flat-600nw-2281709217.jpg"
              alt="Consultant"
              className="relative w-full h-56 object-contain mb-6 transform transition-transform group-hover:scale-105"
            />
          </div>
          <h2 className="text-3xl font-bold text-purple-800 mb-4">
            Consultant Portal
          </h2>
          <p className="text-gray-600 mb-8">
            Your personal platform for private practice management
          </p>
          <div className="space-y-4">
            <Link to="/consultantregistration">
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transform transition-all duration-300 hover:scale-105 shadow-lg">
                Register as Consultant
              </button>
            </Link>
            <div>
              <Link to="/consultantlogin">
                <button className="w-full bg-white text-purple-600 py-3 rounded-xl border-2 border-purple-600 hover:bg-purple-50 transform transition-all duration-300">
                  Consultant Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorPage;
