import { Box, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// interface PropsType {
//   heading: string;
//   amount: number;
// }

export default function InfoCard({data, heading}: {data: number, heading: string}) {
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
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          padding: 2,
        }}
      >
        <CardContent sx={{ width: '100%' }}>
          <Typography
            gutterBottom
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            {heading}:
            {/* Info Count */}
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              marginTop: 2,
              textAlign: 'center',
              color: 'text.primary',
            }}
          >
            {data}
            {/* Info Details */}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
