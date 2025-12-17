import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyEnrollments.css";
import { Link, useNavigate } from "react-router-dom";

function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  // Get userId saved during login
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!currentUserId) {
      navigate("/");
      return;
    }

    axios
      .get(`http://localhost:5000/api/enrollments/my-enrollments/${currentUserId}`)
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error(err));
  }, [currentUserId, navigate]);


  const getStatus = (date) => {
    const today = new Date();
    const workshopDate = new Date(date);


    today.setHours(0, 0, 0, 0);
    workshopDate.setHours(0, 0, 0, 0);

    if (workshopDate.getTime() === today.getTime()) {
      return "ongoing";
    }

    if (workshopDate < today) {
      return "completed";
    }

    return "upcoming";
  };

  


  return (
    <div className="course-container">
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
      <h1>My Enrollments</h1>
      <div className="course-list">
        {enrollments.length === 0 && (
          <p style={{ textAlign: "center" }}>No enrollments found.</p>
        )}

        {enrollments.map((item) => (
          <div key={item._id} className="course-card">
            <div className="course-info">

              <span>{item.title}</span>
            </div>
            <div className="course-buttons">
              <p>
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <p className={`status ${getStatus(item.date)}`}>
                {getStatus(item.date).charAt(0).toUpperCase() +
                  getStatus(item.date).slice(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyEnrollments;

