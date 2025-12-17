import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddCourse.css";

function UpdateCourse() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const courseData = locationHook.state?.course;

  const [courseName, setCourseName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [courseType, setCourseType] = useState("Online");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
  if (courseData) {
    setCourseName(courseData.courseName || "");
    setDate(courseData.date?.slice(0, 10) || "");
    setTime(courseData.time || "");
    setCourseType(courseData.courseType || "Online");
    setDescription(courseData.description || "");
    setLocation(courseData.location || "");

    // USE IMAGE URL DIRECTLY FROM BACKEND
    setImage(courseData.image || null);
  }
}, [courseData]);




  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("courseName", courseName);
      formData.append("date", date);
      formData.append("time", time);
      formData.append("courseType", courseType);
      formData.append("description", description);
      formData.append("location", location);
      if (imageFile) formData.append("image", imageFile);

      await axios.put(
        `http://localhost:5000/updateWorkshop/${courseData._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Workshop updated successfully!");
      navigate("/course-list");
    } catch (err) {
      console.error("Error updating workshop:", err);
    }
  };

  return (
    <div className="add-course-container">
      <div className="add-course-card">
        <h2>Update Course</h2>

        <form onSubmit={handleSubmit}>
          <div className="image-upload">
            <label htmlFor="file-input">
              {image ? (
                <img src={image} alt="Course" className="preview-image" />
              ) : (
                <div className="upload-placeholder">📷 Upload Image</div>
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />

          <div className="row">
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
            </select>
          </div>

          {courseType === "In-Person" && (
            <input
              type="text"
              placeholder="Course Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          )}

          <input
            type="text"
            placeholder="Course Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
