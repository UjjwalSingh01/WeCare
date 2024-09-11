import { Typography } from '@mui/material'
import AdminNavbar from '../components/AdminNavbar'
import InfoCard from '../components/InfoCard'
import ScheduleTable from '../components/ScheduleTable'

const AdminPanel = () => {
  return (
    <div className='w-screen h-screen'>
        <div>
            <AdminNavbar />
        </div>
        <div>
            <Typography 
                variant='h2' 
                align='left'
                sx={{
                //   backgroundColor: 'red',
                  p:3,
                  ml:2
                }}
            >
                Welcome, Admin
            </Typography>
        </div>
        <div className='flex'>
            <InfoCard />
            <InfoCard />
            <InfoCard />
        </div>
        <div className='p-10'>
            <ScheduleTable />
        </div>
    </div>
  )
}

export default AdminPanel