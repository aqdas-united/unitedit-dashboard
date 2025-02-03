import React from "react";
import unitedicon from "../../icons/unitedicon.png"
import logouts from "../../icons/log out.svg"
import "./navbar.css"
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Navbar = ()=>{
const Navigate = useNavigate();
  const dispatch = useDispatch();
  const logOut = () => {
        dispatch(logout());
        Navigate("/");
      };
    return(
        <>
        <div className="navbar w-100 bg-light ">
          <div className="d-flex justify-content-between w-100 ps-5 pe-5 pb-2 mt-0" >
            <div><img src = {unitedicon}  style = {{width:"120px"}}/></div>
            <div> <img src = {logouts} style = {{width:"40px" }} onClick = {logOut}></img></div>
          </div>

        </div>
        </>
    )
}
export default Navbar