import React, { useState, useEffect } from "react";
import LiveMatch from "./components/LiveMatch";
import Timer from "./components/Timer";
import Table from "./components/Table";
import GameHistory from "./components/GameHistory";
import "./styles.css"; // Import the Tailwind CSS styles

const App = () => {
  const [time, setTime] = useState(() => {
    // Load time from localStorage if available, otherwise set it to the default value (7 minutes)
    const storedTime = localStorage.getItem("timerTime");
    return storedTime ? parseInt(storedTime, 10) : 7 * 60;
  });
  const [isActive, setIsActive] = useState(() => {
    const storedIsActive = localStorage.getItem("isActive");
    return storedIsActive ? JSON.parse(storedIsActive) : false;
  });

  useEffect(() => {
    // Save the current time to localStorage whenever it changes
    localStorage.setItem("timerTime", time.toString());
  }, [time]);

  const [timerEnded, setTimerEnded] = useState(false);

  const [teamsData, setTeamsData] = useState(() => {
    // Load teamsData from localStorage if available, or use default values
    const savedTeamsData = localStorage.getItem("teamsData");
    return savedTeamsData
      ? JSON.parse(savedTeamsData)
      : [
          {
            name: "Orange 🟠",
            wins: 0,
            draws: 0,
            losses: 0,
            goalsScored: 0,
            goalsConceded: 0,
            consecutiveGames: 0,
            points: 0,
          },
          {
            name: "Black ⚫",
            wins: 0,
            draws: 0,
            losses: 0,
            goalsScored: 0,
            goalsConceded: 0,
            consecutiveGames: 0,
            points: 0,
          },
          {
            name: "White ⚪",
            wins: 0,
            draws: 0,
            losses: 0,
            goalsScored: 0,
            goalsConceded: 0,
            consecutiveGames: 0,
            points: 0,
          },
        ];
  });
  const [gameHistory, setGameHistory] = useState(() => {
    // Load gameHistory from localStorage if available, or use an empty array
    const savedGameHistory = localStorage.getItem("gameHistory");
    return savedGameHistory ? JSON.parse(savedGameHistory) : [];
  });

  const [currentTeams, setCurrentTeams] = useState([
    teamsData[0],
    teamsData[1],
  ]); // Indexes of the current teams playing

  const resetTimer = () => {
    setTime(7 * 60); // Reset the timer to 7 minutes
    setIsActive(false); // Stop the timer
  };
  const handleTimerEnd = () => {
    setTimerEnded(true);
    console.log("set timer end = true");
  };

  const updateResults = (team1Score, team2Score) => {
    const team1Name = currentTeams[0].name;
    const team2Name = currentTeams[1].name;

    setTeamsData((prevTeamsData) => {
      const updatedTeamsData = [...prevTeamsData];

      // Find the indices of both teams in the updatedTeamsData array
      const team1Index = updatedTeamsData.findIndex(
        (team) => team.name === team1Name
      );
      const team2Index = updatedTeamsData.findIndex(
        (team) => team.name === team2Name
      );

      if (team1Score > team2Score) {
        updatedTeamsData[team1Index] = {
          ...updatedTeamsData[team1Index],
          wins: updatedTeamsData[team1Index].wins + 1,
          points: updatedTeamsData[team1Index].points + 3,
        };
        updatedTeamsData[team2Index] = {
          ...updatedTeamsData[team2Index],
          losses: updatedTeamsData[team2Index].losses + 1,
        };
      } else if (team1Score < team2Score) {
        updatedTeamsData[team2Index] = {
          ...updatedTeamsData[team2Index],
          wins: updatedTeamsData[team2Index].wins + 1,
          points: updatedTeamsData[team2Index].points + 3,
        };
        updatedTeamsData[team1Index] = {
          ...updatedTeamsData[team1Index],
          losses: updatedTeamsData[team1Index].losses + 1,
        };
      } else {
        updatedTeamsData[team1Index] = {
          ...updatedTeamsData[team1Index],
          draws: updatedTeamsData[team1Index].draws + 1,
          points: updatedTeamsData[team1Index].points + 1,
        };
        updatedTeamsData[team2Index] = {
          ...updatedTeamsData[team2Index],
          draws: updatedTeamsData[team2Index].draws + 1,
          points: updatedTeamsData[team2Index].points + 1,
        };
      }

      console.log("Before update:");
      console.log(
        updatedTeamsData[team1Index].name +
          updatedTeamsData[team1Index].consecutiveGames
      );
      console.log(
        updatedTeamsData[team2Index].name +
          updatedTeamsData[team2Index].consecutiveGames
      );

      // Update other stats
      updatedTeamsData[team1Index] = {
        ...updatedTeamsData[team1Index],
        goalsScored: updatedTeamsData[team1Index].goalsScored + team1Score,
        goalsConceded: updatedTeamsData[team1Index].goalsConceded + team2Score,
        consecutiveGames: updatedTeamsData[team1Index].consecutiveGames + 1,
      };
      updatedTeamsData[team2Index] = {
        ...updatedTeamsData[team2Index],
        goalsScored: updatedTeamsData[team2Index].goalsScored + team2Score,
        goalsConceded: updatedTeamsData[team2Index].goalsConceded + team1Score,
        consecutiveGames: updatedTeamsData[team2Index].consecutiveGames + 1,
      };
      console.log("After update:");
      console.log(
        updatedTeamsData[team1Index].name +
          updatedTeamsData[team1Index].consecutiveGames
      );
      console.log(
        updatedTeamsData[team2Index].name +
          updatedTeamsData[team2Index].consecutiveGames
      );

      return updatedTeamsData;
    });

    setGameHistory((prevGameHistory) => {
      const updatedGameHistory = [
        ...prevGameHistory,
        {
          team1: team1Name,
          team2: team2Name,
          score: `${team1Score}-${team2Score}`,
        },
      ];
      return updatedGameHistory;
    });

    resetTimer();
  };

  useEffect(() => {
    // Check if any team has consecutiveGames = 3
    const teamWithThreeConsecutiveGames = teamsData.find(
      (team) => team.consecutiveGames === 3
    );

    if (teamWithThreeConsecutiveGames) {
      const teamIndex = teamsData.findIndex(
        (team) => team.name === teamWithThreeConsecutiveGames.name
      );
      const nextTeamIndex = (teamIndex + 1) % teamsData.length;
      setCurrentTeams([
        teamsData[nextTeamIndex],
        teamsData[(nextTeamIndex + 1) % teamsData.length],
      ]);

      // Reset consecutiveGames for the team with three consecutive games
      setTeamsData((prevTeamsData) => {
        const updatedTeamsData = prevTeamsData.map((team) => {
          if (team.consecutiveGames === 3) {
            // Update the consecutiveGames property for the team with three consecutive games
            return {
              ...team,
              consecutiveGames: 0,
            };
          }
          return team;
        });
        return updatedTeamsData;
      });
    } else {
      // Check the result of the previous game
      const lastGame = gameHistory[gameHistory.length - 1];
      if (lastGame) {
        const [team1Score, team2Score] = lastGame.score.split("-");
        const winner =
          team1Score > team2Score
            ? lastGame.team1
            : team2Score > team1Score
            ? lastGame.team2
            : null;
        const nextTeam = teamsData.find(
          (team) =>
            !currentTeams.some((currentTeam) => currentTeam.name === team.name)
        );
        console.log(nextTeam.name + "Next team to enter the field");
        if (winner) {
          setCurrentTeams([
            teamsData.find((team) => team.name === winner),
            nextTeam,
          ]);
        } else {
          // If it was a draw, compare consecutiveGames
          // If it was a draw, compare consecutiveGames
          const teamWithMinConsecutiveGames = teamsData.reduce(
            (prev, current) => {
              if (current.name !== nextTeam.name) {
                return prev.consecutiveGames < current.consecutiveGames
                  ? prev
                  : current;
              } else {
                return prev;
              }
            }
          );

          console.log(
            teamWithMinConsecutiveGames.name + " Min consecutive games"
          );
          if (gameHistory.length === 1) {
            // Handle the case of the first game being a draw
            const randomIndex = Math.floor(Math.random() * 2); // Randomly choose one of the two teams
            setCurrentTeams([currentTeams[randomIndex], nextTeam]);
          } else {
            setCurrentTeams([teamWithMinConsecutiveGames, nextTeam]);
          }
          console.log(
            "Teams after setting current teams - " +
              JSON.stringify(currentTeams)
          );
        }
      }
    }
    const teamToZeroConsecutiveGames = teamsData.find(
      (team) =>
        !currentTeams.some((currentTeam) => currentTeam.name === team.name)
    );
    setTeamsData((prevTeamsData) => {
      const updatedTeamsData = prevTeamsData.map((team) => {
        if (team.name === teamToZeroConsecutiveGames.name) {
          return {
            ...team,
            consecutiveGames: 0,
          };
        }
        return team;
      });
      return updatedTeamsData;
    });
  }, [gameHistory]);

  useEffect(() => {
    // Your existing useEffect logic remains unchanged
    // Remember to update localStorage after updating states
  }, [gameHistory]);

  useEffect(() => {
    // Save teamsData to localStorage whenever it changes
    localStorage.setItem("teamsData", JSON.stringify(teamsData));
  }, [teamsData]);

  useEffect(() => {
    // Save gameHistory to localStorage whenever it changes
    localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
  }, [gameHistory]);
  useEffect(() => {
    localStorage.setItem("timerTime", time.toString());
  }, [time]);

  useEffect(() => {
    localStorage.setItem("isActive", JSON.stringify(isActive));
  }, [isActive]);
  const [confirming, setConfirming] = useState(false);

  const startNewTournament = () => {
    if (confirming) {
      // Clear localStorage and reset tournament data
      localStorage.removeItem("teamsData");
      localStorage.removeItem("gameHistory");
      setTeamsData([
        {
          name: "Orange 🟠",
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          consecutiveGames: 0,
          points: 0,
        },
        {
          name: "Black ⚫",
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          consecutiveGames: 0,
          points: 0,
        },
        {
          name: "White ⚪",
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          consecutiveGames: 0,
          points: 0,
        },
      ]);
      setGameHistory([]);
      setCurrentTeams([teamsData[0], teamsData[1]]);
      resetTimer();
      setConfirming(false);
    } else {
      // Show confirmation
      setConfirming(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-top p-4">
      <div className="w-full">
        <Timer
          time={time}
          setTime={setTime}
          isActive={isActive}
          setIsActive={setIsActive}
          onTimerEnd={handleTimerEnd} // Pass the function to handle timer end
        />
      </div>

      {!isActive ? (
        <h2 className="font-extrabold text-2xl">
          Next Match{" "}
          <span className="text-xl">
            {currentTeams[0].name} vs. {currentTeams[1].name}
          </span>
        </h2>
      ) : (
        <LiveMatch
          teams={currentTeams}
          updateResults={updateResults}
          timerEnded={timerEnded} // Pass the state indicating timer end
        />
      )}

      <Table teams={teamsData} />
      <GameHistory history={gameHistory} />
      {/* Conditional rendering for confirmation */}
      {confirming ? (
        <div className="confirm-container">
          <p>Are you sure you want to start a new tournament?</p>
          <button
            className="confirm-btn w-1/2 rounded-lg"
            onClick={startNewTournament}
          >
            Yes
          </button>
          <button
            className="confirm-btn w-1/2 rounded-lg"
            onClick={() => setConfirming(false)}
          >
            No
          </button>
        </div>
      ) : (
        <button
          className="w-2/3 start-btn mt-16 border-orange-300 rounded-lg bg-red-800 text-orange-300 bottom-0"
          onClick={startNewTournament}
        >
          Start New Tournament
        </button>
      )}
    </div>
  );
};

export default App;
