import * as messaging from "messaging";

function getTemp() {
  fetch("https://dan.drown.org/tempapi/").then(response => {
    return response.json()
  }).then((tempJson) => {
    tempResponse(tempJson);
  }).catch(err => {
    console.log(err);
  });
}

function tempResponse(tempData) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(tempData);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.command == "getTemp") {
    getTemp();
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}