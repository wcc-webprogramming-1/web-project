import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { WebSocketServer } from "ws";

const webSocketServer = {
	name: 'web-socket-server',
	configureServer(server: any) {
		const webSocketServer = new WebSocketServer({ noServer: true });

		webSocketServer.on("connection", (socket, request) => {
			if (!(globalThis as any).WebsocketSession) {
				socket.close(1011, "Internal server error");
				return;
			}

			new ((globalThis as any).WebsocketSession)(socket, request.connection.remoteAddress);
		})

		server.httpServer.on("upgrade", (request: any, socket: any, head: any) => {
			if (request.url !== "/api/v1/realtime") {
				return;
			}

			webSocketServer.handleUpgrade(request, socket, head, (socket: any) => {
				webSocketServer.emit("connection", socket, request);
			});
		});
	}
}

export default defineConfig({
	plugins: [sveltekit(), webSocketServer],
});
