import { useState, useContext } from "react";
import { API } from "../api/api";
import { loginUser } from "../api/authApi.js";


import { AuthContext } from "../context/AuthContextObject"; // ✅ correct (single file setup)
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ initialize properly
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
 const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      const res = await loginUser(form);

      login(res.data);

      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-80">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}