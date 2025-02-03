import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signin from "./screens/loginscreen/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import PageLayoutAdmin from "./components/pagelayoutadmin/Pagelayoutadmin";
import Addproject from "../src/components/addproject/Addproject"
// import Editproject from "../src/components/editproject/Editproject"
import EditProjectComponent from "./components/editproject/Editproject";
import OTP from "../src/screens/OTP/OTP"
import { Nav } from "react-bootstrap";
import ProtectedRoutes from "./components/protectedroutes/ProtectedRoutes";
import Viewproject from "./components/viewproject/Viewproject"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <>
  <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="light"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route
              exect
              path="/viewproject/:id"
              element={
                <PageLayoutAdmin>
                <ProtectedRoutes component={Viewproject} />
                </PageLayoutAdmin>
              }
            />
          <Route
              exect
              path="/dashboard"
              element={
                <PageLayoutAdmin>
                   <ProtectedRoutes component={Dashboard} />
                </PageLayoutAdmin>
              }
            />
              <Route
              exect
              path="/addproject"
              element={
                <PageLayoutAdmin>
                   <ProtectedRoutes component={Addproject} />

                </PageLayoutAdmin>
              }
            />
                 <Route
              exect
              path="/edit/:id"
              element={
                <PageLayoutAdmin>
                <ProtectedRoutes component={EditProjectComponent} />
                </PageLayoutAdmin>
              }
            />
          <Route
              exect
              path="/otp"
              element={
                <OTP/>
              }
            />
        </Routes>
      </Router>
    </>
  );
}

export default App;
