import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface DoctorDetails {
  fullname: string;
  about: string;
  specializations: string[];
  hospitals: string[];
  latitude: number;
  longitude: number;
  phoneNumber: string[];
  email: string;
  address: string;
  rating: number;
  admin: string;
}

const DoctorDetailPage = () => {
  const [doctor, setDoctor] = useState<DoctorDetails>({
    about: "The triple bar or tribar, ≡, is a symbol with multiple meanings.",
    fullname: "Dr. Mentor Mount",
    email: "doctor@gmail.com",
    specializations: ["General Medicine"],
    hospitals: ["Community Hospital"],
    latitude: 1.1,
    longitude: 2.2,
    address: "123 Example St, Example City",
    phoneNumber: ["123-456-7890"],
    rating: 2,
    admin: "hai koi",
  });

  const location = useLocation();
  const id = location.state;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/doctor/get-doctor/${id}`
        );
        setDoctor(response.data.doctor);
        console.log(response.data.doctor);
      } catch (error) {
        console.error("Error in Fetching Doctor Details: ", error);
      }
    };

    fetchDoctor();
  }, []);

  return (
    <div className="h-full bg-blue-800 flex items-center justify-center p-4">
      <div className="bg-blue-600 text-white p-16 m-14 rounded-lg shadow-lg w-full h-full">
        <h1 className="text-5xl font-bold text-center mb-6 border-b border-white pb-2">
          {doctor.fullname}
        </h1>
        <div className="flex flex-col md:flex-row items-center px-10 my-16">
          <div className="w-3/5">
            <h2 className="text-4xl font-semibold">About</h2>
            <hr className="border-t border-gray-400 my-2" />
            <p className="text-md lg:text-xl leading-relaxed">{doctor.about}</p>
          </div>
        </div>

        <div className="mt-10 px-10">
          <h2 className="text-4xl font-semibold">Specialization</h2>
          <hr className="border-t border-gray-400 my-2" />
          {doctor.specializations.map((spec, index) => (
            <span key={index} className="text-md lg:text-xl leading-relaxed">
              {spec}&nbsp;&nbsp;,&nbsp;&nbsp;
            </span>
          ))}
        </div>

        <div className="mt-10 px-10">
          <h2 className="text-4xl font-semibold">Hospital</h2>
          <hr className="border-t border-gray-400 my-2" />
          {doctor.hospitals.map((hospital, index) => (
            <span key={index} className="text-md lg:text-xl leading-relaxed">
              {hospital}&nbsp;&nbsp;,&nbsp;&nbsp;
            </span>
          ))}
        </div>

        <div className="mt-10 px-10">
          <h2 className="text-4xl font-semibold">Location</h2>
          <hr className="border-t border-gray-400 my-2" />
          <p className="text-md lg:text-xl leading-relaxed">
            {doctor.address},&nbsp;
            <a
              href={`https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline"
            >
              Open in Google Maps
            </a>
          </p>
        </div>

        <div className="mt-10 px-10">
          <h2 className="text-4xl font-semibold">Contact</h2>
          <hr className="border-t border-gray-400 my-2" />
          <p className="text-md lg:text-xl leading-relaxed">Email : {doctor.email}</p>
          Phone :{" "}
          {doctor.phoneNumber.map((phone, index) => (
            <span key={index} className="text-md lg:text-xl leading-relaxed">
              {phone}&nbsp;&nbsp;,&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
