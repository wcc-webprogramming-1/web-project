/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { version } from "$service-worker"

console.log("(Re-?)started service worker. Version: " + version);
const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));
/**
 * @type {WebSocket}
 */
let socket;
connectSocket();

/**
 * @type {string | undefined}
 */
let userToken = undefined;

const outstandingRequests = new Map();

function connectSocket() {
  socket = new WebSocket(sw.registration.scope.replace("https", "wss").replace("http", "ws") + "api/v1/realtime");
    
  socket.binaryType = "arraybuffer";

  socket.addEventListener("error", e => {
    // reconnect

    console.log("WS error: " + e);

    connectSocket();
  });

  socket.addEventListener("close", () => {
    // reconnect

    console.log("WS closed");

    connectSocket();
  });

  socket.addEventListener("open", () => {
    console.log("WS opened");

    if (userToken !== undefined) {
      socket.send(JSON.stringify({
        type: "auth",
        token: userToken
      }));
    }
  })

  socket.addEventListener("message", m => {
    console.log("Service Worker recieved WS message: " + m.data);

    const data = JSON.parse(m.data);

    if (data.for == "service-worker") {
      console.log("Handling message from server: " + JSON.stringify(data.content));

      handleMessage(data.content);
    }

    if (data.for == "client") {
      const id = data.id;

      if (id === undefined) {
        sw.clients.matchAll().then(clients => {
          clients.forEach(c => {
            c.postMessage(JSON.stringify({
              type: "sse",
              content: data.content
            }));
          });
        })

        return;
      }

      const content = data.content;

      const port = outstandingRequests.get(id);

      console.log("Port: " + port)

      if (!port) return;

      console.log("Sending response to client: " + JSON.stringify(content));
      port.postMessage(JSON.stringify({
        type: "response",
        content: { kind: "ok", contents: content }
      }));
    }
  });
}

function generateRequestId() {
  return Math.floor(Math.random() * 1000000);
}

sw.addEventListener("message", m => {
  console.log("Service Worker recieved message: " + m.data);

  const data = JSON.parse(m.data);
  
  if (data.type === "auth") {
    console.log("Authenticating with server, ws: " + socket.readyState);

    userToken = data.token;

    if (socket.readyState !== WebSocket.OPEN) return;

    console.log("Sending auth message to server");
    socket.send(JSON.stringify({
      type: "auth",
      token: userToken
    }));
  }

  if (data.type === "deauth") {
    userToken = undefined;

    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: "deauth"
    }));
  }

  const source = m.ports[0];

  if (!source) return;

  if (data.type === "request") {
    const id = generateRequestId();
    const content = data.content;

    if (socket.readyState !== WebSocket.OPEN) {
      source.postMessage(JSON.stringify({
        type: "response",
        content: { kind: "error", contents: "Socket state: " + socket.readyState }
      }));

      return;
    }

    outstandingRequests.set(id, source);

    socket.send(JSON.stringify({
      type: "request",
      from: "client",
      id,
      content
    }));
  }
})

/**
 * @param {any} content
 */
function handleMessage(content) {
  console.log("Handling message: " + content);

  
}