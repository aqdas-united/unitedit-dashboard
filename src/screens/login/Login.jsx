import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import MEDICAL_IMAGES from "../../assets/images/logo.png";

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:4500";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    apiError: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to log state changes for debugging (remove in production)
  useEffect(() => {
    console.log("Form Data:", formData);
    console.log("Errors:", errors);
  }, [formData, errors]);

  // Validation logic for form inputs
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value.trim()) error = "Email Address is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address";
        break;
      case "password":
        if (!value.trim()) error = "Password is required";
        else if (value.length < 4)
          error = "Password must be at least 4 characters";
        break;
      default:
        break;
    }
    return error;
  };

  // Handle input changes and validate in real-time
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
      apiError: "",
    }));
  };

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      apiError: "",
    };

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "admin",
          device: {
            id: "8d8c1fc3197f3054",
            deviceToken:
              "fWp_51ntQUirNOKJWT4iS-:APA91bHV4lkMs8HIZc3F0pBe41L0C_26E1xLtJfC2PiRN3N7hVZMllYrao5WZPbscAKdjhMlbxf7zNcagMHouoR0JwbmGmh8IQPSp3T6TNHO8MQ9sZ1GDy2C_VNUrF2eoU0dIkRWA1VS",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      // Store the token and refresh token in localStorage for future authenticated requests
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // Redirect to dashboard after successful login
      navigate("/dashboard/overview");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        apiError: error.message || "Login failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <img
            src={MEDICAL_IMAGES}
            alt="Medical Logo"
            className="jetour-logo"
          />
        </div>
        <h2 className="form-title">Welcome to UnitedIT Dashboard</h2>
        <p className="form-subtitle">
          Please enter your email and password to Login
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@gmail.com"
              required
              className={errors.email ? "input-error" : ""}
              disabled={isSubmitting}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span id="email-error" className="text-danger-login">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
              className={errors.password ? "input-error" : ""}
              disabled={isSubmitting}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span id="password-error" className="text-danger-login">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`login-button ${isSubmitting ? "disabled" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

          {errors.apiError && (
            <span className="text-danger-login api-error">
              {errors.apiError}
            </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;