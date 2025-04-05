import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Image from "../../assets/register_login.webp";
import { FaEnvelope, FaGoogle, FaMicrosoft, FaGithub } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user, login, oAuthLogin } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      alert("Login successful!");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              <label className="block text-gray-700 font-semibold mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Password
              </label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
          {/* Login Button */}
          <div className="flex justify-center mt-6">
            <Button size="large" onClick={handleLogin} disabled={loading}>
              <span className="flex items-center gap-2">
                <FaEnvelope className="text-lg" />
                {loading ? "Logging in..." : "Continue with Email"}
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
          <div className="flex justify-center gap-3">
            <Button
              className="flex items-center gap-2"
              onClick={() => oAuthLogin("google")}
            >
              <FaGoogle className="text-red-500" />
              Google
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => oAuthLogin("github")}
            >
              <FaGithub />
              GitHub
            </Button>
          </div>

          {/* Sign Up Link*/}
          <div className="mt-6 bg-gray-100 p-4 rounded-md text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 font-semibold underline"
              >
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
