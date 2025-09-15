import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Use deployed backend API
  const API = process.env.REACT_APP_API || "https://techfest-backend-uhzx.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ✅ Save token securely in localStorage
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("isAdmin", "true");

        navigate("/admin/dashboard");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("⚠️ Server error. Please try again.");
      console.error("Login error:", err);
    }

    setLoading(false);
  };

  return (
    <Layout hideFooter={true}>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-black/80 backdrop-blur-md border border-purple-500/40 p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-600">
            Admin Login
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block font-semibold text-gray-200 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-500 bg-black/60 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block font-semibold text-gray-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-500 bg-black/60 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-purple-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:scale-105 text-white shadow-lg shadow-purple-600/50"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
