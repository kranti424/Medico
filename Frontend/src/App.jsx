import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './Pages/LandingPage'
import DoctorPage from './Pages/DoctorRegPage'
import HospitalRegistration from './Components/Hospital/HospitalRegistration'
import ClinicRegistration from './Components/Clinic/ClinicRegistration'
import ConsultantLogin from "./Components/Consultant/ConsultantLogin";
import ClinicLogin from './Components/Clinic/ClinicLogin'
import DoctorProfile from './Components/User/NavResults/DoctorProfile'
import HospitalLogin from './Components/Hospital/HospitalLogin'
import HospitalNavbar from './Components/Navbar/HospitalNav'
import HospitalDashboard from './Components/Hospital/Mainpage'
import ClinicDashboard from './Components/Clinic/MainPage'
import ClinicNav from './Components/Navbar/ClinicNav'
import HealthcareSearch from './Components/User/Mainpage'
import UserNav from './Components/Navbar/UserNav'
import AddDoctor from './Components/Hospital/AddDoctor'
import AllDoctors from './Components/Hospital/AllDoctor'
import SpecialtyResults from './Components/User/SearchResults/SpecialityResult'
import DoctorResults from './Components/User/SearchResults/DoctorResult'
import HospitalResults from './Components/User/SearchResults/HospitalResult'
import ClinicResults from './Components/User/SearchResults/ClinicResult'
import UserLogin from './Components/User/Login'
import Hospitals from './Components/User/NavResults/NavHospital'
import NavDoctors from './Components/User/NavResults/NavDoctors'
import About from './Components/User/NavResults/About'
import Help from './Components/User/NavResults/Help'
import ClinicAddDoctor from './Components/Clinic/ClinicAddDoctor'
import ClinicAllDoctors from './Components/Clinic/ClinicAllDoctor'
import AddPatient from './Components/common/AddPatient'
import Appointments from './Components/Hospital/Appointments'
import NavClinic from './Components/User/NavResults/NavClinic'
import HospitalProfile from './Components/Hospital/HospitalProfile'
import ProfilePage from './Components/User/ProfilePage'
import ConsultantDashboard from './Components/Consultant/ConsultantDashboard'
import ConsultantAppointments from './Components/Consultant/ConsultantAppointment'
import UserAppointments from './Components/User/UserAppointments'
import ClinicAppointment from './Components/Clinic/ClinicAppointment'
import ConsultantProfile from './Components/Consultant/ConsultantProfile'
import ClinicProfile from './Components/Clinic/ClinicProfile'
import SiteMap from './Components/User/NavResults/SiteMap'
import Detection from './Components/User/Detection'
import DetectButton from "./Components/User/Buttons/DetectButton";
import DailyCalories from "./Components/Health_Tracker/DailyCalories";
import Exercisecalories from "./Components/Health_Tracker/ExerciseCalories";
import FoodSearch from "./Components/Health_Tracker/FoodSearch";
import InstantFoodDetails from "./Components/Health_Tracker/InstantFoodDetails";
import HealthTrackerButton from './Components/User/Buttons/HealthTrackerButtons'
import BMITracker from './Components/Health_Tracker/BMITracker'
import FindHospital from './Components/User/FindHospital/FindHospital'
import HospitalCard from './Components/User/FindHospital/HospitalCard'
import HospitalDetails from './Components/User/FindHospital/HospitalDetails'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />

        {/* ***********Clinic Routes ************ */}
        <Route path="/cliniclogin" element={<ClinicLogin />} />
        <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
        <Route path="/clinicregistration" element={<ClinicRegistration />} />
        <Route path="/clinicprofile" element={<ClinicProfile />} />
        <Route path="/clinicadddoctor" element={<ClinicAddDoctor />} />
        <Route path="/clinicalldoctors" element={<ClinicAllDoctors />} />
        <Route path="/clinic/appointments" element={<ClinicAppointment />} />

        {/* **************Common Routes************************** */}
        <Route path="/addpatient" element={<AddPatient />} />

        {/* *************consultant Routes**********************  */}
        <Route path="/consultantlogin" element={<ConsultantLogin />} />
        <Route path='/consultant/dashboard' element={<ConsultantDashboard />} />
        <Route path='/consultant/appointments' element={<ConsultantAppointments />} />
        <Route path="/consultantprofile" element={<ConsultantProfile />} />

        {/* **************** Health_Tracker Routes **************** */}
        <Route path="/dailycalories" element={<DailyCalories />} />
        <Route path="/exercisecalories" element={<Exercisecalories />} />
        <Route path="/foodsearch" element={<FoodSearch />} />
        <Route path="/instantfooddetails" element={<InstantFoodDetails />} />
        <Route path="/bmitracker" element={<BMITracker />} />

        {/* *******************Hospital Routes******************* */}
        <Route path="/hospitalregistration" element={<HospitalRegistration />} />
        <Route path="/hospitallogin" element={<HospitalLogin />} />
        <Route path="/hospital/adddoctor" element={<AddDoctor />} />
        <Route path="/hospital/alldoctors" element={<AllDoctors />} />
        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/appointments" element={<Appointments />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />

        {/* ******************** Navbar Routes********************** */}
        <Route path="/usernav" element={<UserNav />} />
        <Route path="/hospitalnav" element={<HospitalNavbar />} />
        <Route path="/clinicnav" element={<ClinicNav />} />

        {/* ****************Buttons Routes**************** */}
        <Route path="/detectbutton" element={<DetectButton/>} />
        <Route path="/healthtrackerbutton" element={<HealthTrackerButton />} />

        {/* ****************Nav Results Routes****************   */}
        <Route path="/usernavhospitals" element={<Hospitals />} />
        <Route path="/usernavclinic" element={<NavClinic />} />
        <Route path="/usernavdoctors" element={<NavDoctors />} />
        <Route path="/doctorprofile" element={<DoctorProfile />} />
        <Route path="/usernavabout" element={<About />} />
        <Route path="/usernavhelp" element={<Help />} />
        <Route path="/sitemap" element={<SiteMap/>} />

        {/* ********************Search Results Routes**************** */}
        <Route path="/specialtyresults" element={<SpecialtyResults />} />
        <Route path="/hospitalresults" element={<HospitalResults />} />
        <Route path="/clinicresults" element={<ClinicResults />} />
        <Route path="/doctorresults" element={<DoctorResults />} />

          {/* ****************User Routes************* */}
        <Route path="/patientpage" element={<HealthcareSearch />} /> {/* User Main Page */}
        <Route path="/detect" element={<Detection/>} />
        <Route path="/userprofile" element={<ProfilePage />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path='/user/appointments' element={<UserAppointments />} />

        {/* *****************Pages Routes****************** */}
        <Route path="/doctorpage" element={<DoctorPage />} />

        {/* *******************Find Hospital********************* */}
        <Route path="/findhospital" element={<FindHospital />} />
        <Route path="/hospitalcard" element={<HospitalCard />} />
        <Route path="/hospitaldetails" element={<HospitalDetails />} />

        {/* ******************************************************* */}
      </Routes>
    </Router>
  )
}

export default App