import React, { useState, useEffect } from "react";
import LiveMatch from "./components/LiveMatch";
import Timer from "./components/Timer";
import Table from "./components/Table";
import GameHistory from "./components/GameHistory";
import { restoreSnapshot } from "./snapshots";
import "./styles.css"; // Import the Tailwind CSS styles

const App = () => {
  //TIMER RELATED CODE START
  const [time, setTime] = useState(() => {
    // Load time from localStorage if available, otherwise set it to the default value (7 minutes)
    const storedTime = localStorage.getItem("timerTime");
    return storedTime ? parseInt(storedTime, 10) : 7 * 60;
  });
  const [isActive, setIsActive] = useState(() => {
    const storedIsActive = localStorage.getItem("isActive");
    return storedIsActive ? JSON.parse(storedIsActive) : false;
  });
  const resetTimer = () => {
    setTime(7 * 60); // Reset the timer to 7 minutes
    setIsActive(false); // Stop the timer
  };
  useEffect(() => {
    // Save the current time to localStorage whenever it changes
    localStorage.setItem("timerTime", time.toString());
  }, [time]);
  //TIMER RELATED CODE END

  //TEAMSDATA RELATED CODE START
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
            history: [], // Initialize an empty history array
            points: 0,
          },
          {
            name: "White ⚪",
            wins: 0,
            draws: 0,
            losses: 0,
            goalsScored: 0,
            goalsConceded: 0,
            history: [], // Initialize an empty history array
            points: 0,
          },
          {
            name: "Black ⚫",
            wins: 0,
            draws: 0,
            losses: 0,
            goalsScored: 0,
            goalsConceded: 0,
            history: [], // Initialize an empty history array
            points: 0,
          },
        ];
  });

  // Initialize currentTeams state with values from localStorage if available
  const initialCurrentTeams = localStorage.getItem("currentTeams")
    ? JSON.parse(localStorage.getItem("currentTeams"))
    : [teamsData[0], teamsData[1]];

  const [currentTeams, setCurrentTeams] = useState(initialCurrentTeams);

  //TEAMSDATA RELATED CODE END

  const [gameHistory, setGameHistory] = useState(() => {
    // Load gameHistory from localStorage if available, or use an empty array
    const savedGameHistory = localStorage.getItem("gameHistory");
    return savedGameHistory ? JSON.parse(savedGameHistory) : [];
  });

  //UTILS METHODS START
  function getRandomNumbers() {
    const numbers = [0, 1, 2];
    const selectedNumbers = [];

    // Randomly select the first number
    const firstIndex = Math.floor(Math.random() * numbers.length);
    const firstNumber = numbers[firstIndex];
    selectedNumbers.push(firstNumber);

    // Remove the selected number from the array
    numbers.splice(firstIndex, 1);

    // Randomly select the second number from the updated array
    const secondIndex = Math.floor(Math.random() * numbers.length);
    const secondNumber = numbers[secondIndex];
    selectedNumbers.push(secondNumber);

    return selectedNumbers;
  }
  const clearLocalStorage = () => {
    // Iterate over all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Remove the key-value pair from localStorage
      localStorage.removeItem(key);
    }
  };
  //UTILS METHODS START

  //UPDATE TEAM RESULTS METHODS START
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

      // Update other stats
      updatedTeamsData[team1Index] = {
        ...updatedTeamsData[team1Index],
        goalsScored: updatedTeamsData[team1Index].goalsScored + team1Score,
        goalsConceded: updatedTeamsData[team1Index].goalsConceded + team2Score,
        history: [...updatedTeamsData[team1Index].history, 1], // Append 1 to the history array
      };
      updatedTeamsData[team2Index] = {
        ...updatedTeamsData[team2Index],
        goalsScored: updatedTeamsData[team2Index].goalsScored + team2Score,
        goalsConceded: updatedTeamsData[team2Index].goalsConceded + team1Score,
        history: [...updatedTeamsData[team2Index].history, 1], // Append 1 to the history array
      };
      // Find the index of the 3rd team
      const thirdTeamIndex = 3 - team1Index - team2Index;
      // Update history for the 3rd team by appending '0'
      updatedTeamsData[thirdTeamIndex] = {
        ...updatedTeamsData[thirdTeamIndex],
        history: [...updatedTeamsData[thirdTeamIndex].history, 0], // Append 0 to the history array
      };

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

  //UPDATE TEAM RESULTS METHODS END

  // Function to find teams with consecutive games
  const findTeamsWithConsecutiveGames = (teamsData, consecutiveCount) => {
    return teamsData.filter((team) => {
      const lastGames = team.history
        ? team.history.slice(-consecutiveCount)
        : [];
      const sum = lastGames.reduce((acc, val) => acc + val, 0);
      return sum === consecutiveCount;
    });
  };
  useEffect(() => {
    // Check if any team has consecutiveGames = 3
    const teamsWithThreeConsecutiveGames = findTeamsWithConsecutiveGames(
      teamsData,
      3
    );
    if (teamsWithThreeConsecutiveGames[0]) {
      const teamIndex = teamsData.findIndex(
        (team) => team.name === teamsWithThreeConsecutiveGames[0].name
      );
      const nextTeamIndex = (teamIndex + 1) % teamsData.length;
      setCurrentTeams([
        teamsData[nextTeamIndex],
        teamsData[(nextTeamIndex + 1) % teamsData.length],
      ]);
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

        // Find the next team that is neither the winner nor the loser of the last game
        const nextTeam = teamsData.find(
          (team) => team.name !== lastGame.team1 && team.name !== lastGame.team2
        );
        if (winner) {
          setCurrentTeams([
            teamsData.find((team) => team.name === winner),
            nextTeam,
          ]);
        } else {
          // If it was a draw, compare consecutiveGames
          const teamsWithTwoConsecutiveGames = findTeamsWithConsecutiveGames(
            teamsData,
            2
          );
          if (teamsWithTwoConsecutiveGames[0]) {
            const benchTeam = teamsWithTwoConsecutiveGames[0];
            const teamStays = teamsData.filter(
              (team) =>
                team.name !== benchTeam.name && team.name !== nextTeam.name
            );
            console.log(JSON.stringify(teamStays[0]) + " - Team stays");
            setCurrentTeams([teamStays[0], nextTeam]);
          } else {
            //if a draw and it was the first game
            const teamNamesToRandomlyChooseFrom = [
              lastGame.team1,
              lastGame.team2,
            ];

            const teamNameStays =
              teamNamesToRandomlyChooseFrom[Math.floor(Math.random() * 2)];

            const teamStays = teamsData.filter(
              (team) => team.name === teamNameStays
            );
            setCurrentTeams([teamStays[0], nextTeam]);
          }
        }
      }
    }
  }, [gameHistory, teamsData]);

  useEffect(() => {
    // Your existing useEffect logic remains unchanged
    // Remember to update localStorage after updating states
  }, [gameHistory]);

  useEffect(() => {
    // Save teamsData to localStorage whenever it changes
    localStorage.setItem("teamsData", JSON.stringify(teamsData));
  }, [teamsData]);
  useEffect(() => {
    // Save currentTeams to localStorage whenever it changes
    localStorage.setItem("currentTeams", JSON.stringify(currentTeams));
  }, [currentTeams]);

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
  const [menuOpen, setMenuOpen] = useState(false);

  const startNewTournament = () => {
    if (confirming) {
      // Clear localStorage and reset tournament data
      localStorage.removeItem("teamsData");
      localStorage.removeItem("gameHistory");
      localStorage.removeItem("currentTeams");
      localStorage.removeItem("snapshotList");

      setTeamsData([
        {
          name: "Orange 🟠",
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsConceded: 0,
          consecutiveGames: 0,
          history: [], // Initialize an empty history array
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
          history: [], // Initialize an empty history array
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
          history: [], // Initialize an empty history array
          points: 0,
        },
      ]);
      setGameHistory([]);
      // After clearing localStorage, set currentTeams using getRandomNumbers()
      const randomNumbers = getRandomNumbers();
      setCurrentTeams([
        teamsData[randomNumbers[0]],
        teamsData[randomNumbers[1]],
      ]);
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
        {!menuOpen ? (
          <div className="absolute top-2 left-2">
            <button
              className="text-gray rounded-xl border-gray-600 px-2 active:bg-gray-400"
              onClick={() => setMenuOpen(true)}
            >
              Menu
            </button>
          </div>
        ) : (
          <div>
            <button
              className="text-gray rounded-xl border-gray-600 px-2 active:bg-gray-400"
              onClick={() => setMenuOpen(false)}
            >
              Hide Menu
            </button>
            {/* Add other menu buttons here */}

            <div className="flex flex-col items-center bg-white w-full">
              <button
                className="w-2/3 start-btn mt-4 border-orange-300 rounded-lg bg-green-500 text-white active:bg-gray-400"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
              <button
                className="w-2/3 start-btn mt-4 border-orange-300 rounded-lg bg-red-400 text-white active:bg-gray-400"
                onClick={() => restoreSnapshot()}
              >
                Cancel Last Game
              </button>
              <button
                className="w-2/3 start-btn mt-4 mb-4 border-orange-300 rounded-lg bg-red-800 text-orange-300 active:bg-gray-400"
                onClick={startNewTournament}
              >
                Start New Tournament
              </button>
              {/* Conditional rendering for confirmation */}
              {confirming && (
                <div className="confirm-container">
                  <p>Are you sure you want to start a new tournament?</p>
                  <button
                    className="confirm-btn w-1/2 rounded-lg active:bg-gray-400"
                    onClick={startNewTournament}
                  >
                    Yes
                  </button>
                  <button
                    className="confirm-btn w-1/2 rounded-lg active:bg-gray-400"
                    onClick={() => setConfirming(false)}
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <Timer
          time={time}
          setTime={setTime}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      </div>

      {!isActive ? (
        <h2 className="font-extrabold text-2xl text-center">
          Next Match <br />
          <span className="text-xl">
            {currentTeams[0].name} vs. {currentTeams[1].name}
          </span>
        </h2>
      ) : (
        <LiveMatch
          teams={currentTeams}
          updateResults={updateResults}
          time={time}
        />
      )}

      <Table teams={teamsData} />
      <GameHistory history={gameHistory} />
    </div>
  );
};
export default App;
