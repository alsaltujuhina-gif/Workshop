import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./component/AdminDashboardPage";
import CourseList from "./component/CourseList";
import AboutUs from "./component/AboutUs";
import AddCourse from "./component/AddCourse";
import UpdateCourse from "./component/UpdateCourse";
import Login from "./component/Login";
import Register from "./component/Register";
import Home from "./component/Home";
import WorkshopsPage from "./component/Workshops";  
import WorkshopDetails from "./component/WorkshopDetails";
import MyEnrollments from "./component/MyEnrollments";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/courses-list" element={<CourseList />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/update-course/:id" element={<UpdateCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:id" element={<WorkshopDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
      </Routes>
    </Router>
  );
}

export default App;
