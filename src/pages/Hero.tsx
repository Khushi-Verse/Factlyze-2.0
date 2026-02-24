import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../assets/bg_vid.mp4";
import logo from "../assets/Capture1-removebg-preview.png";
import "../styles/hero.css";

export default function Hero() {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 5000);

    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 7000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <video autoPlay muted className="bg-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div
        className="overlay"
        style={{
          background: showContent
            ? "rgba(0,0,0,0.65)"
            : "rgba(0,0,0,0.2)",
        }}
      />

      <div className="content">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent
              ? "translateY(0)"
              : "translateY(20px)",
          }}
        />

        <h1
          className="title"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent
              ? "translateY(0)"
              : "translateY(20px)",
          }}
        >
          FACTLYZE
        </h1>

        <p
          className="tagline"
          style={{
            opacity: showContent ? 1 : 0,
            transform: showContent
              ? "translateY(0)"
              : "translateY(20px)",
          }}
        >
          See beyond the headlines. 
        </p>

        {showButton && (
          <button
            className="cta-btn"
            onClick={() => navigate("/home")}
            style={{
              opacity: showButton ? 1 : 0,
              transform: showButton
                ? "translateY(0)"
                : "translateY(20px)",
            }}
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
}