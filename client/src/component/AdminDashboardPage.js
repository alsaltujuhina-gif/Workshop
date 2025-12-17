import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminDashboard.css";

// Reusable Card component
function Card({ iconClass, title, value, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="card-icon">
        <i className={iconClass}></i>
      </div>
      <div className="card-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

// Latest Course Card
function LatestCourse({ course }) {
  return (
    <div className="latest-course">
      <div className="card-icon">
        <i className="fa-solid fa-clock"></i>
      </div>
      <div className="card-info">
        <h3>Latest Course Added</h3>
        <p style={{ whiteSpace: "pre-line" }}>{course}</p>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Add New Course", icon: "fa-solid fa-plus", path: "/add-course" },
    { name: "Courses List", icon: "fa-solid fa-list", path: "/courses-list" },
    { name: "Log Out", icon: "fa-solid fa-right-from-bracket", path: "/logout" },
  ];

  return (
    <div className="sidebar">
      {/* Keep profile-icon */}
      <div
        className="profile-icon"
        style={{ cursor: "pointer" }}
      >
        <i className="fa-solid fa-user fa-2x"></i>
      </div>

      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => {
              setActive(item.name);

              if (item.name === "Log Out") {
                localStorage.removeItem("user");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                navigate("/"); 
              } else {
                navigate(item.path);
              }
            }}
          >
            <i className={item.icon} style={{ marginRight: "10px" }}></i>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}


// Main Dashboard component
function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Add New Course");
  const [currentCourses, setCurrentCourses] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [latestCourse, setLatestCourse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    const userId = localStorage.getItem("userId");
  if (!userId) {
    navigate("/"); 
    return; 
  }

    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/allWorkshops");
        const workshops = res.data;

        const today = new Date().toISOString().split("T")[0];
        const current = workshops.filter(w => w.date >= today).length;

        const latest = workshops.length > 0 ? workshops[0].courseName : "";

        setCurrentCourses(current);
        setTotalCourses(workshops.length);
        setLatestCourse(latest);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [navigate]);

  return (
  <div className="admin-dashboard">
    <Sidebar active={activeMenu} setActive={setActiveMenu} />

    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats">
        <Card
          iconClass="fa-solid fa-book"
          title="Current Courses"
          value={currentCourses}
        />

        <Card
          iconClass="fa-solid fa-graduation-cap"
          title="Total Courses"
          value={totalCourses}
          onClick={() => navigate("/courses-list")}
        />
      </div>

      <LatestCourse course={latestCourse || "No courses yet"} />
    </div>
  </div>
);

}

export default AdminDashboard;
