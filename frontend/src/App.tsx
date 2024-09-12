import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import AdminPanel from './pages/AdminPanel'
import Appointment from './pages/Appointment'
import PatientDetail from './pages/PatientDetail'
import Register from './pages/Register'
import SubAdminPanel from './pages/SubAdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register />} />
        <Route path='/PatientDetails' element={<PatientDetail />} />
        <Route path='/Appointment' element={<Appointment />} />
        <Route path='/AdminPanel' element={<AdminPanel/>} />
        <Route path='/SubAdminPanel' element={<SubAdminPanel/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
