// import {
//     Pagination,
//     PaginationContent,
//     PaginationEllipsis,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
//   } from "@/components/ui/pagination"

// import React, { useState } from "react";
// import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { X } from "lucide-react"; // Import X icon for close button

// // Define the Patient interface
// interface Patient {
//   id: string;
//   _id?: string;
//   name: string;
//   email: string;
//   age: number;
//   phone: string;
//   address: string;
//   registrationDate: string;
// }

// const Doctor = () => {
//   const [patients, setPatients] = React.useState<Patient[]>([]);
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [showGraph, setShowGraph] = useState(false);
//   const [viewType, setViewType] = useState<'week' | 'month'>('week');

//   // Filter patients based on search term
//   const filteredPatients = React.useMemo(() => {
//     return patients.filter((patient) => {
//       const searchValue = searchTerm.toLowerCase();
//       return (
//         patient.name.toLowerCase().includes(searchValue) ||
//         patient.email.toLowerCase().includes(searchValue) ||
//         patient.address.toLowerCase().includes(searchValue)
//       );
//     });
//   }, [patients, searchTerm]);

//   // Process patient data for the graph
//   const graphData = React.useMemo(() => {
//     if (viewType === 'week') {
//       const dayCount = new Array(7).fill(0);
//       const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
//       patients.forEach(patient => {
//         const date = new Date(patient.registrationDate);
//         const dayIndex = date.getDay();
//         dayCount[dayIndex]++;
//       });

//       return dayNames.map((day, index) => ({
//         label: day.slice(0, 3),
//         patients: dayCount[index]
//       }));
//     } else {
//       // For monthly view
//       const today = new Date();
//       const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
//       const dateCount: { [key: string]: number } = {};

//       // Initialize all dates in the last 30 days
//       for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
//         const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         dateCount[dateStr] = 0;
//       }

//       // Count patients for each date
//       patients.forEach(patient => {
//         const date = new Date(patient.registrationDate);
//         if (date >= thirtyDaysAgo && date <= today) {
//           const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//           dateCount[dateStr] = (dateCount[dateStr] || 0) + 1;
//         }
//       });

//       return Object.entries(dateCount).map(([label, patients]) => ({
//         label,
//         patients
//       }));
//     }
//   }, [patients, viewType]);

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   // Toggle graph view type
//   const toggleViewType = (type: 'week' | 'month') => {
//     setViewType(type);
//     setShowGraph(true);
//   };

//   // Fetch patients from the API on component mount
//   React.useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/patients");
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setPatients(data);
//       } catch (error) {
//         console.error("Failed to fetch patient data:", error);
//       }
//     };

//     fetchPatients();
//   }, []);

//   return (
//     <div className="p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-center font-bold text-2xl">Doctor Portal</CardTitle>
//         </CardHeader>
        
//         <CardContent>
//           <div className="mb-4 flex justify-center gap-4">
//             <input
//               type="text"
//               placeholder="Search patients..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="w-full max-w-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="flex gap-2">
//               <Button
//                 variant={viewType === 'week' && showGraph ? 'default' : 'outline'}
//                 onClick={() => {
//                   if (viewType === 'week' && showGraph) {
//                     setShowGraph(false);
//                   } else {
//                     toggleViewType('week');
//                   }
//                 }}
//               >
//                 {viewType === 'week' && showGraph ? 'Hide Weekly View' : 'Weekly View'}
//               </Button>
//               <Button
//                 variant={viewType === 'month' && showGraph ? 'default' : 'outline'}
//                 onClick={() => {
//                   if (viewType === 'month' && showGraph) {
//                     setShowGraph(false);
//                   } else {
//                     toggleViewType('month');
//                   }
//                 }}
//               >
//                 {viewType === 'month' && showGraph ? 'Hide Monthly View' : 'Past Month'}
//               </Button>
//             </div>
//           </div>

//           {showGraph && (
//             <Card className="mb-8">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <div>
//                   <CardTitle>
//                     Patient Registrations - {viewType === 'week' ? 'Weekly View' : 'Past Month'}
//                   </CardTitle>
//                   <CardDescription>
//                     {viewType === 'week' 
//                       ? 'Distribution of registrations across weekdays'
//                       : 'Daily registrations for the past 30 days'
//                     }
//                   </CardDescription>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowGraph(false)}
//                   className="h-8 w-8"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[400px] w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={graphData}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                       <XAxis 
//                         dataKey="label"
//                         tickLine={false}
//                         axisLine={false}
//                         angle={viewType === 'month' ? -45 : 0}
//                         textAnchor={viewType === 'month' ? 'end' : 'middle'}
//                         height={viewType === 'month' ? 80 : 60}
//                       />
//                       <Tooltip
//                         contentStyle={{ 
//                           backgroundColor: 'white',
//                           border: '1px solid #e2e8f0',
//                           borderRadius: '6px',
//                           padding: '8px'
//                         }}
//                       />
//                       <Bar
//                         dataKey="patients"
//                         fill="#2A9D8F"
//                         radius={[4, 4, 0, 0]}
//                         barSize={viewType === 'month' ? 15 : 40}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <caption className="p-4 text-sm text-gray-500">
//                 {filteredPatients.length === 0
//                   ? "No matching patients found"
//                   : "A list of your recent Patient Details."}
//               </caption>
              
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="p-4 text-left border">Patient Name</th>
//                   <th className="p-4 text-left border">Email</th>
//                   <th className="p-4 text-left border">Age</th>
//                   <th className="p-4 text-left border">Phone</th>
//                   <th className="p-4 text-left border">Address</th>
//                   <th className="p-4 text-left border">Registration Date</th>
//                 </tr>
//               </thead>
              
//               <tbody>
//                 {filteredPatients.map((patient, index) => (
//                   <tr 
//                     key={patient.id || index}
//                     className="border-b hover:bg-gray-50"
//                   >
//                     <td className="p-4 border">{patient.name}</td>
//                     <td className="p-4 border">{patient.email}</td>
//                     <td className="p-4 border">{patient.age}</td>
//                     <td className="p-4 border">{patient.phone}</td>
//                     <td className="p-4 border">{patient.address}</td>
//                     <td className="p-4 border">
//                       {new Date(patient.registrationDate).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//       <Pagination>
//       <PaginationContent>
//         <PaginationItem>
//           <PaginationPrevious href="#" />
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationLink href="#">1</PaginationLink>
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationLink href="#" isActive>
//             2
//           </PaginationLink>
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationLink href="#">3</PaginationLink>
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationEllipsis />
//         </PaginationItem>
//         <PaginationItem>
//           <PaginationNext href="#" />
//         </PaginationItem>
//       </PaginationContent>
//     </Pagination>
//     </div>
//   );
// };

// export default Doctor;


















import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import React, { useState } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";

interface Patient {
  id: string;
  _id?: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  registrationDate: string;
}

const Doctor = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showGraph, setShowGraph] = useState(false);
  const [viewType, setViewType] = useState<'week' | 'month'>('week');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  // Filter patients based on search term
  const filteredPatients = React.useMemo(() => {
    return patients.filter((patient) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchValue) ||
        patient.email.toLowerCase().includes(searchValue) ||
        patient.address.toLowerCase().includes(searchValue)
      );
    });
  }, [patients, searchTerm]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Generate page numbers for pagination
  const pageNumbers = React.useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Process patient data for the graph
  const graphData = React.useMemo(() => {
    if (viewType === 'week') {
      const dayCount = new Array(7).fill(0);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      patients.forEach(patient => {
        const date = new Date(patient.registrationDate);
        const dayIndex = date.getDay();
        dayCount[dayIndex]++;
      });

      return dayNames.map((day, index) => ({
        label: day.slice(0, 3),
        patients: dayCount[index]
      }));
    } else {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
      const dateCount: { [key: string]: number } = {};

      for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateCount[dateStr] = 0;
      }

      patients.forEach(patient => {
        const date = new Date(patient.registrationDate);
        if (date >= thirtyDaysAgo && date <= today) {
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dateCount[dateStr] = (dateCount[dateStr] || 0) + 1;
        }
      });

      return Object.entries(dateCount).map(([label, patients]) => ({
        label,
        patients
      }));
    }
  }, [patients, viewType]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const toggleViewType = (type: 'week' | 'month') => {
    setViewType(type);
    setShowGraph(true);
  };

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/patients");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center font-bold text-2xl">Doctor Portal</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex justify-center gap-4">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full max-w-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <Button
                variant={viewType === 'week' && showGraph ? 'default' : 'outline'}
                onClick={() => {
                  if (viewType === 'week' && showGraph) {
                    setShowGraph(false);
                  } else {
                    toggleViewType('week');
                  }
                }}
              >
                {viewType === 'week' && showGraph ? 'Hide Weekly View' : 'Weekly View'}
              </Button>
              <Button
                variant={viewType === 'month' && showGraph ? 'default' : 'outline'}
                onClick={() => {
                  if (viewType === 'month' && showGraph) {
                    setShowGraph(false);
                  } else {
                    toggleViewType('month');
                  }
                }}
              >
                {viewType === 'month' && showGraph ? 'Hide Monthly View' : 'Past Month'}
              </Button>
            </div>
          </div>

          {showGraph && (
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>
                    Patient Registrations - {viewType === 'week' ? 'Weekly View' : 'Past Month'}
                  </CardTitle>
                  <CardDescription>
                    {viewType === 'week' 
                      ? 'Distribution of registrations across weekdays'
                      : 'Daily registrations for the past 30 days'
                    }
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowGraph(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={graphData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        angle={viewType === 'month' ? -45 : 0}
                        textAnchor={viewType === 'month' ? 'end' : 'middle'}
                        height={viewType === 'month' ? 80 : 60}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px'
                        }}
                      />
                      <Bar
                        dataKey="patients"
                        fill="#2A9D8F"
                        radius={[4, 4, 0, 0]}
                        barSize={viewType === 'month' ? 15 : 40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <caption className="p-4 text-sm text-gray-500">
                {filteredPatients.length === 0
                  ? "No matching patients found"
                  : `Showing ${indexOfFirstPatient + 1} to ${Math.min(indexOfLastPatient, filteredPatients.length)} of ${filteredPatients.length} patients`}
              </caption>
              
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left border">Patient Name</th>
                  <th className="p-4 text-left border">Email</th>
                  <th className="p-4 text-left border">Age</th>
                  <th className="p-4 text-left border">Phone</th>
                  <th className="p-4 text-left border">Address</th>
                  <th className="p-4 text-left border">Registration Date</th>
                </tr>
              </thead>
              
              <tbody>
                {currentPatients.map((patient, index) => (
                  <tr 
                    key={patient.id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 border">{patient.name}</td>
                    <td className="p-4 border">{patient.email}</td>
                    <td className="p-4 border">{patient.age}</td>
                    <td className="p-4 border">{patient.phone}</td>
                    <td className="p-4 border">{patient.address}</td>
                    <td className="p-4 border">
                      {new Date(patient.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map((number) => (
                    <PaginationItem key={number}>
                      <PaginationLink
                        onClick={() => handlePageChange(number)}
                        isActive={currentPage === number}
                        className="cursor-pointer"
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
                <PaginationEllipsis/>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Doctor;