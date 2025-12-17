import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo.png";

function Home() {
  const navigate = useNavigate();

  // Inline styles for the component
  const styles = {
    card: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      borderRadius: "16px",
      backgroundColor: "#fff",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      textAlign: "center",
    },
    logo: {
      width: "120px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "28px",
      marginBottom: "10px",
      color: "#333",
    },
    subtitle: {
      fontSize: "16px",
      marginBottom: "30px",
      color: "#666",
    },
    buttonPrimary: {
      backgroundColor: "#ff4d6d",
      color: "white",
      padding: "12px 0",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
      marginBottom: "12px",
      transition: "0.3s",
    },
    buttonSecondary: {
      backgroundColor: "#ffd1dc",
      color: "#444",
      padding: "12px 0",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
      transition: "0.3s",
    },
  };

  return (
    <div style={styles.card}>
      <img src={logo} alt="logo" style={styles.logo} />

      <h2 style={styles.title}>Welcome!</h2>
      <p style={styles.subtitle}>Workshop Management System</p>

      <button
        style={styles.buttonPrimary}
        onClick={() => navigate("/login")}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#ff2a4a")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4d6d")}
      >
        Login
      </button>

      <button
        style={styles.buttonSecondary}
        onClick={() => navigate("/register")}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#ffc0cc")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ffd1dc")}
      >
        Register
      </button>
    </div>
  );
}

export default Home;
