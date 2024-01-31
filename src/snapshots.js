const makeSnapshot = () => {
  const teamsData = JSON.parse(localStorage.getItem("teamsData"));
  const currentTeams = JSON.parse(localStorage.getItem("currentTeams"));
  const gameHistory = JSON.parse(localStorage.getItem("gameHistory"));

  const snapshot = {
    teamsData: teamsData,
    currentTeams: currentTeams,
    gameHistory: gameHistory,
  };
  let snapshotList = JSON.parse(localStorage.getItem("snapshotList")) || [];
  snapshotList.push(snapshot);
  localStorage.setItem("snapshotList", JSON.stringify(snapshotList));
};

const restoreSnapshot = () => {
  let snapshotList = JSON.parse(localStorage.getItem("snapshotList"));
  if (snapshotList && snapshotList.length > 0) {
    // Retrieve the last snapshot
    const snapshot = snapshotList.pop();
    console.log("Restoring snapshot:", snapshot);

    // Save the snapshot values to localStorage
    localStorage.setItem("teamsData", JSON.stringify(snapshot.teamsData));
    localStorage.setItem("gameHistory", JSON.stringify(snapshot.gameHistory));
    localStorage.setItem("currentTeams", JSON.stringify(snapshot.currentTeams));

    // Update the snapshot list in localStorage
    localStorage.setItem("snapshotList", JSON.stringify(snapshotList));

    // Refresh the page to reflect the restored state
    window.location.reload();

    // Return the restored snapshot
    return snapshot;
  } else {
    console.log("Snapshot list is empty");
    return null;
  }
};

export { makeSnapshot, restoreSnapshot };
