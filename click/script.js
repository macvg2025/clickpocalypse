let gameData = {};

// Fetch the JSON
fetch('click/data.json')
  .then(response => response.json())
  .then(data => {
    gameData = data;
    console.log('Game data loaded:', gameData);

    // Optional: initialize the game after loading
    initGame();
  })
  .catch(error => {
    console.error('Error loading game data:', error);
  });

// Example init function
function initGame() {
    // Display upgrades, buildings, etc.
    displayBuildings();
    displayUpgrades();
    displayAchievements();
}

