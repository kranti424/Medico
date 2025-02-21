import { Link } from "react-router-dom";
import TranslateWidget from "../Components/Translate/TranslateWidget";

const Landingpage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8 relative">
      {/* Background Video */}
      {/* <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source
          src="https://static.vecteezy.com/system/resources/thumbnails/034/328/300/small/abstract-dark-blue-dna-molecular-structure-animation-video.jpg"
          // type="video/mp4"
        />
        Your browser does not support the video tag.
      </video> */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61802.jpg?ga=GA1.1.166966615.1706040675&semt=ais_hybrid"
        alt="Background"
      />

      <TranslateWidget />

      {/* Added pt-16 for mobile spacing and z-20 for stacking context */}
      <div className="max-w-6xl mx-auto relative z-20 pt-16 md:pt-0">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-12 text-center mt-4">
          Welcome to
          <span className="border-2 border-gray-300 py-2 px-4 rounded-lg inline-block mt-4 md:mt-0 md:ml-4">
            <span className="text-3xl md:text-4xl font-extrabold text-[#2C3E50] tracking-wide">
              Medico
            </span>
            <span className="ml-2 text-lg md:text-xl text-[#16A085] uppercase font-semibold tracking-wider">
              Healthcare
            </span>
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center md:items-stretch">
          {/* Doctor Card */}
          <Link
            to="/doctorpage"
            className="w-full md:w-1/2 max-w-sm transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white bg-opacity-40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 rounded-full transform -rotate-6"></div>
                <img
                  src="https://img.freepik.com/premium-photo/3d-doctor-cartoon-character-health-care-background_962764-87947.jpg"
                  alt="Doctor Profile"
                  className="relative w-64 h-64 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-blue-600">
                  Doctor Portal
                </h2>
                <p className="text-gray-600">
                  Access your medical practice, manage patients, and schedule
                  appointments
                </p>
                <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                  Enter as Doctor
                </div>
              </div>
            </div>
          </Link>

          {/* Patient Card */}
          <Link
            to="/patientpage"
            className="w-full md:w-1/2 max-w-sm transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white bg-opacity-40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full transform rotate-6"></div>
                <img
                  src="https://img.freepik.com/premium-vector/user-interface-icon-cartoon-style-illustration_161751-2838.jpg"
                  alt="Patient Profile"
                  className="relative w-64 h-64 mx-auto rounded-full object-cover border-4 border-green-500 shadow-lg"
                />
              </div>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-green-600">
                  User Portal
                </h2>
                <p className="text-gray-600">
                  View your medical records, book appointments, and connect with
                  doctors
                </p>
                <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">
                  Enter as User
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
