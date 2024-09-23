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
  const [page, setPage] = useState(0); // State for the current page
  const rowsPerPage = 10; // Set rows per page to 10

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Patient</StyledTableCell>
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
              <StyledTableCell align="center">{appointment.date}</StyledTableCell>
              <StyledTableCell align="center">{appointment.time}</StyledTableCell>
              <StyledTableCell align="center"><ReasonPopover reason={appointment.reason} /></StyledTableCell>
              <StyledTableCell align="center">{appointment.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination Component */}
      <TablePagination
        component="div"
        count={appointments.length}
        rowsPerPage={rowsPerPage} // Fixed rows per page to 10
        page={page}
        onPageChange={handleChangePage}
        // Removed rowsPerPageChange handler to fix rows per page
        rowsPerPageOptions={[]} // Hide rows per page options
      />
    </TableContainer>
  );
}
