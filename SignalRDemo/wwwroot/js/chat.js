"use strict";

// ------------------------------------------------------------------------------------------------
// On page load actions.
// ------------------------------------

// Build hub connection with mapped URL from Startup.cs.
const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
// Disable send button until connection is established.
document.getElementById("messageInput").disabled = true;
// Initialize the connection form.
const connectionForm = document.getElementById("connection-form");
const messageForm = document.getElementById("message-form");
// ------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------
// Declare events where client receives action from server.
//-------------------------------------

// When the client receives a message, append the message to the ul#messagesList.
connection.on("ReceiveMessage", (user, message) => {
    const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const encodedMsg = user + ": " + msg;
    const p = document.createElement("p");
    const div = document.createElement("div");
    const lastChatItem = document.getElementById("messagesList").firstChild;
    div.className = "list-group-item list-group-item-action";
    p.textContent = encodedMsg;
    p.classList.add("list-group-item");
    div.appendChild(p);
    document.getElementById("messagesList").insertBefore(div, lastChatItem);
});
//-------------------------------------------------------------------------------------------------




connectionForm.addEventListener("submit", e => {
    e.preventDefault();
    if (document.getElementById("userInput").value) {
        // Disable the username form
        document.getElementById("userInput").disabled = true;
        document.getElementById("connection-form-btn").disabled = true;
        connectionForm.style.display = "none";

        // Start the connection.
        connection.start().then(() => {
            document.getElementById("messageInput").disabled = false;
        }).catch(err => {
            return console.error(err.toString());
        });
    } else {
        alert("You need to input a username.");
    }
})




//-------------------------------------------------------------------------------------------------
// Declare events the client starts that will be sent up to the server.
//-------------------------------------

// Send a message to the server.
messageForm.addEventListener("submit", e => {
    const user = document.getElementById("userInput").value;
    const message = document.getElementById("messageInput").value;

    // Call .invoke on "connection" to send up event to server hub.
    connection.invoke("SendMessage", user, message).catch(err => {
        return console.error(err.toString());
    })

    document.getElementById("messageInput").value = "";
    e.preventDefault();
});
//-------------------------------------------------------------------------------------------------
