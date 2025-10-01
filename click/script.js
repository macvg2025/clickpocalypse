// ======== GAME DATA ========
let gameData = {};
let totalClicks = 0;
let clickPower = 1; // base click

// ======== FETCH JSON ========
fetch('click/data.json')
  .then(response => response.json())
  .then(data => {
    gameData = data;
    console.log('Game data loaded:', gameData);
    initGame();
  })
  .catch(error => console.error('Error loading game data:', error));

// ======== INITIALIZE GAME ========
function initGame() {
    displayClickCount();
    displayUpgrades();
    displayBuildings();
    displayAchievements();
    startEventLoop();
    startAchievementCheck();
    startBuildingProduction();
}

// ======== CLICK SYSTEM ========
const blackHole = document.getElementById('black-hole');
blackHole.addEventListener('click', () => {
    totalClicks += clickPower;
    displayClickCount();

    // Black hole click animation
    blackHole.classList.add('click-animate');
    setTimeout(() => blackHole.classList.remove('click-animate'), 100);

    // Particle burst
    createClickParticles();
});

// ======== DISPLAY FUNCTIONS ========
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

        const upgradeDiv = document.getElementById('upgrades-list').children[index];
        upgradeDiv.classList.add('bought');
        setTimeout(() => upgradeDiv.classList.remove('bought'), 300);

        showEvent(`Upgrade purchased: ${upgrade.name}!`);
        console.log(`Bought upgrade: ${upgrade.name}, click power: ${clickPower}`);
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

        const buildingDiv = document.getElementById('buildings-list').children[index];
        buildingDiv.classList.add('bought');
        setTimeout(() => buildingDiv.classList.remove('bought'), 300);

        showEvent(`Building acquired: ${building.name}!`);
        console.log(`Bought building: ${building.name}, total: ${building.amount}`);
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
                showEvent(`Achievement Unlocked: ${ach.name}!`);
                console.log(`Achievement unlocked: ${ach.name}`);
            }
        });
    }, 1000);
}

// --- EVENTS / CHAOS ---
function startEventLoop() {
    setInterval(() => {
        if(!gameData.events) return;
        if(Math.random() < 0.1) { 
            const randomIndex = Math.floor(Math.random() * gameData.events.length);
            const event = gameData.events[randomIndex];
            triggerEvent(event.message, event.shake || false);

            if(event.clickMultiplier) clickPower *= event.clickMultiplier;
            if(event.duration) {
                setTimeout(() => {
                    if(event.clickMultiplier) clickPower /= event.clickMultiplier;
                }, event.duration * 1000);
            }
        }
    }, 1000);
}

function showEvent(message) {
    const eventsPanel = document.getElementById('events-panel');
    const p = document.createElement('p');
    p.textContent = message;
    p.className = 'event-message';
    eventsPanel.appendChild(p);
    setTimeout(() => p.remove(), 5000);
}

function triggerEvent(message, shake = false) {
    showEvent(message);
    if(shake) {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 300);
    }
}

// --- PARTICLES ---
function createClickParticles() {
    for(let i = 0; i < 6; i++){ // multiple particles per click
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = blackHole.offsetLeft + 40 + 'px';
        particle.style.top = blackHole.offsetTop + 40 + 'px';
        document.body.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50 + 20;
        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
        particle.style.opacity = '0';

        setTimeout(() => particle.remove(), 500);
    }
}

// --- BUILDING PRODUCTION LOOP ---
function startBuildingProduction() {
    setInterval(() => {
        gameData.buildings.forEach(building => {
            if(building.amount && building.production) totalClicks += building.production * building.amount;
        });
        displayClickCount();
    }, 1000);
}
