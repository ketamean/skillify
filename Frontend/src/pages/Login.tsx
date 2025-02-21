import React from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Image from "../assets/register_login.webp";
import { FaEnvelope, FaGoogle, FaMicrosoft, FaGithub } from "react-icons/fa";

const Login: React.FC = () => {
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
                        Log in to continue your learning journey
                    </h2>

                    {/* Input Fields */}
                    <div className="space-y-4 mt-6 text-left">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email</label>
                            <Input type="email" placeholder="Email" />
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <div className="flex justify-center mt-6">
                        <Button size="large" onClick={() => console.log("Continue with Email")}>
                            <span className="flex items-center gap-2">
                                <FaEnvelope className="text-lg" />
                                Continue with email
                            </span>
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-gray-300" />
                        <span className="text-gray-500 text-sm px-2">Or log in with</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>

                    {/* Social Logins */}
                    <div className="flex justify-center gap-4">
                        <Button
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
                            onClick={() => console.log("Login with Google")}
                        >
                            <FaGoogle className="text-red-500" />
                            Google
                        </Button>
                        <Button
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
                            onClick={() => console.log("Login with Microsoft")}
                        >
                            <FaMicrosoft className="text-blue-500" />
                            Microsoft
                        </Button>
                        <Button
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
                            onClick={() => console.log("Login with GitHub")}
                        >
                            <FaGithub />
                            GitHub
                        </Button>
                    </div>

                    {/* Sign Up Link*/}
                    <div className="mt-6 bg-gray-100 p-4 rounded-md text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-purple-600 font-semibold underline">
                                <span className="underline">Sign up</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;