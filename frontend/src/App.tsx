import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import AdminPanel from './pages/AdminPanel/Dashboard'
import Appointment from './pages/Appointment'
import PatientDetail from './pages/PatientDetail'
import Register from './pages/Register'
import SubAdminPanel from './pages/SubAdminPanel/Dashboard';
import DoctorDetailPage from './pages/DoctorDetail';
import { Doctor } from './pages/SubAdminPanel/Doctor';
import Adminstration from './pages/AdminPanel/Administration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/PatientDetails' element={<PatientDetail />} />
        <Route path='/Appointment' element={<Appointment />} />
        <Route path='/DoctorDetailPage' element={<DoctorDetailPage />} />
        {/* Admin Panel */}
        <Route path='/admin/dashboard' element={<AdminPanel />} />
        <Route path='/admin/administration' element={<Adminstration />} />
        <Route path='/admin/doctor' element={<Doctor />} />
        {/* Sub-Admin Panel */}
        <Route path='/subAdmin/dashboard' element={<SubAdminPanel />} />
        <Route path='/subAdmin/appointments' element={<SubAdminPanel />} />
        <Route path='/subAdmin/doctor' element={<Doctor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;