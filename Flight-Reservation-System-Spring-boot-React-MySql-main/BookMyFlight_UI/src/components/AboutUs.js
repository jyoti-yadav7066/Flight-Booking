import React from "react";
import Header from './Header';
import Footer from './Footer';

function AboutUs() {

  return (

    <>
    <Header/>
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.heading}>✈️ About BookMyFlight</h2>
        <hr style={styles.hr} />

        <p style={styles.text}>
          <b>BookMyFlight</b> is a modern online flight reservation system designed
          using a <b>Microservices Architecture</b> to ensure scalability,
          flexibility, and high performance.
        </p>

        <p style={styles.text}>
          The application is built using <b>Spring Boot</b> and <b>.NET</b> based
          microservices, where each service handles a specific business
          functionality such as flight management, booking, ticketing, and user
          operations.
        </p>

        <p style={styles.text}>
          Our platform allows users to <b>search flights, book tickets, manage
          bookings, and view ticket history</b> through a simple and intuitive
          interface.
        </p>

        <p style={styles.text}>
          The frontend is developed using <b>React</b>, while backend services
          communicate securely using REST APIs with a <b>MySQL</b> database for
          data persistence.
        </p>

        <p style={styles.text}>
          This microservices-based approach makes the system <b>highly
          maintainable, fault-tolerant, and future-ready</b>.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a2a43, #0f4c75, #3282b8)",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "80px",
    overflow: "hidden"
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
    backgroundSize: "40px 40px",
    opacity: 0.3
  },
  card: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.92)",
    padding: "40px",
    width: "70%",
    maxWidth: "800px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)"
  },
  heading: {
    textAlign: "center",
    color: "#0f4c75",
    marginBottom: "20px"
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.9",
    color: "#333"
  },
  hr: {
    marginBottom: "20px"
  }
};

export default AboutUs;
