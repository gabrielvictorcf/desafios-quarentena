const startTime = Date.now();
const displayTime = () =>{
    let currentTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("time-counter").innerHTML = currentTime;
};

var displayBySecond = window.setInterval(displayTime, 1000);