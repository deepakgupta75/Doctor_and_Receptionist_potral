import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {Login} from "./pages/login"
import { Signup } from "./pages/signup"
import './index.css'
import Respection  from "./components/component/respection";
import Doctor from "./components/component/doctor";
import NotFound from "./components/component/NotFound";

function App() {

  return (
    
    <Router>
      <Routes>
        {/* Define the Login route */}
        <Route path="/login" element={<Login />} />

        {/* Define the Signup route */}
        <Route path="/signup" element={<Signup />} />

        {/* Redirect the root path ("/") to Login or Signup */}
        <Route path="/" element={<Signup />} />

        <Route path="/doctor" element={<Doctor/>} />

        <Route path="/respection" element={<Respection />} />

        <Route path="*" element={<NotFound/>}/>



      </Routes>
    </Router>

    
  )
}

export default App
