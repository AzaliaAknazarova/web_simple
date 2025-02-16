const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

let buttonState = { btn1: false, btn2: false };

server.on("connection", (ws) => {
    ws.send(JSON.stringify(buttonState));

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.reset) {
            buttonState = { btn1: false, btn2: false };
        } else if (data.btn1 && !buttonState.btn2) {
            buttonState = { btn1: true, btn2: false };
        } else if (data.btn2 && !buttonState.btn1) {
            buttonState = { btn1: false, btn2: true };
        }

        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(buttonState));
            }
        });
    });
});

console.log("WebSocket сервер запущен на ws://localhost:8080");