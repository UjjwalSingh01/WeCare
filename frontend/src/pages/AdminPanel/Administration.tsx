import { Box, Typography, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TablePagination, Chip, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { AlertSnackbar } from '../../components/AlertSnackbar';
import AddAdminModal from '../../components/AddAdminModal';
import { AdminNavbar } from '../../components/Navbar';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.875rem',
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

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'capitalize',
  borderRadius: 4,
  padding: theme.spacing(0.5),
}));


interface Administration {
  id: string;
  name: string;
  doctorUnderManagement: number;
  lastActive: string;
  verifiedBy: string;
  activityStatus: string;
}

const administrations: Administration[] = [
  {
    id: "1",
    name: "Alice Johnson",
    doctorUnderManagement: 15,
    lastActive: "March 20, 2025",
    verifiedBy: "SuperAdmin",
    activityStatus: "Active",
  },
  {
    id: "2",
    name: "Michael Smith",
    doctorUnderManagement: 10,
    lastActive: "March 18, 2025",
    verifiedBy: "SuperAdmin",
    activityStatus: "Inactive",
  },
  {
    id: "3",
    name: "Sophia Williams",
    doctorUnderManagement: 20,
    lastActive: "March 21, 2025",
    verifiedBy: "Admin",
    activityStatus: "Active",
  },
  {
    id: "4",
    name: "Daniel Brown",
    doctorUnderManagement: 8,
    lastActive: "March 19, 2025",
    verifiedBy: "SuperAdmin",
    activityStatus: "Active",
  },
  {
    id: "5",
    name: "Emma Davis",
    doctorUnderManagement: 12,
    lastActive: "March 17, 2025",
    verifiedBy: "Admin",
    activityStatus: "Inactive",
  },
];
  

const Administration: React.FC = () => {
  const theme = useTheme();
  const [admin, setAdmin] = useState<'SUPER_ADMIN' | 'FACILITY_ADMIN'>();
  const [data, setData] = useState<Administration[]>(administrations);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState<Administration | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, admin: Administration) => {
    setAnchorEl(event.currentTarget);
    setSelectedAdmin(admin);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAdmin(null);
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;
    try {
      // Add edit logic here
      showSnackbar(`Editing admin: ${selectedAdmin.name}`, 'info');
      handleMenuClose();
    } catch (error) {
      showSnackbar('Error editing admin', 'error');
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedAdmin) return;
    try {
      const newStatus = selectedAdmin.activityStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/admin/activityUpdate/${selectedAdmin.id}`, 
        { activityStatus: newStatus },
        { withCredentials: true }
      );
      
      setData(data.map(admin => 
        admin.id === selectedAdmin.id 
          ? { ...admin, activityStatus: newStatus } 
          : admin
      ));
      showSnackbar(`Status updated to ${newStatus}`, 'success');
      handleMenuClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Backend error:', error.response?.data);
        showSnackbar(`${error.response?.data}`, "error");
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    const fetchAdministrationData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/admin/administration`, {
          withCredentials: true,
        });

        const user = JSON.parse(localStorage.getItem('User') || '{}');
        if(user.role === 'SUPER_ADMIN') setAdmin('SUPER_ADMIN');
        else if (user.role === 'FACILITY_ADMIN') setAdmin('FACILITY_ADMIN');

        showSnackbar(`${response.data.message}`, "success");
        setData(response.data.data);

      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Backend error:', error.response?.data);
          showSnackbar(`${error.response?.data}`, "error");
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };
    fetchAdministrationData();
  }, []);

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'error';
  };
  

  return (
    <>
      <AdminNavbar userRole={admin} />
      <Box sx={{ p: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          p: 2,
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: theme.shadows[1],
        }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Administrators Management ({data.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <AddAdminModal />
          </Box>
        </Box>

        <Paper sx={{ 
          width: '100%', 
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
            <Table stickyHeader aria-label="administrators table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="center">Doctors Managed</StyledTableCell>
                  <StyledTableCell align="center">Last Active</StyledTableCell>
                  <StyledTableCell align="center">Verified By</StyledTableCell>
                  <StyledTableCell align="center">IsActive</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow hover key={row.id}>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell align="center">{row.doctorUnderManagement}</StyledTableCell>
                      <StyledTableCell align="center">{row.lastActive}</StyledTableCell>
                      {/* <StyledTableCell align="center">
                        <StatusChip 
                          label={row.permissions} 
                          color={getPermissionColor(row.permissions)}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: '20px' }}
                        />
                      </StyledTableCell> */}
                      <StyledTableCell align="center">{row.verifiedBy}</StyledTableCell>
                      <StyledTableCell align="center">
                        <StatusChip 
                          label={row.activityStatus} 
                          color={getStatusColor(row.activityStatus)}
                          variant="filled"
                          size="small"
                          sx={{ borderRadius: '20px' }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, row)}
                          size="small"
                          sx={{
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
          />
        </Paper>

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
          <MenuItem onClick={handleEditAdmin}>Edit</MenuItem>
          <MenuItem onClick={handleToggleStatus}>
            {selectedAdmin?.activityStatus === 'Active' ? 'Deactivate' : 'Activate'}
          </MenuItem>
        </Menu>

        <AlertSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          position={{ vertical: 'bottom', horizontal: 'right' }}
        />
      </Box>
    </>
  );
};

export default Administration;