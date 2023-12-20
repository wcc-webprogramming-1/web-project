import { ClientAsset, type ClientDeserializableAsset } from "./asset";

export type ClientDeserializableUser = {
  handle: string,
  username: string,
  creation_date: Date,
  id: number,
  bio: string,
  profile_asset: ClientDeserializableAsset | undefined,
  banner_asset: ClientDeserializableAsset | undefined,
  following_count: number;
  follower_count:number;
}

export class ClientUser {
  static Dummy = new ClientUser({
    handle: "dummy",
    username: "Dummy",
    creation_date: new Date(),
    id: -1,
    bio: "Dummy",
    profile_asset: undefined,
    banner_asset: undefined,
    following_count: 0,
    follower_count: 0
  });

  static deserialize(user: ClientDeserializableUser): ClientUser {
    return new ClientUser(user);
  }

  static async loadFromHandleLossy(handle: string): Promise<ClientUser | undefined> {
    const response = await fetch(`api/v1/user/by_handle/${handle}`);
    const data = await response.json();

    if (data === undefined)
      return undefined;

    return ClientUser.deserialize(data);
  }

  static async loadFromHandle(handle: string): Promise<ClientUser> {
    const user = await ClientUser.loadFromHandleLossy(handle);

    if (user === undefined)
      throw new Error("User not found");

    return user;
  }

  static async loadFromIdLossy(id: number): Promise<ClientUser | undefined> {
    const response = await fetch(`api/v1/user/${id}`);
    const data = await response.json();

    if (data === undefined)
      return undefined;

    return ClientUser.deserialize(data);
  }

  static async loadFromId(id: number): Promise<ClientUser> {
    const user = await ClientUser.loadFromIdLossy(id);

    if (user === undefined)
      throw new Error("User not found");

    return user;
  }

  private constructor(private user: ClientDeserializableUser) {
    if (user.profile_asset)
      this.profilePicture = ClientAsset.deserialize(user.profile_asset);

    if (user.banner_asset)
      this.bannerPicture = ClientAsset.deserialize(user.banner_asset);
  }

  public profilePicture: ClientAsset | undefined;
  public bannerPicture: ClientAsset | undefined;

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

  get followingCount(): number {
    return this.user.following_count;
  }

  get followerCount(): number {
    return this.user.follower_count;
  }

  async loadFollowing(){
    let response = await fetch(`api/v1/user/${this.id}/following`);
    const data = await response.json();
    return <ClientUser[]> data.map((serialized: any) => ClientUser.deserialize(serialized));
  }

  async loadFollowers(){
    let response = await fetch(`api/v1/user/${this.id}/followers`);
    const data = await response.json();
    return <ClientUser[]> data.map((serialized: any) => ClientUser.deserialize(serialized));
  }

  async validatePassword(password: string): Promise<boolean> {
    const response = await fetch(`api/v1/user/${this.id}/validate_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    return await response.json();
  }
}