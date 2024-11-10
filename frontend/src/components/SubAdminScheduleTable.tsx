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
import ReasonPopover from './ReasonPopOver';
import { SubAppointmentsDetails } from '../pages/SubAdminPanel';
import { Alert, Button, Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
}));


export default function SubAdminScheduleTable({appointments} : {appointments: SubAppointmentsDetails[]}) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Handle page change
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  async function handleUpdate(id: string, action: 'COMPLETED' | 'CANCELLED') {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/appointment/update-appointment', {
        id,
        action
      })

      if(response.status === 200){
        showSnackbar(`${response.data.message}`, "success");
        window.location.reload();
      }
      else {
        showSnackbar(`${response.data.error}`, "error");
        return
      }

    } catch (error) {
      showSnackbar('Error in Updating Appointment', 'error')
      console.error('Error in Updating Apppintment: ', error)
    }
  }

  return (
    <>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Patient</StyledTableCell>
            <StyledTableCell align="center">Doctor</StyledTableCell>
            <StyledTableCell align="center">Date</StyledTableCell>
            <StyledTableCell align="center">Time</StyledTableCell>
            <StyledTableCell align="center">Reason</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {appointment.patientName}
              </StyledTableCell>
              <StyledTableCell align="center">{appointment.doctor}</StyledTableCell>
              <StyledTableCell align="center">{appointment.date}</StyledTableCell>
              <StyledTableCell align="center">{appointment.time}</StyledTableCell>
              <StyledTableCell align="center"><ReasonPopover reason={appointment.reason} /></StyledTableCell>
              <StyledTableCell align="center">
              {
                (() => {
                  const currentDateTime = dayjs();

                  const appointmentDateTime = dayjs(`${appointment.date} ${appointment.time}`, 'MMMM D, YYYY hh:mm A');

                  if (appointment.status === 'ACTIVE' && currentDateTime.isAfter(appointmentDateTime)) {
                    return (
                      <>
                        <Button 
                          variant="text" 
                          onClick={() => handleUpdate(appointment.appointmentId, 'CANCELLED')}
                        >
                          Cancelled
                        </Button>
                        |
                        <Button 
                          variant="text" 
                          onClick={() => handleUpdate(appointment.appointmentId, 'COMPLETED')}
                        >
                          Completed
                        </Button>
                      </>
                    );
                  } else {
                    return appointment.status;
                  }
                })()
              }
            </StyledTableCell>

            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination Component */}
      <TablePagination
        component="div"
        count={appointments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
      />
    </TableContainer>
    <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            width: '400px',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '0',
            '& .MuiSnackbarContent-root': {
              padding: 0, 
            },
          }}
        >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{
            background: snackbarSeverity === 'success'
              ? 'linear-gradient(90deg, rgba(70,203,131,1) 0%, rgba(129,212,250,1) 100%)'
              : 'linear-gradient(90deg, rgba(229,57,53,1) 0%, rgba(244,143,177,1) 100%)',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
            width: '100%', 
            '& .MuiAlert-icon': {
              fontSize: '28px',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
