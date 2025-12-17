import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CourseList.css";
import logo from "../logo.png";

export default function WorkshopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/workshops/${id}`)
      .then(res => setWorkshop(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!workshop) return <p>Loading workshop details...</p>;

  const userId = localStorage.getItem("userId");
  const isWorkshopExpired = () => {
    const workshopDateTime = new Date(`${workshop.date}T${workshop.time}`);
    const now = new Date();
    return workshopDateTime < now;
  };


  const handleEnroll = async () => {
  if (!userId) {
    alert("Please login first!");
    return;
  }

  if (isWorkshopExpired()) {
    alert("❌ This workshop has already ended. Enrollment is closed.");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/enrollments", {
      userId,
      title: workshop.courseName,
      date: workshop.date,
    });

    alert("Enrolled successfully!");
    navigate("/my-enrollments");
  } catch (err) {
    console.error("Enrollment error:", err);
    alert("Enrollment failed!");
  }
};



  const openGoogleMaps = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="course-container">
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <p>Workshop Management<br />System</p>
        </div>
        <h1 style={{ textAlign: "center", marginTop: "10px" }}>Workshop Details</h1>
      </div>

      <div className="course-card" style={{ margin: "0 auto", maxWidth: "500px" }}>
        <div className="course-info" style={{ flexDirection: "column", alignItems: "center" }}>
          <img src={workshop.image || "/default-workshop.jpg"} alt={workshop.courseName} />
          <span>{workshop.courseName}</span>
        </div>

        <div className="course-buttons" style={{ justifyContent: "center", marginTop: "15px" }}>
          <button
            className="edit-btn"
            onClick={handleEnroll}
            disabled={isWorkshopExpired()}
            style={{
              opacity: isWorkshopExpired() ? 0.5 : 1,
              cursor: isWorkshopExpired() ? "not-allowed" : "pointer"
            }}
          >
            {isWorkshopExpired() ? "Enrollment Closed" : "Enroll Now"}
          </button>

          <button className="view-btn" onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>
            Back
          </button>
        </div>
      </div>

      <div style={{
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "left"
      }}>
        <h3>Description:</h3>
        <p>{workshop.description}</p>
        <p>⏱ {workshop.date} – {workshop.time}</p>
        <p>{workshop.courseType === "Online" ? "🌐 Online" : "📍 " + workshop.location}</p>
      </div>

      {workshop.courseType === "In-Person" && (
        <div style={{ textAlign: "center", marginTop: "25px" }}>
          <button className="view-btn" onClick={() => openGoogleMaps(workshop.location)}>
            View Location
          </button>
        </div>
      )}
    </div>
  );
}
