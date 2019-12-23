using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace SignalRDemo.Hubs
{
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("ReceiveMessage", "Server", "Someone has entered the chat...");
        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.All.SendAsync("ReceiveMessage", "Server", "Someone has dropped from the chat...");
        }
    }
}
