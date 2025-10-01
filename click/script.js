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

function displayUpgrades() {
    const upgradesList = document.getElementById('upgrades-list');
    upgradesList.innerHTML = ''; // Clear anything already there

    gameData.clickUpgrades.forEach((upgrade, index) => {
        const div = document.createElement('div');
        div.className = 'upgrade';
        div.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>Cost: ${upgrade.cost}</p>
            <p>Effect: ${upgrade.effect}</p>
            <button onclick="buyUpgrade(${index})">Buy</button>
        `;
        upgradesList.appendChild(div);
    });
}

function buyUpgrade(index) {
    const upgrade = gameData.clickUpgrades[index];
    console.log('Bought upgrade:', upgrade.name);
    // Here you would subtract cost, add multiplier, trigger animation, etc.
}
