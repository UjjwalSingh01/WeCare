import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MonthDetails } from '../pages/AdminPanel';

export default function MonthInfoCard({ data }: { data: MonthDetails }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        padding: { xs: 2, sm: 4, md: 2 },
      }}
    >
      <Card
        sx={{
          width: { xs: '100%', sm: '90%', md: '80%', lg: '90%' },
          maxWidth: 600,
          borderRadius: 4,
          boxShadow: 6,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
          border: `2px solid ${theme.palette.background.default}`,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 10px 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderColor: theme.palette.primary.main,
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
          padding: 2,
          position: 'relative',
          height: '100%',
        }}
      >
        <CardContent sx={{ width: '100%' }}>
          {/* Appointment and Current Month in the Same Line */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              // width: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.00rem', sm: '1.25rem', md: '2rem' },
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                marginRight: 2, // Space between the label and the value
              }}
            >
              Monthly Appointment:
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {data.currentMonthAppointments}
            </Typography>
          </Box>
        </CardContent>

        {/* Last Month Info - Aligned Bottom Right */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
            bottom: 16,
            right: 16,
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '0.75rem', sm: '1.00rem', md: '1.25rem' },
              fontWeight: 'normal',
              color: 'text.secondary',
              marginRight: 1,
            }}
          >
            Last Month Appointment:
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: { xs: '0.75rem', sm: '1.00rem', md: '1.25rem' },
              fontWeight: 500,
              color: 'text.secondary',
            }}
          >
            {data.lastMonthAppointments}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
