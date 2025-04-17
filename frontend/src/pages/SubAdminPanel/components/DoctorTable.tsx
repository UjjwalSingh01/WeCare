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
import { Menu, MenuItem, Chip, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../../../components/DeleteModal';
import { AlertSnackbar } from '../../../components/AlertSnackbar';
import { useTheme } from '@mui/material/styles';
import { Doctor } from '../Doctor';

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

const DoctorTable: React.FC<{ subAdminDoctors: Doctor[] }> = ({ subAdminDoctors }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    loading: false
  });


  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, doctor: Doctor) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoctor(doctor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoctor(null);
  };

  const handleView = () => {
    if (selectedDoctor) {
      navigate(`/doctors/${selectedDoctor.id}`);
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialog({ ...deleteDialog, open: true });
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDoctor) return;
    
    setDeleteDialog({ ...deleteDialog, loading: true });
    
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/subadmin/deleteDoctor/${selectedDoctor.id}`);
      
      showSnackbar(response.data.message, "success");
      window.location.reload();
      
    } catch (error) {
      showSnackbar('Error deleting doctor', 'error');
      console.error('Error deleting doctor: ', error);
    } finally {
      setDeleteDialog({ open: false, loading: false });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'success' : 'error';
  };

  const getVerificationStatus = (verified: boolean) => {
    return verified ? 'Verified' : 'Not Verified';
  };

  const getVerificationColor = (verified: boolean) => {
    return verified ? 'success' : 'warning';
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 700 }} aria-label="doctors table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Doctor</StyledTableCell>
              <StyledTableCell align="center">License</StyledTableCell>
              <StyledTableCell align="center">Appointments</StyledTableCell>
              <StyledTableCell align="center">Last Appointment</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Verified</StyledTableCell>
              <StyledTableCell align="center">Rating</StyledTableCell>
              <StyledTableCell align="center">Added</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subAdminDoctors
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doctor) => (
              <StyledTableRow key={doctor.id}>
                <StyledTableCell>{doctor.name}</StyledTableCell>
                <StyledTableCell align="center">{doctor.licenseNumber}</StyledTableCell>
                <StyledTableCell align="center">{doctor.totalAppointments}</StyledTableCell>
                <StyledTableCell align="center">{doctor.lastAppointment}</StyledTableCell>
                <StyledTableCell align="center">
                  <Chip 
                    label={doctor.status} 
                    color={getStatusColor(doctor.status)}
                    variant="outlined"
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip 
                    label={getVerificationStatus(doctor.verified)} 
                    color={getVerificationColor(doctor.verified)}
                    variant="outlined"
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  {doctor.rating ? `${doctor.rating}/5` : 'N/A'}
                </StyledTableCell>
                <StyledTableCell align="center">{doctor.added}</StyledTableCell>
                <StyledTableCell align="center">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, doctor)}
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
          count={subAdminDoctors.length}
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
        <MenuItem onClick={handleView}>View Details</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>Delete</MenuItem>
      </Menu>

      <DeleteModal
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Doctor"
        content={
          <>
            <p>This will permanently delete Dr. {selectedDoctor?.name}'s record.</p>
            <p style={{ color: theme.palette.error.main, marginTop: '8px' }}>
              Warning: This action cannot be undone!
            </p>
          </>
        }
        confirmText={deleteDialog.loading ? "Deleting..." : "Confirm Delete"}
        loading={deleteDialog.loading}
      />

      <AlertSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        position={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
};

export default DoctorTable;