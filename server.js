const WebSocket = require("ws");

const PORT_WS = 8080;    // Порт для WebSocket

const server = new WebSocket.Server({ port: PORT_WS });

let buttonState = { btn1: false, btn2: false };

server.on("connection", (ws) => {
    ws.send(JSON.stringify(buttonState)); // Отправляем состояние кнопок при подключении

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.reset) {
            buttonState = { btn1: false, btn2: false }; // Сброс состояния кнопок
        } else if (data.btn1 && !buttonState.btn2) {
            buttonState = { btn1: true, btn2: false }; // Если нажата кнопка 1, обновляем состояние
        } else if (data.btn2 && !buttonState.btn1) {
            buttonState = { btn1: false, btn2: true }; // Если нажата кнопка 2, обновляем состояние
        }

        // Отправляем новое состояние кнопок всем подключенным клиентам
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(buttonState));
            }
        });
    });
});

console.log(`WebSocket сервер запущен на ws://localhost:${PORT_WS}`);