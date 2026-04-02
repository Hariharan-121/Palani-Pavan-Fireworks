import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);

  return (
    <div className="countdown-container">
      <div className="countdown-item">
        <span className="countdown-value">{addLeadingZero(timeLeft.days)}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-divider">:</div>
      <div className="countdown-item">
        <span className="countdown-value">{addLeadingZero(timeLeft.hours)}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <div className="countdown-divider">:</div>
      <div className="countdown-item">
        <span className="countdown-value">{addLeadingZero(timeLeft.minutes)}</span>
        <span className="countdown-label">Min</span>
      </div>
      <div className="countdown-divider">:</div>
      <div className="countdown-item">
        <span className="countdown-value">{addLeadingZero(timeLeft.seconds)}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
