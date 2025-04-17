import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import ReasonPopover from '../../../components/ReasonPopOver';
import { SubAppointmentsDetails } from '../Dashboard';
import { Menu, MenuItem, Chip, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { AlertSnackbar } from '../../../components/AlertSnackbar';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

const statusColors = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'success',
  CANCELLED: 'error',
  NO_SHOW: 'default'
} as const;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));


interface AppointmentTableProps {
  appointments: SubAppointmentsDetails[],
  setAppointments: React.Dispatch<React.SetStateAction<SubAppointmentsDetails[]>>;
}

const AppointmentTable:React.FC<AppointmentTableProps> = ({ appointments, setAppointments }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointmentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointmentId(appointmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointmentId(null);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedAppointmentId) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/subadmin/updateAppointmentStatus`, {
        id: selectedAppointmentId,
        status: newStatus.toUpperCase(),
      });

      showSnackbar(`${response.data.message}`, "success");
      setAppointments(appointments.map((appointment) => 
        appointment.id === selectedAppointmentId 
          ? { ...appointment, status: newStatus } 
          : appointment
      ));
        
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showSnackbar(`${error.response?.data}`, 'error');
        console.error('Backend error:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      handleMenuClose();
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Patient</StyledTableCell>
              <StyledTableCell align="center">Doctor</StyledTableCell>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Time</StyledTableCell>
              <StyledTableCell align="center">Reason</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment) => (
              <StyledTableRow key={appointment.id}>
                <StyledTableCell>{appointment.patientName}</StyledTableCell>
                <StyledTableCell align="center">{appointment.doctorName}</StyledTableCell>
                <StyledTableCell align="center">{appointment.date}</StyledTableCell>
                <StyledTableCell align="center">{appointment.time}</StyledTableCell>
                <StyledTableCell align="center">
                  <ReasonPopover reason={appointment.reason} />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip 
                    label={appointment.status} 
                    color={statusColors[appointment.status as AppointmentStatus]}
                    sx={{ 
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      borderWidth: 2,
                      borderRadius: 100
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, appointment.id)}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {Object.keys(statusColors).map((status) => (
          <MenuItem 
            key={status} 
            onClick={() => handleStatusUpdate(status)}
            sx={{ textTransform: 'capitalize' }}
          >
            {status.toLowerCase().replace('_', ' ')}
          </MenuItem>
        ))}
      </Menu>

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
}

export default AppointmentTable;