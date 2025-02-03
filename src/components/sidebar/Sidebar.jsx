import React from "react"
import project from "../../icons/project.svg"
import add from "../../icons/plus.svg";
import { useNavigate } from "react-router-dom";
const Sidebar = ()=>{
const Navigate = useNavigate();
return(
<>
<div className="sidebar d-flex flex-column ">
<div className="w-100  mt-4 p-2" style={{ cursor: "pointer" }} onClick={() =>Navigate("/dashboard") }>
 <h5 className=" colortxxt pt-3 pb-3 pe-3   ps-0 w-100"><span><img  className = "project-icon  ps-2" src = {project}/></span>Projects</h5>
</div>

</div>
</>)
}
export default Sidebar