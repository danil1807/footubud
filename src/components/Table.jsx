import React from "react";

const Table = ({ teams }) => {
  // Sort teams by points in descending order
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points; // Сравнение по количеству очков
    } else {
      const goalDifferenceA = a.goalsScored - a.goalsConceded;
      const goalDifferenceB = b.goalsScored - b.goalsConceded;

      if (goalDifferenceA !== goalDifferenceB) {
        return goalDifferenceB - goalDifferenceA; // Сравнение по разнице голов (goalsScored - goalsConceded)
      } else {
        if (a.goalsScored !== b.goalsScored) {
          return b.goalsScored - a.goalsScored; // Сравнение по забитым голам
        } else {
          return 0; // Порядок сортировки не меняется
        }
      }
    }
  });
  return (
    <div className="table-container w-full mt-4">
      <h2 className="font-extrabold text-2xl">Tournament Table</h2>
      <table className="w-full border-collapse border border-gray-500">
        <thead>
          <tr>
            <th className="table-header border border-gray-500">Team</th>
            <th className="table-header border border-gray-500">W</th>
            <th className="table-header border border-gray-500">D</th>
            <th className="table-header border border-gray-500">L</th>
            <th className="table-header border border-gray-500">GA</th>
            <th className="table-header border border-gray-500">GC</th>
            <th className="table-header border border-gray-500">P</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, index) => (
            <tr key={index}>
              <td className="table-data border border-gray-500 text-center">
                {team.name}
              </td>
              <td className="table-data border border-gray-500 text-center">
                {team.wins}
              </td>
              <td className="table-data border border-gray-500 text-center">
                {team.draws}
              </td>
              <td className="table-data border border-gray-500 text-center">
                {team.losses}
              </td>
              <td className="table-data border border-gray-500 text-center">
                {team.goalsScored}
              </td>
              <td className="table-data border border-gray-500 text-center">
                {team.goalsConceded}
              </td>
              <td className="table-data border border-gray-500 text-center font-bold">
                {team.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
