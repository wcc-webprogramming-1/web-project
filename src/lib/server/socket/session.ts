import type { WebSocket } from "ws";
import { ServerSession } from "../objects/session";
import type { ServerUser } from "../objects/user";

if (import.meta.hot) {
  import.meta.hot!.data.authenticatedSessions ??= new Set<WebsocketSession>();
}

export class WebsocketSession {
  static authenticatedSessions: Set<WebsocketSession> = import.meta.hot?.data.authenticatedSessions ?? new Set<WebsocketSession>();

  static broadcast(data: any) {
    console.log("Broadcasting:", data, "to", WebsocketSession.authenticatedSessions.size, "sessions");

    for (const session of WebsocketSession.authenticatedSessions) {
      session.socket.send(JSON.stringify({
        for: "client",
        content: data,
      }));
    }
  }

  constructor(
    private socket: WebSocket,
    private ip: string | undefined,
  ) {
    socket.on("message", (message) => {
      console.log("Received message:", message.toString());

      this.onMessage(message.toString());
    });

    socket.on("close", () => {
      console.log("Session closed:", this.user?.username);

      WebsocketSession.authenticatedSessions.delete(this);
    })
  }

  private user: ServerUser | undefined = undefined;

  public async authenticate(session_token: string) {
    const session = await ServerSession.load(session_token);

    this.user = session.user
  }

  private onMessage(message: string) {
    try {
      const data = JSON.parse(message.toString());
      this.onData(data);
    } catch (e) {
      console.error("Error handling websocket message:", e);
    }
  }

  private async onData(data: any) {
    if (data.type === "request") {
      const response = await this.handleRequest(data.content);

      this.socket.send(JSON.stringify({
        for: "client",
        id: data.id,
        content: response,
      }));
    }

    if (data.type === "auth") {
      await this.authenticate(data.token);

      console.log("Authenticated session:", this.user!.username);
      WebsocketSession.authenticatedSessions.add(this);
      console.log("Total authenticated sessions:", WebsocketSession.authenticatedSessions.size);
    }

    if (data.type === "deauth") {

      console.log("Deauthenticated session:", this.user?.username);
      this.user = undefined;
    }
  }

  // Can get called during SSR
  public async handleRequest(content: any) {
    switch (content.kind) {
      case "read_events":
        if (this.user === undefined)
          return { };

        Array.from(WebsocketSession.authenticatedSessions.values())
          .filter(s => s.user?.id == this.user?.id)
          .forEach(s => s.socket.send(JSON.stringify({
            for: "client",
            content: {
              type: "read_events"
            }
          })));


        return { };
      default:
        return { };
    }
  }
}

/// HACK!!! DO NOT REMOVE!!!
(globalThis as any).WebsocketSession = WebsocketSession;