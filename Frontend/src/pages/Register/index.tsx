import React from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Image from "../assets/register_login.webp";

const Register: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            {/* Wrapper Container */}
            <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">

                {/* Left: Image Section */}
                <div className="hidden md:flex w-1/2 justify-center items-center bg-gray-100 p-8">
                    <img src={Image} alt="Register" className="max-w-full h-auto" />
                </div>

                {/* Right: Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 text-center">
                        Sign up and start learning
                    </h2>

                    {/* Input Fields */}
                    <div className="space-y-4 mt-6 text-left">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Full name</label>
                            <Input type="text" placeholder="Full name" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email</label>
                            <Input type="email" placeholder="Email" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Password</label>
                            <Input type="password" placeholder="Password" />
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <div className="flex mt-6 justify-center">
                        <Button size="large" onClick={() => console.log("Register clicked")}>
                            Sign Up
                        </Button>
                    </div>

                    {/* Terms & Policy */}
                    <p className="text-gray-500 text-xs mt-4 text-center">
                        By signing up, you agree to our{" "}
                        <span className="text-blue-600 font-medium cursor-pointer">Terms of Use</span> and{" "}
                        <span className="text-blue-600 font-medium cursor-pointer">Privacy Policy</span>.
                    </p>

                    {/* Login Redirect */}
                    <div className="mt-6 bg-gray-100 p-4 rounded-md text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-semibold">
                                <span className="underline">Log in</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;