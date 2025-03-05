import React, { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Image from "../../assets/register_login.webp";
import { axiosForm } from "../../config/axios"

const Register: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
    };
    const handleEmailSignUp = (): Promise<void> => {
        setLoading(true);
        setError("");
        setMessage("");

        return axiosForm
            .post("/api/register", {
                first_name: fullName.split(" ")[0],
                last_name: fullName.split(" ")[1] || "",
                email: email,
                password: password,
                type: "Learner",
                bio: "sample bio",
            })
            .then((response) => {
                setMessage(`🎉 ${response.data.message}`);
            })
            .catch((err: any) => {
                setError(err.response?.data?.error || err.message || "Registration failed");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            {/* Wrapper Container */}
            <div className="flex text-deepteal shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">

                {/* Left: Image Section */}
                <div className="hidden md:flex w-1/2 justify-center items-center bg-gray-100 p-8">
                    <img src={Image} alt="Register" className="max-w-full h-auto" />
                </div>

                {/* Right: Form Section */}
                <div className="w-full md:w-1/2 p-8 ">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 text-center ">
                        Sign up and start learning
                    </h2>

                    {/* Input Fields */}
                    <div className="space-y-4 mt-6 text-left">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1 ">Full name</label>
                            <Input type="text" placeholder="Full Name" value={fullName} onChange={handleChange(setFullName)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Email</label>
                            <Input type="email" placeholder="Email" value={email} onChange={handleChange(setEmail)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Password</label>
                            <Input type="password" placeholder="Password" value={password} onChange={handleChange(setPassword)} />
                        </div>
                    </div>
                    
                    {/* Display Success or Error Messages */}
                    {message && <p className="text-green-600 text-sm mt-2 text-center">{message}</p>}
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

                    {/* Sign Up Button */}
                    <div className="flex mt-6 justify-center">
                        <Button size="large" onClick={handleEmailSignUp} disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
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