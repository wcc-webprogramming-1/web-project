export type FrontendDeserializableUser = {
  handle: string,
  username: string,
  creation_date: Date,
  id: number,
  bio: string,
}

export class ClientUser {
  static deserialize(user: FrontendDeserializableUser): ClientUser {
    return new ClientUser(user);
  }

  private constructor(private user: FrontendDeserializableUser) {}

  get handle(): string {
    return this.user.handle;
  }

  get username(): string {
    return this.user.username;
  }

  get creationDate(): Date {
    return this.user.creation_date;
  }

  get id(): number {
    return this.user.id;
  }

  get bio(): string {
    return this.user.bio;
  }
}