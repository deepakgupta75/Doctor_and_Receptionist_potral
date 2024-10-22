



import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Make sure you import jwt-decode correctly

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // For redirection
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // Validate inputs
      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }
  
      try {
        // Sending the email and password to the backend for authentication
        const response = await fetch("https://doctor-and-receptionist-potral-5.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Save token in local storage
          localStorage.setItem("token", data.token);

          // Decode the token to extract user role
          const decodedToken = jwtDecode<{ role: string }>(data.token);
          const userRole = decodedToken.role;

          // Redirect based on user role
          if (userRole === "doctor") {
            navigate("/doctor");  // Redirect to doctor page
          } else if (userRole === "receptionist") {
            navigate("/respection");  // Redirect to receptionist page
          } else {
            navigate("/login");  // Fallback in case the role is not recognized
          }

        } else {
          alert(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong, please try again later.");
      }
    };
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex justify-center">Login Page</CardTitle>
          <CardDescription>Enter Your Email and Password to Login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  placeholder="Enter Password" 
                  type="password" // Make it a password input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="flex justify-center mt-2">
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
          <span className="flex justify-center">New user? <a href="https://healthcare-checkup.netlify.app/">Signup</a></span>
        </CardContent>
      </Card>
    </div>
  );
}
