import React from "react";

const GameHistory = ({ history }) => {
  return (
    <div className="game-history w-full mt-4">
      <h2 className="font-extrabold text-2xl">Game History</h2>
      <ol>
        {history.map((game, index) => (
          <li key={index}>
            {index + 1}. {game.team1} - {game.team2} {game.score}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default GameHistory;
