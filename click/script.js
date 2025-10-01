let gameData = {};
let totalClicks = 0;
let clickPower = 1; // base click

// Fetch JSON
fetch('click/data.json')
  .then(response => response.json())
  .then(data => {
    gameData = data;
    console.log('Game data loaded:', gameData);
    initGame();
  })
  .catch(error => console.error('Error loading game data:', error));

// Initialize game
function initGame() {
    displayClickCount();
    displayUpgrades();
    displayBuildings();
    displayAchievements();
}

// --- Click system ---
const mainClickBtn = document.getElementById('main-click');
mainClickBtn.addEventListener('click', () => {
    totalClicks += clickPower;
    displayClickCount();
});

// Update click count display
function displayClickCount() {
    const clickCountEl = document.getElementById('click-count');
    clickCountEl.textContent = `Clicks: ${totalClicks}`;
}

// --- Upgrades ---
function displayUpgrades() {
    const upgradesList = document.getElementById('upgrades-list');
    upgradesList.innerHTML = '';

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
    if(totalClicks >= upgrade.cost) {
        totalClicks -= upgrade.cost;
        clickPower *= upgrade.multiplier;
        displayClickCount();
        console.log(`Bought upgrade: ${upgrade.name}, new click power: ${clickPower}`);
    } else {
        console.log(`Not enough clicks for ${upgrade.name}`);
    }
}

// --- Buildings ---
function displayBuildings() {
    const buildingsList = document.getElementById('buildings-list');
    buildingsList.innerHTML = '';

    if(!gameData.buildings) return;

    gameData.buildings.forEach((building, index) => {
        const div = document.createElement('div');
        div.className = 'building';
        div.innerHTML = `
            <h3>${building.name}</h3>
            <p>Cost: ${building.cost}</p>
            <p>Clicks/sec: ${building.production}</p>
            <button onclick="buyBuilding(${index})">Buy</button>
        `;
        buildingsList.appendChild(div);
    });
}

function buyBuilding(index) {
    const building = gameData.buildings[index];
    if(totalClicks >= building.cost) {
        totalClicks -= building.cost;
        if(!building.amount) building.amount = 0;
        building.amount++;
        displayClickCount();
        console.log(`Bought building: ${building.name}, total owned: ${building.amount}`);
    } else {
        console.log(`Not enough clicks for ${building.name}`);
    }
}

// --- Achievements ---
function displayAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';

    if(!gameData.achievements) return;

    gameData.achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = 'achievement';
        div.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.requirement}</p>
        `;
        achievementsList.appendChild(div);
    });
}

// --- Basic building production loop ---
setInterval(() => {
    if(!gameData.buildings) return;

    gameData.buildings.forEach(building => {
        if(building.amount) totalClicks += building.production * building.amount;
    });

    displayClickCount();
}, 1000);
