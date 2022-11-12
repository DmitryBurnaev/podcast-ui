import config from "@/config";
import store from "@/store";

function connectToWS(wsPath, data, handler){
    let wsURL = `${config.webSocketURL}${wsPath}`
    let headersData = {
      "headers": {Authorization: `Bearer ${store.getters.accessToken}`},
    }
    if ("WebSocket" in window) {
      let ws = new WebSocket(wsURL);
      ws.onopen = function() {
        console.log("Sending websocket data");
        ws.send(JSON.stringify({...headersData, ...data}, null));
      };
      ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        handler(data)
      };
      ws.onclose = function() {
        console.log("Closing websocket connection");
      };
      this.webSocket = ws
    }
    else {
      alert("WS not supported, sorry!");
    }
}

export {connectToWS}
