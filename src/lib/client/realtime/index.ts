import { readable, readonly, writable } from "svelte/store";
import { ClientEvent } from "../objects/event";
import { handleServerSentEvent, sendRealtimeRequest } from "./session";

export class Realtime {
  private static listeners: Set<(event: ClientEvent) => void> = new Set();

  public static addEventListener(listener: (event: ClientEvent) => void): void {
    Realtime.listeners.add(listener);
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
        case "read_events":
          Realtime.mutUnseenEventCount.set(0);
          break;
        default:
          console.error("Unknown event type:", event);
      }
    });
  }
}