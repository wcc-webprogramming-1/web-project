import type { ClientDeserializableAsset } from "$lib/client/objects/asset";
import type { ClientDeserializableTweet, ClientDeserializableTweetComments } from "$lib/client/objects/tweet";
import { Database } from "../database"
import { ServerAsset } from "./asset";
import { ServerUser } from "./user";

export type TweetRow = {
    id: number,
    content: string,
    likes: number,
    retweets: number,
    bookmarks: number,
    creation_date: Date,
    userId: number,
    parentId: number,
}

export type UserConstructionParameters = {
    id?: number,
    content: string,
    likes?: number,
    retweets?: number,
    bookmarks?: number,
    creation_date?: Date,
    userId: number,
    parentId?: number,
}

export class ServerTweet {
    static async load(using: Partial<TweetRow>): Promise<ServerTweet> {
        const query = `SELECT * from tweets WHERE ${Object.keys(using).map(keys => `${keys} = ?`).join(" AND ")}`;
        const params = Object.values(using);
        const tweetRow = await Database.query<TweetRow>(query,params);

        if (tweetRow.length == 0) {
            throw new Error("Tweet not found");
        }
        if (tweetRow.length > 1){
            throw new Error("Ambiguous Input: Multiple tweets found");
        }
        return new ServerTweet(tweetRow[0]);
    }

    static async loadForClient(using: Partial<TweetRow>): Promise<ClientDeserializableTweet>{
        const tweet = await ServerTweet.load(using);

        return tweet.serializeForFrontend();
    }

    static async loadSet(using: Partial<TweetRow>): Promise<ServerTweet[]> {
        const query = `SELECT * from tweets WHERE ${Object.keys(using).map(keys => `${keys} = ?`).join(" AND ")}`;
        const params = Object.values(using);
        const tweetRows = await Database.query<TweetRow>(query,params);

        return tweetRows.map(tweet => new ServerTweet(tweet));
    }

    get id(): number{return this.row.id;}
    get content(): string{return this.row.content;}
    get likes(): number{return this.row.likes;}
    get retweets(): number{return this.row.retweets;}
    get bookmarks(): number{return this.row.bookmarks;}
    get creation_date(): Date{return this.row.creation_date;}
    get userId(): number{return this.row.userId;}
    get parentId(): number{return this.row.parentId;}

    async serializeForFrontend(): Promise<ClientDeserializableTweet>{
        let user = await this.loadUser();
        let comments = await this.loadComments();
        let images = await this.loadImages()

        return{
            id: this.id,
            content: this.content,
            likes: this.likes,
            retweets: this.retweets,
            bookmarks: this.bookmarks,
            creation_date: this.creation_date,
            user: await user.serializeForFrontend(), 
            comments: await Promise.all(comments.map(comment => comment.serializeForFrontendComments())),
            images: images.map(image => image.serializeForFrontend()),
            parentId: this.parentId,
        }
    }

    async serializeForFrontendComments(): Promise<ClientDeserializableTweetComments> {
        let user = await this.loadUser();
        let comments = await this.loadComments()

        return{
            id: this.id,
            content: this.content,
            likes: this.likes,
            retweets: this.retweets,
            bookmarks: this.bookmarks,
            comments: comments.length,
            creation_date: this.creation_date,
            user: await user.serializeForFrontend(), 
        }
    }

    async loadComments(): Promise<ServerTweet[]> {
        return ServerTweet.loadSet({parentId: this.id});
    }

    async loadImages(): Promise<ServerAsset[]> {
        const query = `SELECT * from tweets_images WHERE id = ?`
        const result = await Database.query<{ id: number, image: Buffer }>(query, [this.id]);
        const image_array = Promise.all(result.map(row => ServerAsset.load(Array.from(row.image))));
        
        return image_array;
    }

    async loadUser(): Promise<ServerUser> {
        return ServerUser.load({ id: this.userId });
    }

    async setContent(newContent: string): Promise<void>{
        await Database.query("UPDATE tweets SET content = ? WHERE id = ?", [newContent, this.id]);
    }

    async setImage(newImageId: number): Promise<void>{
        await Database.query("UPDATE tweets_images SET id = ? WHERE image = ?", [this.id, newImageId]);
    }

    constructor(private row: TweetRow) {}
}