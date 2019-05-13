import clock from "clock";
import * as util from "./utils";
import { HeartRateSensor } from "heart-rate";
import document from "document";
import * as messaging from "messaging";
import { display } from "display";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { preferences } from "user-settings";

const heartImage = document.getElementById("hrm-img");
const separator = document.getElementById("separator");

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});

document.getElementById("activity-data").text = today.adjusted.steps;
console.log(preferences.clockDisplay);


/************** Date/Time ******************************/
let date = document.getElementById("date");
let time = document.getElementById("time");

clock.granularity = "seconds"; // seconds, minutes, hours
clock.ontick = (evt) => {
   date.text = (evt.date.toString().slice(0,7).toUpperCase() + evt.date.toString().slice(7,10));
   let hours = evt.date.getHours();
   if (preferences.clockDisplay === "12h") {
      hours = (hours + 24) % 12 || 12;
   }
   let mins = ("0" + evt.date.getMinutes()).slice(-2);
   time.text = hours + ":" + mins;
}

/************** Heartrate ******************************/
const hrmData = document.getElementById("hrm-data");
const sensors = [];
var hrInterval = null;

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate ? hrm.heartRate : 0;
    clearInterval(hrInterval);
    hrInterval = setInterval(function() {
      if (heartImage.href === 'assets/hr_solid.png'){
        heartImage.href = 'assets/heartrate.png';
      } else{
        heartImage.href = 'assets/hr_solid.png';
      }
    }, (30*1000)/hrm.heartRate);
  });
  sensors.push(hrm);
  hrm.start();
  
} else {
  hrmData.style.display = "--";
}

/************** Activity ******************************/
let background = document.getElementById("background");
const activityImage = document.getElementById("activity-img");
const activityData = document.getElementById("activity-data");

background.onclick = function(evt) { 
  
  switch (activityImage.href){
    case 'assets/activities/steps.png':
      activityImage.href = 'assets/activities/calories.png';
      if (appbit.permissions.granted("access_activity")) {
        activityData.text = today.adjusted.calories;
      }
      break;
    case 'assets/activities/calories.png':
      activityImage.href = 'assets/activities/distance.png';
      if (appbit.permissions.granted("access_activity")) {
        activityData.text = today.adjusted.distance;
      }
      break;
    case 'assets/activities/distance.png':
      activityImage.href = 'assets/activities/floors.png';
      if (appbit.permissions.granted("access_activity")) {
        activityData.text = today.adjusted.elevationGain;
      }
      break;
    case 'assets/activities/floors.png':
      activityImage.href = 'assets/activities/activity.png';
      if (appbit.permissions.granted("access_activity")) {
        activityData.text = today.adjusted.activeMinutes;
      }
      break;
    case 'assets/activities/activity.png':
      activityImage.href = 'assets/activities/steps.png';
      if (appbit.permissions.granted("access_activity")) {
        activityData.text = today.adjusted.steps;
      }
      break;
    default:
      console.log(activityImage.href);
      break;
  }
}

/************** Weather ******************************/
const weatherImage = document.getElementById("weather-img");
const weatherData = document.getElementById("weather-data");

// Request weather data from the companion
function fetchWeather() {
  console.log('Fetch')
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.log('Socket Open')
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

// Display the weather data received from the companion
function processWeatherData(data) {
  weatherData.text = Math.round( data.temperature ) + '&#176;';
  
  switch (data.conditions){
    case 'Clouds':
      weatherImage.href = 'assets/weather/fewclouds-day.png';
      break;
    case 'Clear':
      weatherImage.href = 'assets/weather/clearsky-day.png';
      break;
    case 'Snow':
      weatherImage.href = 'assets/weather/snow.png';
      break;
    case 'Rain':
      weatherImage.href = 'assets/weather/rain.png';
      break;
    case 'Drizzle':
      weatherImage.href = 'assets/weather/showerrain.png';
      break;
    case 'Thunderstorm':
      weatherImage.href = 'assets/weather/thunderstorm.png';
      break;
    default:
      weatherImage.href = 'assets/weather/mist.png';
      break;
  }
}

/*********** Styling **********************************/
function switchColor(color){
  switch (color){
        case 'black':
          weatherImage.style.fill = '#7898f8';
          activityImage.style.fill = '#7898f8';
          heartImage.style.fill = '#7898f8';
          time.style.fill = '#7898f8';
        
          weatherData.style.fill = 'white';
          activityData.style.fill = 'white';
          hrmData.style.fill = 'white';
          date.style.fill = 'white';
          separator.style.fill = 'white';
          break;
        //Slate Press
        case '#1b2c40':
          weatherImage.style.fill = '#7898f8';
          activityImage.style.fill = '#7898f8';
          heartImage.style.fill = '#7898f8';
          time.style.fill = '#7898f8';
        
          weatherData.style.fill = 'white';
          activityData.style.fill = 'white';
          hrmData.style.fill = 'white';
          date.style.fill = 'white';
          separator.style.fill = 'white';
          break;
        //Dark Green
        case '#394003':
          weatherImage.style.fill = '#FFFF00';
          activityImage.style.fill = '#FFFF00';
          heartImage.style.fill = '#FFFF00';
          time.style.fill = '#FFFF00';
        
          weatherData.style.fill = 'white';
          activityData.style.fill = 'white';
          hrmData.style.fill = 'white';
          date.style.fill = 'white';
          separator.style.fill = 'white';
          break;
        //Violet
        case '#a51e7c':
          weatherImage.style.fill = 'plum';
          activityImage.style.fill = 'plum';
          heartImage.style.fill = 'plum';
          time.style.fill = 'plum';
        
          weatherData.style.fill = 'white';
          activityData.style.fill = 'white';
          hrmData.style.fill = 'white';
          date.style.fill = 'white';
          separator.style.fill = 'white';
          break;
        case 'white':
          weatherImage.style.fill = 'red';
          activityImage.style.fill = 'red';
          heartImage.style.fill = 'red';
          time.style.fill = 'red';
        
          weatherData.style.fill = 'black';
          activityData.style.fill = 'black';
          hrmData.style.fill = 'black';
          date.style.fill = 'black';
          separator.style.fill = 'black';
          break;
        default:
          weatherImage.style.fill = '#7898f8';
          activityImage.style.fill = '#7898f8';
          heartImage.style.fill = '#7898f8';
          time.style.fill = '#7898f8';
        
          weatherData.style.fill = 'white';
          activityData.style.fill = 'white';
          hrmData.style.fill = 'white';
          date.style.fill = 'white';
          separator.style.fill = 'white';
          break;
      }
}

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    background.style.fill = color;
    switchColor(color);
  }
  
  if (evt.data.temperature) {
    processWeatherData(evt.data);
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
  // Fetch weather when the connection opens
  fetchWeather();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};
