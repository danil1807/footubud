import React, { useEffect, useState } from "react";

const Timer = ({ time, setTime, isActive, setIsActive, onTimerEnd }) => {
  useEffect(() => {
    let intervalId;

    if (isActive && time > 0) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000); // Update time every second
    } else {
      clearInterval(intervalId);
      if (time === 0 && typeof onTimerEnd === "function") {
        onTimerEnd();
      } // Call the onTimerEnd function when the timer reaches zero
    }

    return () => clearInterval(intervalId);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (value) => {
    return value.toString().padStart(2, "0");
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer-container flex flex-col items-center">
      <div className="text-4xl font-bold">
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <button
        className="grow text-2xl text-green-600 border-green-600 rounded-xl my-4 mr-2 px-6 py-4"
        onClick={toggleTimer}
      >
        {isActive ? "Pause" : "Start"}
      </button>
    </div>
  );
};

export default Timer;
