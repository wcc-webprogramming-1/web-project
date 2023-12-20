import { base } from "$app/paths";
import { ClientAsset, type ClientDeserializableAsset } from "./asset";
import { type ClientDeserializableUser, ClientUser } from "./user";

export type ClientDeserializableTweet = {
    id: number,
    content: string,
    likes: number,
    retweets: number,
    bookmarks: number,
    comments: ClientDeserializableTweetComments[],
    images: ClientDeserializableAsset[],
    creation_date: Date,
    user: ClientDeserializableUser,
    parentId: number,
    is_liked_by_user: boolean,
}

export type ClientDeserializableTweetComments = {
    id: number,
    content: string,
    likes: number,
    retweets: number,
    bookmarks: number,
    comments: number,
    creation_date: Date,
    user: ClientDeserializableUser,
    images: ClientDeserializableAsset[],
    parentId: number,
    is_liked_by_user: boolean,
}

export class ClientTweet{
    static deserialize(tweet: ClientDeserializableTweet): ClientTweet{
        return new ClientTweet(tweet);
    }

    static deserializeFromComment(tweet: ClientDeserializableTweetComments): ClientTweet{
        return new ClientTweet(tweet);
    }

    private constructor(private tweet: ClientDeserializableTweet | ClientDeserializableTweetComments) {
        this.images = this.tweet.images.map(i => ClientAsset.deserialize(i));
        this.author = ClientUser.deserialize(this.tweet.user);
    }

    public readonly images: ClientAsset[];
    public readonly author: ClientUser;

    get id(): number{
        return this.tweet.id;
    }

    get content(): string{
        return this.tweet.content;
    }

    get likes(): number{
        return this.tweet.likes;
    }

    get creation_date(): Date{
        return this.tweet.creation_date;
    }

    get retweets(): number{
        return this.tweet.retweets;
    }

    get bookmarks(): number{
        return this.tweet.bookmarks;
    }

    get is_liked_by_user(): boolean{
        return this.tweet.is_liked_by_user;
    }

    getCommentCount() {
        if (typeof this.tweet.comments == "number")
            return this.tweet.comments;

        return this.tweet.comments.length;
    }

    async getComments() {
        if (typeof this.tweet.comments != "number"){
            return this.tweet.comments;
        }
        const response = await fetch(`api/v1/tweets/${this.id}/comments`);
        const commentArray = await response.json();
        return commentArray.map(ClientTweet.deserialize);      
    }

    async toggleLike() {
        const response = await fetch(`/api/v1/tweet/${this.id}/like`, { method: "POST" });

        if (!response.ok)
            throw new Error("Failed to toggle like");

        const {likes, is_liked_by_user} = await response.json();

        this.tweet.is_liked_by_user = is_liked_by_user;
        this.tweet.likes = likes;
    }

    async loadParent() {
        if (this.tweet.parentId == null)
            return undefined;

        const response = await fetch(`${base}/api/v1/tweet/${this.tweet.parentId}`);
        const tweet = await response.json();

        console.log("PARENT:", tweet)

        return ClientTweet.deserialize(tweet);
    }
}
