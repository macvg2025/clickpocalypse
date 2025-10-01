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
    startEventLoop();
    startAchievementCheck();
}

// --- Click system ---
const mainClickBtn = document.getElementById('main-click');
mainClickBtn.addEventListener('click', () => {
    totalClicks += clickPower;
    displayClickCount();
});

// Update click count display
function displayClickCount() {
    document.getElementById('click-count').textContent = `Clicks: ${totalClicks}`;
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
        clickPower *= upgrade.multiplier || 1;
        displayClickCount();
        console.log(`Bought upgrade: ${upgrade.name}, new click power: ${clickPower}`);
    }
}

// --- Buildings ---
function displayBuildings() {
    const buildingsList = document.getElementById('buildings-list');
    buildingsList.innerHTML = '';

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
        building.amount = (building.amount || 0) + 1;
        displayClickCount();
        console.log(`Bought building: ${building.name}, total owned: ${building.amount}`);
    }
}

// --- Achievements ---
function displayAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';

    gameData.achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = 'achievement locked';
        div.innerHTML = `
            <h4>${ach.name}</h4>
            <p>${ach.requirement}</p>
        `;
        achievementsList.appendChild(div);
    });
}

function startAchievementCheck() {
    setInterval(() => {
        const achievementsList = document.getElementById('achievements-list');
        gameData.achievements.forEach((ach, index) => {
            if(!ach.unlocked && totalClicks >= ach.requirementValue) {
                ach.unlocked = true;
                const div = achievementsList.children[index];
                div.classList.remove('locked');
                div.classList.add('unlocked');
                console.log(`Achievement unlocked: ${ach.name}`);
                // Optional: trigger visual effect
                showEvent(`Achievement Unlocked: ${ach.name}!`);
            }
        });
    }, 1000);
}

// --- Events / Chaos ---
function startEventLoop() {
    setInterval(() => {
        if(!gameData.events) return;

        // small chance every second to trigger a random event
        if(Math.random() < 0.1) { 
            const randomIndex = Math.floor(Math.random() * gameData.events.length);
            const event = gameData.events[randomIndex];
            showEvent(event.message);
            if(event.clickMultiplier) clickPower *= event.clickMultiplier;
            // Event lasts for a few seconds if it has duration
            if(event.duration) {
                setTimeout(() => {
                    if(event.clickMultiplier) clickPower /= event.clickMultiplier;
                }, event.duration * 1000);
            }
        }
    }, 1000);
}

// Display events in the events panel
function showEvent(message) {
    const eventsPanel = document.getElementById('events-panel');
    const p = document.createElement('p');
    p.textContent = message;
    p.className = 'event-message';
    eventsPanel.appendChild(p);
    // Remove after 5 seconds
    setTimeout(() => p.remove(), 5000);
}

// --- Building production loop ---
setInterval(() => {
    gameData.buildings.forEach(building => {
        if(building.amount) totalClicks += building.production * building.amount;
    });
    displayClickCount();
}, 1000);
