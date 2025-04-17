import { 
  Paper,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

// Interface for Appointment Data
export interface AppointmentData {
  month: string;
  count: number;
}

interface AppointmentGraphProps {
  data: AppointmentData[];
}

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));
  
export function AppointmentGraph({ data }: AppointmentGraphProps) {
  const theme = useTheme();

  return (
    <ChartContainer elevation={3}>
      <Typography variant="h5" gutterBottom component="div">
        Monthly Appointments
      </Typography>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="month"
              stroke={theme.palette.text.secondary}
              tickFormatter={(str) => format(parseISO(str), 'MMM')}
            />
            <YAxis stroke={theme.palette.text.secondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
                boxShadow: theme.shadows[3],
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ fill: theme.palette.primary.dark, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}