import document from "document";
import * as messaging from "messaging";

/* TODO
- show phone connection problems
- show age of last measurement
- graphs of temperature?
- other info like signal strength?
- color changes?
- stop fetching on screen off
- fetch on a half hour timer?
*/

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const connection = document.getElementById("connection");
connection.text = messaging.peerSocket.readyState === messaging.peerSocket.OPEN ? "OPEN" : "not open";

function fetchTemp() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    connection.text = "fetching";
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'getTemp'
    });
  } else {
    connection.text = "not ready yet";
  }
}

setInterval(fetchTemp, 60000);

function processSomething(data) {
  temperature.text = (data.temperature_C * 1.8 + 32).toFixed(1).toString() + "°F";
  humidity.text = data.humidity.toString() + "%";
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Fetch weather when the connection opens
  fetchTemp();
}

// Listen for messages from the companion
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    connection.text = "done";
    processSomething(evt.data);
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}