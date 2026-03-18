import React from "react";
import "./TraditionalLamp.css";

const TraditionalLamp = ({ side }) => {
  return (
    <div className={`vilaku-container ${side}`}>
      <svg className="vilaku-svg" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lamp Base (Traditional Indian Vilaku shape) */}
        <path d="M50 140C20 140 10 120 10 100C10 80 30 70 50 70C70 70 90 80 90 100C90 120 80 140 50 140Z" fill="url(#lamp-grad)" />
        <path d="M50 70V30M30 40H70" stroke="#f8931f" strokeWidth="4" strokeLinecap="round" />
        
        {/* Flickering Flame */}
        <g className="flame-group">
          <path className="flame-outer" d="M50 30C50 30 65 50 50 65C35 50 50 30 50 30Z" fill="#ffaa00" opacity="0.8" />
          <path className="flame-inner" d="M50 35C50 35 60 50 50 60C40 50 50 35 50 35Z" fill="#fff" opacity="0.9" />
        </g>

        <defs>
          <radialGradient id="lamp-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 105) rotate(90) scale(35 40)">
            <stop stopColor="#f8931f" />
            <stop offset="1" stopColor="#8d4004" />
          </radialGradient>
        </defs>
      </svg>
      <div className="lamp-glow"></div>
    </div>
  );
};

export default TraditionalLamp;
