import { readable, readonly, writable } from "svelte/store";
import { ClientEvent } from "../objects/event";
import { handleServerSentEvent, sendRealtimeRequest } from "./session";

export class Realtime {
  private static listeners: Set<(event: ClientEvent) => void> = new Set();
  private static eventRemovedListeners: Map<number, () => void> = new Map();

  public static addEventListener(listener: (event: ClientEvent) => void): void {
    Realtime.listeners.add(listener);
  }

  public static addEventRemovedListener(id: number, callback: () => void): void {
    Realtime.eventRemovedListeners.set(id, callback);
  }

  public static removeEventListener(listener: (event: ClientEvent) => void): void {
    Realtime.listeners.delete(listener);
  }

  public static readEvents(): void {
    Realtime.mutUnseenEventCount.set(0);

    sendRealtimeRequest({
      kind: "read_events",
    })
  }

  public static subscribe(subscription: (value: { UnseenEventCount: number }) => void): () => void {
    return Realtime.mutUnseenEventCount.subscribe(v => {
      subscription({
        UnseenEventCount: v
      });
    });
  }

  private static mutUnseenEventCount = writable(0);

  static {
    console.log("Realtime initialized");

    handleServerSentEvent((event) => {
      console.log("Received event:", event);

      switch (event.type) {
        case "event":
          const clientEvent = ClientEvent.deserialize(event.content);

          for (const listener of Realtime.listeners) {
            listener(clientEvent);
          }

          Realtime.mutUnseenEventCount.update((count) => count + 1);
          break;
        case "event-removed":
          const callback = Realtime.eventRemovedListeners.get(event.id);

          if (callback !== undefined) {
            callback();
            Realtime.eventRemovedListeners.delete(event.id);
          }
          break;
        case "read_events":
          Realtime.mutUnseenEventCount.set(0);
          break;
        default:
          console.error("Unknown event type:", event);
      }
    });
  }
}