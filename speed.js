
"use strict";

class SpeedTracker{
    constructor() {
        this.speedLimit = 0;
        this.speedSi = 0;
        this.globalUnit = "mph";
        this.settings;
        this.checkOrientation = this.checkOrientation.bind(this);
    }
    checkOrientation() {
        const settingsElement = document.getElementsByClassName("settings")[0];
        // if (!settingsElement) return; // Avoid errors if element is missing
        //
        if (this.isMobile()) {
            if (window.innerWidth > window.innerHeight) {
                settingsElement.style.display = "none";
                document.getElementById("speed").style.fontSize = "40vh";
            } else {
                settingsElement.style.display = "flex";
                document.getElementById("speed").style.fontSize = "13vh";
            }
        }
    }
    isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) ||
            window.matchMedia("(max-width: 800px)").matches ||
            ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    // SETTINGS CODE START
    saveSettings(){
        const settings = {
            speedUnit: document.getElementById("speedUnit")?.value || "mph",
            bgColor: document.getElementById("bgColor")?.value || "#000000",
            speedColor: document.getElementById("speedColor")?.value ||  "#FFFFFF",
            unitColor: document.getElementById("unitColor")?.value || "#FFFFFF",
            streetColor: document.getElementById("streetColor")?.value || "#FFFFFF",
            limitPosition: document.getElementById("speedPosition")?.value || "right"
        }
        localStorage.setItem("userSettings", JSON.stringify(settings));
        //     // Handle background image
        const bgImageInput = document.getElementById("bgImage");
        if (bgImageInput && bgImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                localStorage.setItem("bgImage", event.target.result);
                document.body.style.backgroundImage = `url(${event.target.result})`;
            };
            reader.readAsDataURL(bgImageInput.files[0]);
        }
        this.settings = settings;
        this.updateUI(this.currentSpeed, this.speedLimit, this.settings.speedUnit, document.getElementById("street").innerText);
        this.loadSettings();
    }
    loadSettings (){
        const settings = JSON.parse(localStorage.getItem("userSettings"));
        document.getElementById("speedUnit").value =settings.speedUnit;
        document.body.style.background = settings.bgColor ||"black";
        document.getElementById("speed").style.color = settings.speedColor;
        if(settings.limitPosition=="left") {
            document.getElementsByClassName("content")[0].style.left = "5%";
            document.getElementsByClassName("content")[0].style.right= "unset";
        }else{
            document.getElementsByClassName("content")[0].style.right= "5%";
            document.getElementsByClassName("content")[0].style.left = "unset";
        }

        document.getElementById("speed").style.color= settings.speedColor || "#FFFFFF";
        document.getElementById("unit").style.color= settings.unitColor || "#FFFFFF";
        document.getElementById("street").style.color= settings.streetColor || "#FFFFFF";
        document.getElementById("speedPosition").value= settings.limitPosition || "right";
        document.getElementById("bgColor").value = settings.bgColor;
        document.getElementById("speedColor").value = settings.speedColor;
        document.getElementById("unitColor").value = settings.unitColor;
        document.getElementById("streetColor").value = settings.streetColor;
        // image processing
        const savedBg = localStorage.getItem("bgImage");
        if (savedBg) {
            document.body.style.backgroundImage = `url(${savedBg})`;
        }

        this.globalUnit = settings.speedUnit;
        return settings;


    }
    resetSettings(){
        const settings = {
            speedUnit: "mph",
            bgColor:  "#000000",
            speedColor: "#FFFFFF",
            unitColor:  "#FFFFFF",
            streetColor:  "#FFFFFF",
            limitPosition:  "right"
        }
        localStorage.setItem("userSettings", JSON.stringify(settings));
        localStorage.setItem("bgImage", "")
        document.getElementById("bgImage").value = "";
        this.settings = settings;
        this.updateUI(this.currentSpeed, this.speedLimit, this.settings.speedUnit, document.getElementById("street").innerText);
        this.loadSettings();
    }
    // SETTIGNS CODE END
    convertSpeed(speed){
        let unit  = this.settings.speedUnit || this.globalUnit || "mph";
        // let unit  =  "mph";

        if (unit ==="local"){
            if (this.globalUnit==="mph"){
                return Math.round(speed*2.237);
            }else{
                return Math.round(speed*3.6);
            }
        }
        let factor = unit === "mph" ? 2.237 : 3.6;
        return Math.round(speed * factor);
    }
    updateUI(speed, speedLimit, unit, streetName) {
        const convertedSpeed = this.convertSpeed(speed);
        const convertedLimit = this.convertSpeed(this.speedSi);

        if (convertedSpeed > convertedLimit) {
            document.getElementById("speed").style.color = "red";
        } else if (convertedLimit - convertedSpeed < 5) {
            document.getElementById("speed").style.color = "orange";
        } else {
            document.getElementById("speed").style.color = "white";
        }
        document.getElementById("speed").innerText = this.convertSpeed(speed) ?? 0 // - put the speed into that div
        document.getElementById("speedLimit").innerText = this.convertSpeed(this.speedSi); // - speed limit value
        document.getElementById("unit").innerText = this.settings.speedUnit === "local" ?  this.globalUnit : this.settings.speedUnit;// -speed unit value
        document.getElementById("street").innerText = streetName; // - street name
    }
    // This is the API function - base
    async getLocation(lat, long) {
        try {
            const res = await fetch(`https://devweb2024.cis.strath.ac.uk/aes02112-nodejs/speed?lat=${lat}&lon=${long}`);
            const data = await res.json();
            if (data.status === "OK") {
                this.speedLimit = data.localSpeedLimit;
                this.speedSi = data.siSpeed;
                this.globalUnit = data.localSpeedUnit;

                this.updateUI(this.currentSpeed || 0, this.speedLimit, this.globalUnit, data.name);
            } else {
                this.updateUI(0, 0, "Unavailable", "Can't find the street name here");
            }
        } catch (err) {
            console.log("Error getting the location", err);
        }
    }
    // build in top of API - get coords
    handleGPSInfo(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const speed = position.coords.speed ;
        this.currentSpeed = speed; // Store current speed
        this.updateUI(speed, this.speedLimit, this.globalUnit, document.getElementById("street").innerText);
        this.getLocation(lat, long);
    }
    // do it every n seconds - build on top of handleGPS
    trackSpeed() {
        if (!navigator.geolocation) {
            console.log("Geolocation not supported");
            return;
        }
        navigator.geolocation.watchPosition(
            (pos) => this.handleGPSInfo(pos),
            (err) => console.log("Geolocation error:", err),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 2000 }
        );
    }
    init(){
        this.settings = this.loadSettings();
        this.updateUI(0, "--", this.globalUnit, "Loading...");
        // Add orientation check listener
        window.addEventListener("resize", this.checkOrientation);
        // Run initial orientation check
        this.checkOrientation();
        this.trackSpeed();
        // window.addEventListener("resize", this.checkOrientation.bind(this));
        // if ("serviceWorker" in navigator) {
        //     navigator.serviceWorker.register("./serviceworker.js")
        //         .then(() => console.log("Service Worker Registered"))
        //         .catch((err) => console.log("Service Worker Registration Failed", err));
        // }

        console.log("init called");
    }
    cleanup() {
        // Remove event listener when needed
        window.removeEventListener("resize", this.checkOrientation);
    }
}

const tracker = new SpeedTracker();
function handleGPSInfo(pos){
    tracker.handleGPSInfo(pos);//testing only
}

window.addEventListener("resize", tracker.checkOrientation);
document.addEventListener('DOMContentLoaded', ()=> {
    tracker.init();
});