import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import MEDICAL_IMAGES from "../../assets/images/logo.png";

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

  // Validation logic
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
      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      // Example API call: await fetch("/api/login", { method: "POST", body: JSON.stringify(formData) });
      navigate("/dashboard/overview"); // Redirect to dashboard after successful login
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        apiError: "Login failed. Please try again.",
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

          {/* <p className="login-link">
            Forgot Password?{" "}
            <a
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Click here
            </a>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
