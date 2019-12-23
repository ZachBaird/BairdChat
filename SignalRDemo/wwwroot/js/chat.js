"use strict";

// ------------------------------------------------------------------------------------------------
// On page load actions.
// ------------------------------------

// Initialize hub connection with mapped URL from Startup.cs.
const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
// Disable send button until connection is established.
document.getElementById("sendButton").disabled = true;
// ------------------------------------------------------------------------------------------------



//-------------------------------------------------------------------------------------------------
// Declare events where client receives action from server.
//-------------------------------------

// When the client receives a message, append the message to the ul#messagesList.
connection.on("ReceiveMessage", (user, message) => {
    const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const encodedMsg = user + ": " + msg;
    const li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});
//-------------------------------------------------------------------------------------------------



// Start the connection.
connection.start().then(() => {
    document.getElementById("sendButton").disabled = false;
}).catch(err => {
    return console.error(err.toString());
});



//-------------------------------------------------------------------------------------------------
// Declare events the client starts that will be sent up to the server.
//-------------------------------------

// Send a message to the server.
document.getElementById("sendButton").addEventListener("click", e => {
    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;

    // Call .invoke on "connection" to send up event to server hub.
    connection.invoke("SendMessage", user, message).catch(err => {
        return console.error(err.toString());
    })
    e.preventDefault();
});
//-------------------------------------------------------------------------------------------------
