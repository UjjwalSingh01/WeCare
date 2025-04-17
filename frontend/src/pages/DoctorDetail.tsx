import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  useTheme,
  useMediaQuery,
  Link,
  Divider
} from "@mui/material";
import axios from "axios";
import {
  LocationOn,
  LocalHospital,
  Work,
  Phone,
  Email,
  Map
} from "@mui/icons-material";

interface DoctorDetails {
  fullName: string;
  about: string;
  specialties: string[];
  hospitalAffiliations: string[];
  latitude: number;
  longitude: number;
  officePhone: string;
  email: string;
  address: string;
  rating: number;
  managedBy: {
    fullName: string;
    email: string;
  };
}

const DoctorDetailPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [doctor, setDoctor] = useState<DoctorDetails>({
    about: "The triple bar or tribar, ≡, is a symbol with multiple meanings.",
    fullName: "Dr. Mentor Mount",
    email: "doctor@gmail.com",
    specialties: ["General Medicine"],
    hospitalAffiliations: ["Community Hospital"],
    latitude: 1.1,
    longitude: 2.2,
    address: "123 Example St, Example City",
    officePhone: "123-456-7890",
    rating: 2,
    managedBy: {
      fullName: "Koi Hai",
      email: 'koihai@gmail.com'
    },
  });

  const location = useLocation();
  const id = location.state;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/doctor/getDoctor/${id}`);
        setDoctor(response.data.doctor);
      } catch (error) {
        console.error("Error in Fetching Doctor Details: ", error);
      }
    };

    fetchDoctor();
  }, [id]);

  const InfoSection = ({ icon, title, children }: any) => (
    <Paper elevation={3} sx={{ 
      p: 3, 
      mb: 4, 
      borderRadius: 4,
      width: '100%',
      maxWidth: 800
    }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {icon}
        <Typography variant="h5" sx={{ ml: 1.5, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      p: isMobile ? 2 : 4
    }}>
      <Box sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: isMobile ? 2 : 6,
        mb: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header Section */}
        <Paper elevation={4} sx={{
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
          color: "white",
          mb: 4,
          width: '100%',
          maxWidth: 800
        }}>
          <Typography variant="h3" sx={{
            fontWeight: 700,
            textAlign: "center",
            fontSize: isMobile ? "2.5rem" : "3.5rem"
          }}>
            {doctor.fullName}
          </Typography>
          <Typography variant="h6" sx={{
            textAlign: "center",
            mt: 2,
            opacity: 0.9
          }}>
            Specialist in {doctor.specialties.join(", ")}
          </Typography>
        </Paper>

        {/* Main Content Container */}
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          width: '100%',
          maxWidth: 1200,
          justifyContent: 'center'
        }}>
          {/* Left Column */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: 800
          }}>
            <InfoSection
              icon={<Work fontSize="large" />}
              title="About & Expertise"
            >
              <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                {doctor.about}
              </Typography>
            </InfoSection>

            <InfoSection
              icon={<LocalHospital fontSize="large" />}
              title="Hospital Affiliations"
            >
              <Box sx={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: 1,
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                {doctor.hospitalAffiliations.map((hospital, index) => (
                  <Chip
                    key={index}
                    label={hospital}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      fontSize: "1rem", 
                      p: 1.5,
                      mb: 1 
                    }}
                  />
                ))}
              </Box>
            </InfoSection>
          </Box>

          {/* Right Column */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: 400
          }}>
            <InfoSection
              icon={<LocationOn fontSize="large" />}
              title="Location"
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                {doctor.address}
              </Typography>
              <Link
                href={`https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                <Map sx={{ mr: 1 }} />
                Open in Maps
              </Link>
            </InfoSection>

            <InfoSection
              icon={<Phone fontSize="large" />}
              title="Contact Information"
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email:
                </Typography>
                <Link
                  href={`mailto:${doctor.email}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.primary",
                    textDecoration: "none",
                    "&:hover": { color: "primary.main" }
                  }}
                >
                  <Email sx={{ mr: 1, fontSize: "1.2rem" }} />
                  {doctor.email}
                </Link>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Phone Numbers:
                </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1
                    }}
                  >
                    <Phone sx={{ mr: 1, fontSize: "1.2rem" }} />
                    <Link
                      href={`tel:${doctor.officePhone}`}
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" }
                      }}
                    >
                      {doctor.officePhone}
                    </Link>
                  </Box>
              </Box>
            </InfoSection>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorDetailPage;