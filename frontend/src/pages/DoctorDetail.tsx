import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface DoctorDetails {
  name: string;
  image: string;
  about: string;
  specialization: string;
  hospital: string;
  location: string;
  contact: string;
}

const DoctorDetailPage = () => {
    const [doctor, setDoctor] = useState<DoctorDetails>({
        name: "Dr. Mentor Mount",
        image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", // Replace with the actual image URL
        about: "The triple bar or tribar, ≡, is a symbol with multiple, context-dependent meanings indicating equivalence of two different things. Its main uses are in mathematics and logic. It has the appearance of an equals sign (=) with a third line. This article contains special characters.",
        specialization: "The triple bar or tribar, ≡, is a symbol with multiple, context-dependent meanings indicating equivalence of two different things.",
        hospital: "The triple bar or tribar, ≡, is a symbol with multiple, context-dependent meanings indicating equivalence of two different things.",
        location: "The triple bar or tribar, ≡, is a symbol with multiple, context-dependent meanings indicating equivalence of two different things.",
        contact: "The triple bar or tribar, ≡, is a symbol with multiple, context-dependent meanings"
    })

    const location = useLocation();
    const id = location.state;

    // useEffect(() => {
    //     const fetchDoctor = async () => {
    //         try {
    //             const doctorDetails = await axios.get(`/${id}`)

    //             setDoctor(doctorDetails.data.doctor);

    //         } catch (error) {
    //             console.error('Error in Fetching Doctor Details: ', error)
    //         }
    //     }

    //     fetchDoctor();
    // }, [])

  return (
    <div className="h-full bg-blue-800 flex items-center justify-center p-4">
      <div className="bg-blue-600 text-white p-16 m-14 rounded-lg shadow-lg w-full h-full">
        <h1 className="text-5xl font-bold text-center mb-6 border-b border-white pb-2">
          {doctor.name}
        </h1>
        <div className="flex flex-col md:flex-row items-center px-10 my-16">
          <div className="w-2/5 flex justify-center items-center">
            <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 md:mb-0 md:mr-6"
            />
          </div>
          <div className="w-3/5">
            <h2 className="text-4xl font-semibold">About</h2>
            <hr className="border-t border-gray-400 my-2" />
            <p className="text-md lg:text-xl leading-relaxed">{doctor.about}</p>
          </div>
        </div>
        
        <div className="mt-10 px-10">
            <h2 className="text-4xl font-semibold">Specialization</h2>
            <hr className="border-t border-gray-400 my-2" />
            <p className="text-md lg:text-xl leading-relaxed">{doctor.specialization}</p>
        </div>
        <div className="mt-10 px-10">
            <h2 className="text-4xl font-semibold">Hospital</h2>
            <hr className="border-t border-gray-400 my-2" />
            <p className="text-md lg:text-xl leading-relaxed">{doctor.hospital}</p>
        </div>
        <div className="mt-10 px-10">
            <h2 className="text-4xl font-semibold">Location</h2>
            <hr className="border-t border-gray-400 my-2" />
            <p className="text-md lg:text-xl leading-relaxed">{doctor.location}</p>
        </div>
        <div className="mt-10 px-10">
            <h2 className="text-4xl font-semibold">Contact</h2>
            <hr className="border-t border-gray-400 my-2" />
            <p className="text-md lg:text-xl leading-relaxed">{doctor.contact}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
