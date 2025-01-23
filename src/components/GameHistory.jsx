import React from "react";

const GameHistory = ({ history }) => {
  // A mapping of team name prefixes to their colors
  const teamColors = {
    Orange: "text-orange-500",
    Gray: "text-black",
    Purple: "text-purple-500",
  };

  // Function to determine the appropriate color class
  const getTeamColorClass = (teamName) => {
    const colorKey = Object.keys(teamColors).find((key) =>
      teamName.startsWith(key)
    );
    return teamColors[colorKey] || "text-black"; // Default to black if no match
  };

  return (
    <div className="game-history w-full mt-4">
      <h2 className="font-extrabold text-2xl">Game History</h2>
      <ol>
        {history.map((game, index) => {
          const [score1, score2] = game.score.split("-").map(Number); // Split the score into numbers
          const winningTeam =
            score1 > score2 ? game.team1 : score1 < score2 ? game.team2 : null; // Determine the winning team, null for a draw

          const scoreClass = winningTeam
            ? getTeamColorClass(winningTeam) // Get the winning team's color
            : "bg-gray-800 text-white px-2 py-1 rounded"; // Dark background with white text for a draw

          return (
            <li key={index}>
              {index + 1}. {game.team1} - {game.team2}{" "}
              <span className={`ml-2 ${scoreClass}`}>{game.score}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default GameHistory;
