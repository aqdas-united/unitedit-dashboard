import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from "../../redux/authSlice";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../../components/formikvalidation/Loginvalidation'; // Import the validation schema
import './login.css';
import baseUrl from '../../components/config/config';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: loginValidationSchema,  // Use the imported validation schema
    onSubmit: (values) => {
      const { email } = values;
      const data = { email };

      // Make the API call after form validation
      axios
        .post(`${baseUrl}/api/v1/login`, data)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("user", JSON.stringify(response.data.data));
            toast.success(`OTP sent successfully! on ${email}`);
            navigate("/otp");
            dispatch(login({ email }));
          }
        })
        .catch((error) => {
          if (error.response) {
            const { status, message } = error.response.data;
            if (status === 404) {
              toast.error(message || "No admin found with this email");
            } else if (status === 500) {
              toast.error("Internal server error. Please try again later.");
            } else {
              toast.error("Something went wrong. Please try again.");
            }
          } else {
            toast.error("Network error. Please check your connection.", { position: "top-right" });
          }
        });
    },
  });

  return (
    <div className="container-fluid">
      <div className="card p-5 shadow" style={{ maxWidth: '500px', borderRadius: '8px' }}>
        <h3 className="text-center mb-3">Sign In</h3>
        <p className="text-center text-muted mb-4">Welcome back! Let’s continue with</p>

        {/* Formik error messages */}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
             {formik.errors.email && formik.touched.email && (
          <div className="text-danger mt-1">{formik.errors.email}</div>
        )}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
