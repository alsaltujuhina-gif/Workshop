import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CourseList.css";

export default function CourseList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/allWorkshops")
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="course-container">
      <h1>Course List</h1>
      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <div className="course-info">
              <img src={course.image} alt={course.courseName} />
              <span>{course.courseName}</span>
            </div>
            <div className="course-buttons">
              
              <button
                onClick={() =>
                  navigate(`/update-course/${course._id}`, { state: { course } })
                }
              >
                Edit
              </button>
              <button
                onClick={() =>
                  axios.delete(`http://localhost:5000/deleteWorkshop/${course._id}`)
                    .then(() => setCourses(prev => prev.filter(c => c._id !== course._id)))
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
