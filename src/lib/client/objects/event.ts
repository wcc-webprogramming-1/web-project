import { ClientTweet, type ClientDeserializableTweet } from "./tweet"
import { ClientUser, type ClientDeserializableUser } from "./user"

export enum EventType {
  Demo = 0,
  Like = 1,
  Retweet = 2,
  Bookmark = 3,
  Follow = 4,
  Unfollow = 5,
  Mention = 6,
  Reply = 7,
}

export type ClientDeserializableEvent = {
  id: number,
  actor: ClientDeserializableUser,
  type: EventType,
  subject: ClientDeserializableUser,
  time: number,
  post: ClientDeserializableTweet | undefined,
}

export class ClientEvent {
  static deserialize(event: ClientDeserializableEvent): ClientEvent {
    console.log(event);

    return new ClientEvent(event);
  }

  constructor(
    private event: ClientDeserializableEvent,
  ) {
    this.actor = ClientUser.deserialize(event.actor);
    this.subject = ClientUser.deserialize(event.subject);
    this.post = event.post ? ClientTweet.deserialize(event.post) : undefined;
  }

  public readonly actor: ClientUser;
  public readonly subject: ClientUser;
  public readonly post: ClientTweet | undefined;

  get id() { return this.event.id; }
  get type() { return this.event.type; }
  get time() { return new Date(this.event.time); }
}