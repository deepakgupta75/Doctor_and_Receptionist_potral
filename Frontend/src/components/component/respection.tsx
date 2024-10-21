import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";


import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



interface ValidationError {
  field: string;
  message: string;
}


const validatePatient = (
  patient: Partial<Patient>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!patient.name || patient.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters long'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patient.email || !emailRegex.test(patient.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }

  // Age validation
  if (!patient.age || patient.age < 0 || patient.age > 150) {
    errors.push({
      field: 'age',
      message: 'Age must be between 0 and 150'
    });
  }

  // Phone validation (assuming 10 digits)
  const phoneRegex = /^\d{10}$/;
  if (!patient.phone || !phoneRegex.test(patient.phone)) {
    errors.push({
      field: 'phone',
      message: 'Phone number must be 10 digits'
    });
  }

  // Address validation
  if (!patient.address || patient.address.trim().length < 5) {
    errors.push({
      field: 'address',
      message: 'Address must be at least 5 characters long'
    });
  }

  // Registration date validation
  if (!patient.registrationDate) {
    errors.push({
      field: 'registrationDate',
      message: 'Please select a registration date'
    });
  }

  return errors;
};


// Define the Patient interface
interface Patient {
  id: string;
  _id: string; // Optional _id for MongoDB

  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  registrationDate: string;
}

const Respection = () => {
  const [date, setDate] = React.useState<Date>();
  const [patients, setPatients] = React.useState<Patient[]>([]);

  
  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([]);
  const [updateValidationErrors, setUpdateValidationErrors] = React.useState<ValidationError[]>([]);


  
  // Add pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [patientsPerPage] = React.useState(5);

  // Form state for new patient
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [age, setAge] = React.useState<number | "">("");
  const [phone, setPhone] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");

  const [searchTerm, setSearchTerm] = React.useState<string>("");


   // Filter patients based on search term
   const filteredPatients = React.useMemo(() => {
    return patients.filter((patient) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchValue) ||
        patient.email.toLowerCase().includes(searchValue) ||
        // patient.phone.includes(searchValue) ||
        patient.address.toLowerCase().includes(searchValue)
      );
    });
  }, [patients, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Fetch patients from the API on component mount
  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/patients");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPatients(data); // Update the state with fetched data
      } catch (error) {
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchPatients();
  }, []);

  


  const handleAddPatient = async () => {
    setValidationErrors([]);

    if (!name || !email || !age || !phone || !address || !date) 
      {
      alert("Please fill out all fields.");
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in. Please login first.");
      // Optionally redirect to login page
      return;
    }
  
    const newPatient = {
      name,
      email,
      age: Number(age),
      phone,
      address,
      registrationDate: date?.toISOString(),
    };


     // Validate the patient data
     const errors = validatePatient(newPatient);
     if (errors.length > 0) {
       setValidationErrors(errors);
       return;
     }
  
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Make sure "Bearer " prefix is included
        },
        body: JSON.stringify(newPatient),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem('token'); // Clear invalid token
          // Optionally redirect to login page
          return;
        }
        throw new Error("Failed to add patient: " + errorData);
      }
  
      const addedPatient = await response.json();
      setPatients((prevPatients) => [...prevPatients, addedPatient]);
  
      // Clear form after successful submission
      setName("");
      setEmail("");
      setAge("");
      setPhone("");
      setAddress("");
      setDate(undefined);
      setValidationErrors([]);

    } catch (error) {
      console.error("Error adding patient:", error);
      // alert(error.message);
    }
  };



  const handleDeletePatient = async (patientId: string) => {
    if (!patientId) {
      console.error("Patient ID is undefined");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You are not logged in. Please login first.");
      return;
    }

    try {
      console.log("Deleting patient with ID:", patientId); // Debug log

      const response = await fetch(`http://localhost:5000/api/patients/${patientId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData); // Debug log
        
        if (response.status === 401) {
          alert("Your session has expired. Please login again.");
          localStorage.removeItem('token');
          return;
        }
        throw new Error(`Failed to delete patient: ${errorData}`);
      }

      // Remove the deleted patient from the state
      setPatients(prevPatients => 
        prevPatients.filter(patient => patient._id !== patientId)
      );

      alert("Patient deleted successfully!");
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient. Please try again.");
    }
  };
  
  
   // Add states for editing
   const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
   const [editingPatient, setEditingPatient] = React.useState<Patient | null>(null);
   const [editName, setEditName] = React.useState("");
   const [editEmail, setEditEmail] = React.useState("");
   const [editAge, setEditAge] = React.useState<number | "">();
   const [editPhone, setEditPhone] = React.useState("");
   const [editAddress, setEditAddress] = React.useState("");
   const [editDate, setEditDate] = React.useState<Date>();
 
   // Function to handle edit button click
   const handleEditClick = (patient: Patient) => {
     setEditingPatient(patient);
     setEditName(patient.name);
     setEditEmail(patient.email);
     setEditAge(patient.age);
     setEditPhone(patient.phone);
     setEditAddress(patient.address);
     setEditDate(new Date(patient.registrationDate));
     setIsEditDialogOpen(true);
   };
 
   // Function to update patient details
   const handleUpdatePatient = async () => {
     if (!editingPatient || !editName || !editEmail || !editAge || !editPhone || !editAddress || !editDate) {
       alert("Please fill out all fields.");
       return;
     }
 
     const token = localStorage.getItem('token');
     if (!token) {
       alert("You are not logged in. Please login first.");
       return;
     }
 
     const updatedPatient = {
       name: editName,
       email: editEmail,
       age: Number(editAge),
       phone: editPhone,
       address: editAddress,
       registrationDate: editDate.toISOString(),
     };



     // Validate the updated patient data
    const errors = validatePatient(updatedPatient);
    if (errors.length > 0) {
      setUpdateValidationErrors(errors);
      return;
    }
 
     try {
       const response = await fetch(`http://localhost:5000/api/patients/${editingPatient._id}`, {
         method: "PUT",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`,
         },
         body: JSON.stringify(updatedPatient),
       });
 
       if (!response.ok) {
         if (response.status === 401) {
           alert("Your session has expired. Please login again.");
           localStorage.removeItem('token');
           return;
         }
         throw new Error("Failed to update patient");
       }
 
       const updatedPatientData = await response.json();
 
       // Update the patients state with the edited patient
       setPatients(prevPatients =>
         prevPatients.map(patient =>
           patient._id === editingPatient._id ? updatedPatientData : patient
         )
       );
 
       // Close the dialog and reset editing states
       setUpdateValidationErrors([]);

       setIsEditDialogOpen(false);
       setEditingPatient(null);

        // Clear edit form states
    setEditName("");
    setEditEmail("");
    setEditAge("");
    setEditPhone("");
    setEditAddress("");
    setEditDate(undefined);
       alert("Patient updated successfully!");
     } catch (error) {
       console.error("Error updating patient:", error);
       alert("Failed to update patient. Please try again.");
     }
   };
 
  

    // Calculate pagination values
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  
  
  return (
    <>
      <div className="flex justify-center items-center min-h-screen ">
        <div className="w-full max-w-4xl mx-auto p-6 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6">This is Reception Portal</h1>
          <div className="flex justify-between gap-2">
          <Input 
              id="search" 
              type="text" 
              className="w-80" 
              placeholder="Search Patient"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Patients</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Patients Details</DialogTitle>
                  <DialogDescription>  {/* Add this component */}
        Fill in the patient information below to add a new patient record.
      </DialogDescription>

                </DialogHeader>
                {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {validationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
              )}




                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name :
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email :
                    </Label>
                    <Input
                      id="email"
                      className="col-span-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">
                      Age :
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      className="col-span-3"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone :
                    </Label>
                    <Input
                      id="phone"
                      className="col-span-3"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address :
                    </Label>
                    <Textarea
                      id="address"
                      className="col-span-3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="registrationDate" className="text-right">
                      Registration:
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddPatient}>
                    Save Patient
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table className="w-full mt-6">
          <TableCaption className="text-center">
          {filteredPatients.length === 0 
                ? "No matching patients found" 
                : `Showing ${indexOfFirstPatient + 1} to ${Math.min(indexOfLastPatient, filteredPatients.length)} of ${filteredPatients.length} patients`}
            </TableCaption>            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {currentPatients.map((patient, index) => (
                <TableRow key={patient.id  || index}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{format(new Date(patient.registrationDate), "PPP")}</TableCell>
   {/* Add Edit Dialog */}
   <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Patient Details</DialogTitle>
              <DialogDescription>
                Update the patient information below.
              </DialogDescription>
            </DialogHeader>
            {updateValidationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {updateValidationErrors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name :
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email :
                </Label>
                <Input
                  id="edit-email"
                  className="col-span-3"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-age" className="text-right">
                  Age :
                </Label>
                <Input
                  id="edit-age"
                  type="number"
                  className="col-span-3"
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone :
                </Label>
                <Input
                  id="edit-phone"
                  className="col-span-3"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">
                  Address :
                </Label>
                <Textarea
                  id="edit-address"
                  className="col-span-3"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-registrationDate" className="text-right">
                  Registration:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !editDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editDate ? format(editDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editDate}
                      onSelect={setEditDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleUpdatePatient}>
                Update Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update the edit button in the table */}
        <TableCell>
          <div className="flex items-center space-x-4">
            <button onClick={() => handleEditClick(patient)}>
              <img
                src="/edit.png"
                alt="Edit"
                className="w-6 h-6 cursor-pointer"
              />
            </button>
             
             <AlertDialog>
      <AlertDialogTrigger>
        <img
          src="/delet.png"
          alt="Delete"
          className="w-6 h-6 cursor-pointer"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your patient's details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleDeletePatient(patient._id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>



                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {pageNumbers.map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              <PaginationEllipsis />

            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default Respection;
