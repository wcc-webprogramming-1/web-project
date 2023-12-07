import type { ClientDeserializableAsset } from "./asset";
import type { ClientDeserializableUser } from "./user";

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
}

export class ClientTweet{
    private constructor(private tweet: ClientDeserializableTweet) {}

    static deserialize(tweet: ClientDeserializableTweet): ClientTweet{
        return new ClientTweet(tweet);
    }

    get id(): number{
        return this.tweet.id;
    }

    get content(): string{
        return this.tweet.content;
    }

    get likes(): number{
        return this.tweet.likes;
    }

    get images(): ClientDeserializableAsset[]{
        return this.tweet.images;
    }

    get creation_date(): Date{
        return this.tweet.creation_date;
    }

    get user(): ClientDeserializableUser{
        return this.tweet.user;
    }

    get retweets(): number{
        return this.tweet.retweets;
    }

    get bookmarks(): number{
        return this.tweet.bookmarks;
    }

    get comments(): ClientDeserializableTweetComments[]{
        return this.tweet.comments;
    }
}