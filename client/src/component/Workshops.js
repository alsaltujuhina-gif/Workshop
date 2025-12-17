import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Workshops.css";
import logo from "../logo.png";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

     const userId = localStorage.getItem("userId");
  if (!userId) {
    navigate("/"); 
    return;
  }
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allWorkshops");
        setWorkshops(response.data);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [navigate]);

  if (loading) return <p>Loading workshops...</p>;

  // Filter workshops based on search
  const filteredWorkshops = workshops.filter((w) =>
    w.courseName.toLowerCase().includes(search.toLowerCase())
  );

  

  return (
    <div className="workshops-container">
      <header className="workshops-header">
        <img src={logo} alt="Logo" style={{ width: "120px" }} />
        <nav>
          <ul>
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
        </nav>
      </header>

      <main>
        <h2>Browse Available Workshops</h2>
        <p>Find your perfect workshop and start learning today</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Workshops"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>

        <div className="workshops-grid">
          {filteredWorkshops.map((workshop) => (
            <div className="workshop-card" key={workshop._id}>
              <img
                src={workshop.image ? workshop.image : "/default-workshop.jpg"}
                alt={workshop.courseName}
              />
              <h3>{workshop.courseName}</h3>
              <p>{workshop.description}</p>
              <button
                onClick={() => navigate(`/workshops/${workshop._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default WorkshopsPage;
