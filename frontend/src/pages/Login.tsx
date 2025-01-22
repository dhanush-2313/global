import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:3000/check-session", {
          withCredentials: true,
        });
        if (response.data.session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying session", error);
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.data.message === "Logged in successfully") {
        alert("User logged in successfully");
        navigate("/");
      } else {
        console.error("Unexpected response from login:", response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Internal server error");
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
