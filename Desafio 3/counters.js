// Displays time since beggining of the game
const startTime = Date.now();
const displayTime = () => {
    let currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("time-counter").innerHTML = currentTime;
};

var displayBySecond = window.setInterval(displayTime, 1000);

// Keeps track of how many asteroids have been destroyed
var asteroidCounter = 0;
const updateAsteroidCounter = () => {
    asteroidCounter++;
    document.getElementById("asteroid-counter").innerHTML = asteroidCounter;
};