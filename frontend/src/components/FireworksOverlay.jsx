 import React, { useEffect, useState } from "react";
import "../pages/Fireworks.css";

const FireworksOverlay = ({ count = 15 }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const newElements = [...Array(count)].map((_, i) => ({
      id: i,
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      delay: Math.random() * 5 + "s",
      duration: 2 + Math.random() * 3 + "s",
      color: ["#ff0044", "#ffdd00", "#00ffcc", "#ff00ff", "#ffffff"][Math.floor(Math.random() * 5)]
    }));
    setElements(newElements);
  }, [count]);

  return (
    <div className="fireworks-overlay">
      {elements.map((el) => (
        <div
          key={el.id}
          className="firework-particle"
          style={{
            top: el.top,
            left: el.left,
            animationDelay: el.delay,
            animationDuration: el.duration,
            "--particle-color": el.color
          }}
        />
      ))}
    </div>
  );
};

export default FireworksOverlay;
