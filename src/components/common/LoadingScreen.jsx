// src/components/common/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="unisphere-loading-container">
      <div className="unisphere-loading-glow">
        <div className="unisphere-loading-orb"></div>
      </div>
      <p className="unisphere-loading-text">Connecting to UniSphere...</p>
    </div>
  );
};

export default LoadingScreen;
