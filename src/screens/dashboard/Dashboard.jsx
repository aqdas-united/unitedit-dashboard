import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import baseUrl from "../../components/config/config";
import threedots from "../../icons/threedots.svg";
import { useSelector } from "react-redux";
import add from "../../icons/plus.svg";
// import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";
import Deleteconfirmationmodal from "../../components/modals/deleltemodal/Deleteconfirmatiommodal"
import "./dashbaord.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [projectToDelete, setProjectToDelete] = useState(null); // Project to delete
  const Navigate = useNavigate();
  const { user} = useSelector((state) => state.auth);
  const token = user?.token
  const config = {
    headers: {
      "x-auth-token": token,
    },
  }
  useEffect(() => {
    axios.get(`${baseUrl}/api/v1/get-projects`,config)
      .then((response) => {
        if(response.data.status == 200)
          {
          setProjects(response?.data?.data?.projects);
          console.log(response?.data?.data?.projects);
           setLoading(false);
         }
      })
      .catch((error) => {
        if (error.response) {
          const { status, message } = error.response.data;
          
          // Handle specific error codes
          if (status === 500) {
            toast.error("Internal server error. Please try again later.", { position: "top-right" });
          } else {
            toast.error(message || "Something went wrong. Please try again.", { position: "top-right" });
          }
        } else {
          toast.error("Network error. Please check your connection.", { position: "top-right" });
        }})
        
  }, []);

  const deleteProject = (id) => {
    axios
      .delete(`${baseUrl}/api/v1/delete-project/${id}`,config)
      .then((response) => {
        if (response.status === 200) {
          setProjects(projects.filter((project) => project._id !== id)); // Update state
          toast.success("Project deleted successfully", { position: "top-right" });
          setShowModal(false); // Close modal after deletion
        }
      })
      .catch((err) => {
        if (err.response) {
          const { status, message } = err.response.data;
          
          if (status === 404) {
            toast.error(message || "No project found with this ID", { position: "top-right" });
          } else if (status === 500) {
            toast.error("Internal server error. Please try again later.", { position: "top-right" });
          } else {
            toast.error(message || "Something went wrong. Please try again.", { position: "top-right" });
          }
        } else {
          toast.error("Network error. Please check your connection.", { position: "top-right" });
        }
  
        setShowModal(false); // Close modal even in case of error
      });
  };
  

  const openDeleteModal = (id) => {
    setProjectToDelete(id);
    setShowModal(true); // Show the confirmation modal
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setProjectToDelete(null);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="d-flex padding-pp">
      <div className="flex-grow-1 p-4 w-75">
        <div className="d-flex justify-content-between pb-4 pt-4 me-3">
          <h3>Projects</h3>
          <div
            className="pe-2 ps-2"
            style={{ cursor: "pointer" }}
            onClick={() => Navigate("/addproject")}
          >
            <img className="project-icon ps-2" src={add} />
          </div>
        </div>

       

        <div className="d-flex gap-3 flex-wrap mt-5 cards-container">
          {projects.map((project) => (
            <div key={project._id} className="card d-flex gap-2">
              <div className="dropdown text-end">
                <img
                  src={threedots}
                  alt="Options Icon"
                  className="three-dots-icon"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ cursor: "pointer", width: "20px", height: "20px" }}
                />
                <ul className="dropdown-menu">
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => Navigate(`/viewproject/${project._id}`, { state: project })}
                    >
                      View project
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" onClick={() => Navigate(`/edit/${project._id}`)}>
                      Edit
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item text-danger" href="#" onClick={() => openDeleteModal(project._id)}>
                      Remove
                    </a>
                  </li>
                </ul>
              </div>
              <img
                className="img-fluid card-img-top"
                src={project.images[0]} 
                
                alt={project.title}
                onClick={() => Navigate(`/viewproject/${project._id}`, { state: project })}
              />
              <div className="card-body d-flex justify-content-between">
                <p className="card-title">{project.title}</p>
                <p className="bg-cls">{project.secondservice}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Deleteconfirmationmodal
        show={showModal}
        onClose={closeDeleteModal}
        onConfirm={() => {
          deleteProject(projectToDelete);
        }}
      />
    </div>
  );
}

export default Dashboard;
