import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "./otp.css";
import axios from "axios";
import { toast } from "react-toastify";
import baseUrl from "../../components/config/config";
import { login } from "../../redux/authSlice"; // Correct import
import { useDispatch, useSelector } from "react-redux";

function Otp() {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState(""); // OTP state
  const dispatch = useDispatch();

  const data = JSON.parse(localStorage.getItem("user"));
  const token = data?.token; // Safely access token

  const config = {
    headers: {
      "x-auth-otp": token,
    },
  };

  const handleChange = (otp) => {
    setOTP(otp); // Update OTP state as user types
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (OTP.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const otpData = {
      otp: OTP,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/v1/verifyOtp`, otpData, config);

      if (response.data.status === 200) { 
        dispatch(login(response.data.data));
        localStorage.removeItem("user");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        const { status, message } = error.response.data;
      if (status === 400) {
          toast.error("OTP is not valid!", );
        } else if (status === 206) {
          toast.error("User is not valid!",);
        } else if (status === 500) {
          toast.error("Internal Server Error. Please try again later.",);
        } else {
          toast.error(message || "An error occurred. Please try again.",);
        }
      } else {
        toast.error("Network error. Please check your connection.",);
      }
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  return (
    <div id="forgetpassword">
      <div className="login-container">
        <Link to="/">
          <div className="header-logo"></div>
        </Link>
        <div className="d-flex full-sec flex-column justify-content-center align-items-center">
          <div className="login-form">
            <div className="mt-2">
              <div className="heading-form">Enter OTP!</div>
              <div className="text-para mt-2">
                Please Enter OTP Sent to Email or Phone Number
              </div>
            </div>
            <form onSubmit={handleOnSubmit}>
              <div className="py-2 mt-2">
                <div className="field-heading">OTP</div>
                <div className="mt-1">
                  <OtpInput
                    onChange={handleChange}
                    value={OTP}
                    numInputs={6}
                    separator={<span>-</span>}
                    inputStyle={{
                      width: "42px",
                      height: "50px",
                      fontSize: "20px",
                      textAlign: "center",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      margin: "5px",
                    }}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2 mb-3">
                <div className="otp-resend">Didn't receive OTP?</div>
              </div>
              <button type="submit" className="verify-otp-btn">
                Verify OTP
              </button>
            </form>
            <div className="mt-5">
              <div className="login-footer mx-3">
                Back to{" "}
                <span
                  role="button"
                  className="login-footer-span"
                  onClick={BackToLogin}
                >
                  Login
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;
