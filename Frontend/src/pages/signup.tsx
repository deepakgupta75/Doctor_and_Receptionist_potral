
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Track selected role
  const [message, setMessage] = useState(""); // For success or error messages
  const [error, setError] = useState(""); // For error messages
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("https://doctor-and-receptionist-potral-5.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // Handle the case when the email already exists
          setError("User already exists with this email .Please login" );
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      } else {
        // Success: Clear the form, show success message, and redirect
        setMessage("User created successfully");
        setError("");
        setName("");
        setEmail("");
        setPassword("");
        setRole("");

        // Redirect based on role
        if (role === "receptionist") {
          navigate("/login");
        } else if (role === "doctor") {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex justify-center">Create Account</CardTitle>
        <CardDescription className="flex justify-center">
          Fill the Below Details to Signup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Select Role</Label>
              <Select onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <CardFooter className="flex justify-center mt-2">
            <Button type="submit">Register</Button>
          </CardFooter>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <span className="flex justify-center">
          Existing user? <a href="https://healthcare-checkup.netlify.app/login">Login</a>
        </span>
      </CardContent>
    </Card>
  );
}
