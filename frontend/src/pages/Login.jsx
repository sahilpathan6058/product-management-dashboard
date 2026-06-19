import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css";

const roleOptions = [
  {
    key: "ADMIN",
    label: "Admin",
  },
  {
    key: "USER",
    label: "User",
  },
];

function Login() {
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");

    if (savedToken && savedRole && savedUsername) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setMessage("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
setMessage("Username and password are required to log in.");
    return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await api.post("/login", {
        username: username.trim(),
        password: password.trim(),
      });

      const nextRole = (response.data.role || "USER").toUpperCase();
      const nextUsername = response.data.username || username.trim();
      const nextToken = response.data.token;

      if (!nextToken) {
setMessage("Login failed: No authentication token received. Please verify the backend JWT response.");        return;
      }

      if (nextRole !== selectedRole) {
setMessage(`Incorrect role selected. This account belongs to ${nextRole}. Please choose the correct tab.`);        return;
      }

      localStorage.setItem("username", nextUsername);
      localStorage.setItem("role", nextRole);
      localStorage.setItem("token", nextToken);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Incorrect username or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">PM</div>
          <div>
            <div className="login-brand-name">ProductHub</div>
            <div className="login-brand-sub">Inventory System</div>
          </div>
        </div>

        <h1>Welcome !!</h1>
        <p className="login-sub">Sign in to access your dashboard</p>

        <div className="login-role-tabs">
          {roleOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={
                selectedRole === option.key
                  ? "login-role-tab active"
                  : "login-role-tab"
              }
              onClick={() => handleRoleChange(option.key)}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        {message ? <div className="login-message">{message}</div> : null}

        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="login-footer-note">Use your assigned account credentials.</div>
      </div>
    </div>
  );
}

export default Login;
