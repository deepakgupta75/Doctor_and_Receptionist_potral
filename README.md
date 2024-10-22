## Project Overview

The project consists of two main portals:
1. **Receptionist Portal**: Allows receptionists to register new patients and manage patient records with full CRUD (Create, Read, Update, Delete) functionality.
2. **Doctor Portal**: Provides doctors with the ability to view the list of registered patients and analyze patient registration data through graphical representations.

## Features

### Single Login Page for Both Portals
- A unified authentication system that allows both receptionists and doctors to log in with their credentials.
- Once logged in, users are redirected to their respective portals based on their role.

### Receptionist Portal
- **Register New Patient**: Receptionists can create new patient profiles by filling in the required details.
- **CRUD Operations on Patients**:
  - **Create**: Add new patients to the system.
  - **Read**: View the details of existing patients.
  - **Update**: Modify information related to patient records.
  - **Delete**: Remove patient records from the system.

### Doctor Portal
- **View Registered Patients**: Doctors can view the list of all registered patients.
- **Graph Representation**: 
  - Visual representation of patient registration data over time.
  - A chart displaying the number of patients registered per day, helping doctors analyze trends.

---

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB or PostgreSQL (based on your implementation)
- **Charts/Graphs**: Chart.js or any graph library for data visualization
- **Authentication**: JWT (JSON Web Tokens)

---

## Live Demo
https://healthcare-checkup.netlify.app/
