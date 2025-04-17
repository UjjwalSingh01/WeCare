import { 
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    useTheme,
    styled
  } from '@mui/material';
  import { format } from 'date-fns';
  
  interface RecentAppointment {
    id: string;
    patientName: string;
    doctorName: string;
    scheduledAt: Date;
    status: string;
  }
  
  interface RecentAppointmentsProps {
    appointments: RecentAppointment[];
  }
  
  const AppointmentItem = styled(ListItem)(({ theme }) => ({
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateX(4px)',
    },
  }));
  
  export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
    const theme = useTheme();
  
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'warning';
        case 'confirmed':
          return 'success';
        case 'cancelled':
          return 'error';
        default:
          return 'default';
      }
    };
  
    return (
      <Paper elevation={3} sx={{ 
        p: 3,
        height: 500, // Fixed height for the container
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="h5" gutterBottom component="div">
          Recent Appointments
        </Typography>
        <List 
          dense={false}
          sx={{
            flex: 1, // Takes remaining space
            overflowY: 'auto', // Enable vertical scrolling
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[100],
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[400],
              borderRadius: '4px',
            },
          }}
        >
          {appointments.map((appointment) => (
            <AppointmentItem 
              key={appointment.id}
              divider
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                minWidth: 350, // Prevent width shrinking
              }}
            >
              <ListItemText
                primary={appointment.patientName}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      With {appointment.doctorName}
                    </Typography>
                    <br />
                    {format(appointment.scheduledAt, 'MMM dd, yyyy - hh:mm a')}
                  </>
                }
              />
              <Chip 
                label={appointment.status}
                color={getStatusColor(appointment.status)}
                variant="outlined"
                sx={{ 
                  minWidth: 100,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  fontWeight: 'bold',
                  flexShrink: 0, // Prevent chip from shrinking
                }}
              />
            </AppointmentItem>
          ))}
        </List>
      </Paper>
    );
  }