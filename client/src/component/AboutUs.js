import React, { useEffect } from "react";
import "./AboutUs.css";
import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
 
function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    navigate("/"); 
    return;
  }
}, [navigate]);

  
 
  return (
    <div className="aboutus-container">
      {/* Navigation menu */}
      <ul className="nav-menu">
        <li>
          <Link to="/workshops">Home</Link>
        </li>
        <li>
          <Link to="/my-enrollments">MyEnrollments</Link>
        </li>
        <li>
          <Link to="/AboutUs">AboutUs</Link>
        </li>
        <li>
                  <Link
                    to="#"
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    Logout
                  </Link>
                </li>
      </ul>
 
      <div className="header">
        <h1>About Us</h1>
      </div>
 
      <div className="aboutus-content">
        <img src={logo} alt="Logo" style={{ width: "120px" }} />
        <p>
          Welcome to our Workshop Management System! <br /><br />
          This platform allows users to easily browse and register for workshops.
          Admins can efficiently manage users, workshops, and resources.
        </p>
 
        <h3>Our Mission</h3>
        <p>
          To make workshop management easy, transparent, and accessible for everyone.
        </p>
 
        <h3>Contact Us</h3>
        <p>Email: support@workshopsystem.com</p>
        <p>Phone: +968 1234 5678</p>
      </div>
    </div>
  );
}
 
export default AboutUs;
