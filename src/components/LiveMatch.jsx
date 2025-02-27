import React, { useState, useEffect } from "react";
import { makeSnapshot } from "../snapshots";
const LiveMatch = ({ teams, updateResults, time }) => {
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (time === 0) {
      setShowPopup(true);
    }
  }, [time]);
  const handleGoal = (team) => {
    if (team === 1) {
      setTeam1Score((prevScore) => prevScore + 1);
      if (team1Score + 1 === 2) {
        setShowPopup(true); // Show the popup
      }
    } else if (team === 2) {
      setTeam2Score((prevScore) => prevScore + 1);
      if (team2Score + 1 === 2) {
        setShowPopup(true); // Show the popup
      }
    }
  };

  const handleCancelGoal = (team) => {
    if (team === 1) {
      setTeam1Score((prevScore) => prevScore - 1);
    } else if (team === 2) {
      setTeam2Score((prevScore) => prevScore - 1);
    }
  };

  const handleConfirmFinish = () => {
    makeSnapshot();
    updateResults(team1Score, team2Score); // Pass scores to updateResults
    setShowPopup(false);
    setTeam2Score(0);
    setTeam1Score(0);
  };

  const handleCancelFinish = () => {
    setShowPopup(false);
    // Reduce the score to 1 goal if canceled
    if (team1Score === 2) {
      setTeam1Score(1);
    } else if (team2Score === 2) {
      setTeam2Score(1);
    }
    console.log("After cancel finish in Livematch - " + JSON.stringify(teams)); //doesn't show
  };

  return (
    <div className="live-match w-full">
      <div className="flex flex-box mt-2">
        <div className="team grow">
          <p className="text-3xl text-center mb-2">
            {" "}
            {teams[0].name.split(" ").slice(1).join(" ")}
          </p>
          <p className="text-3xl font-extrabold text-center">{team1Score}</p>
          <div className="flex justify-around mt-2">
            <button
              className="font-semibold text-green-600 border-green-600 rounded-full py-4 px-3 active:bg-green-400"
              onClick={() => handleGoal(1)}
            >
              Goal
            </button>
            <button
              className="font-semibold text-red-600 border-red-600 rounded-full active:bg-red-400"
              onClick={() => handleCancelGoal(1)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="team grow">
          <p className="text-3xl text-center mb-2">
            {" "}
            {teams[1].name.split(" ").slice(1).join(" ")}
          </p>
          <p className="text-3xl font-extrabold text-center">{team2Score}</p>

          <div className="flex justify-around mt-2">
            <button
              className="font-semibold text-green-600 border-green-600 rounded-full py-4 px-3 active:bg-green-400"
              onClick={() => handleGoal(2)}
            >
              Goal
            </button>
            <button
              className="font-semibold text-red-600 border-red-600 rounded-full active:bg-red-400"
              onClick={() => handleCancelGoal(2)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="modal">
          <div className="modal-content  mt-2 text-center py-4 text-lg">
            <p>
              Is the final score '{teams[0].name} vs {teams[1].name} -{" "}
              {team1Score}:{team2Score}'?
            </p>
            <p>Finish game?</p>
            <div className="flex mt-2">
              <button
                className="grow text-green-600 border-green-600 rounded-xl mr-2 px-2 active:bg-green-400"
                onClick={handleConfirmFinish}
              >
                Finish
              </button>
              <button
                className="grow text-red-600 border-red-600 rounded-xl px-2 active:bg-gray-400"
                onClick={handleCancelFinish}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;
