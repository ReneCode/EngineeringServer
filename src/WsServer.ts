import Multiplayer from "./ObjectStore/Multiplayer";
import { objectStoreRequest } from "./ObjectStore/ObjectStoreList";

const WebSocketServer = require("websocket").server;

// https://github.com/theturtle32/WebSocket-Node
//
// https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61

// reconnecgt
// https://dev.to/finallynero/using-websockets-in-react-4fkp

class WsServer {
  wsServer = undefined;
  connections: any[] = [];

  constructor() {
    this.allowWsRequest = this.allowWsRequest.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  listen(httpServer: any) {
    const wsServer = new WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: false
    });
    this.wsServer = wsServer;

    wsServer.on("request", (request: any) => {
      console.log("#WEBSOCKET request");
      if (!this.allowWsRequest(request.origin)) {
        console.log(`websocket request not allowed`);
        request.reject();
        return;
      }
      const connection = request.accept(null, request.origin);
      this.connections.push(connection);

      connection.on("message", (message: any) =>
        this.onMessage(connection, message)
      );

      connection.on("close", (reasonCode: any, description: any) => {
        console.log("#WEBSOCKET close");
        // remove from connections
        this.connections = this.connections.filter(c => c !== connection);
      });
    });
  }

  allowWsRequest(origin: string) {
    // check if ws is allowed
    return true;
  }

  onMessage(sendConnection: any, message: any) {
    // console.log("#WEBSOCKET message received:", message.utf8Data);
    for (let connection of this.connections) {
      let me = false;
      if (connection === sendConnection) {
        me = true;
      }
      // connection.sendUTF(message.utf8Data);
      const inMessage: Multiplayer.ClientMessage = JSON.parse(message.utf8Data);

      const result = objectStoreRequest(inMessage);

      const outMessage: Multiplayer.ServerMessage = {
        me,
        result: result,
        store: inMessage.store,
        type: inMessage.type,
        obj: inMessage.obj
      };
      const outData = JSON.stringify(outMessage);
      // console.log("#WEBSOCKET send:", outData);
      connection.sendUTF(outData);
    }
  }
}

export default WsServer;
