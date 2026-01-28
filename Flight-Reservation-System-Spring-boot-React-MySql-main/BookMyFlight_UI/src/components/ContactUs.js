import React from "react";
import Header from './Header';
import Footer from './Footer';

function ContactUs() {
  return (
      <>
    <Header/>
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.heading}>📩 Contact BookMyFlight</h2>
        <hr style={styles.hr} />

        <p style={styles.text}>
          Need help with bookings or have queries? We’re just one message away ✈️
        </p>

        <div style={styles.infoBox}>
          <p>✉️ <b>Email:</b> support@bookmyflight.com</p>
          <p>📞 <b>Phone:</b> +91 9876543210</p>
          <p>📍 <b>Address:</b> Pune, Maharashtra, India</p>
        </div>
      </div>
    </div>
     <Footer/>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #021b79, #0575e6)",
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
      "radial-gradient(rgba(255,255,255,0.18) 2px, transparent 2px)",
    backgroundSize: "45px 45px",
    opacity: 0.25
  },
  card: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.93)",
    padding: "40px",
    width: "60%",
    maxWidth: "700px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)"
  },
  heading: {
    textAlign: "center",
    color: "#0575e6",
    marginBottom: "20px"
  },
  text: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "20px"
  },
  infoBox: {
    background: "#eaf4ff",
    padding: "20px",
    borderRadius: "12px",
    lineHeight: "1.9"
  },
  hr: {
    marginBottom: "20px"
  }
};

export default ContactUs;
