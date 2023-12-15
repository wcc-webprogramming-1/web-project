// if we're running on the server
// we should construct a fake `WebSocketSession` object

const klass = (globalThis as any).WebsocketSession;

const inst = klass !== undefined ? new klass({ on: () => {} }, undefined) : undefined;

async function getServiceWorker() {
  if (!("navigator" in globalThis))
    return undefined;

  if (!("serviceWorker" in navigator))
    return undefined;

  if (navigator.serviceWorker.controller !== null)
    return navigator.serviceWorker.controller;

  const w = await navigator.serviceWorker.ready;

  if (w.active !== null)
    return w.active;

  return undefined;
}

export async function sendRealtimeRequest(content: any) {
  if (!("navigator" in globalThis))
    return await inst.handleRequest(content)

  if (!("serviceWorker" in navigator))
    throw new Error("Service workers are not supported by this browser")

  const controller = await getServiceWorker()!;

  if (!controller)
    throw new Error("Service worker is not active");

  const replyChannel = new MessageChannel();

  return await new Promise((resolve, reject) => {
    replyChannel.port1.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type !== "response")
        return;

      const { kind, contents } = data.content;

      (kind === "ok" ? resolve : reject)(contents);
    };

    controller.postMessage(JSON.stringify({
      type: "request",
      content
    }), [replyChannel.port2]);
  });
}

export async function handleServerSentEvent(handler: (data: any) => void) {
  if (!("navigator" in globalThis))
    return;

  navigator.serviceWorker.addEventListener("message", (event) => {
    console.log("Received message from service worker:", event.data);

    const data = JSON.parse(event.data);

    if (data.type !== "sse")
      return;

    handler(data.content);
  });
}

export async function authServiceWorker(token: string) {
  if (!("navigator" in globalThis)) {
    inst.authenticate(token);
    return;
  }

  if ("serviceWorker" in navigator) {
    const controller = await getServiceWorker()!;

    if (controller !== undefined) {
      controller.postMessage(JSON.stringify({
        type: "auth",
        token
      }));
    }
  }
}

export async function deauthServiceWorker() {
  if (!("navigator" in globalThis)) {
    inst.user = undefined;
    return;
  }

  if ("serviceWorker" in navigator) {
    const controller = await getServiceWorker()!;

    if (controller !== undefined) {
      controller.postMessage(JSON.stringify({
        type: "deauth"
      }));
    }
  }
}