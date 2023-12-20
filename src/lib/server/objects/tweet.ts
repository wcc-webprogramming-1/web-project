import type { ClientDeserializableAsset } from "$lib/client/objects/asset";
import { EventType } from "$lib/client/objects/event";
import type { ClientDeserializableTweet, ClientDeserializableTweetComments } from "$lib/client/objects/tweet";
import { error } from "@sveltejs/kit";
import { Database } from "../database"
import { ServerAsset, type AssetId } from "./asset";
import { ServerEvent } from "./event";
import { ServerUser } from "./user";

export type TweetRow = {
    id: number,
    content: string,
    likes: number,
    retweets: number,
    creation_date: Date,
    userId: number,
    parentId: number | null,
    is_bookmarked_by_user: boolean,
}

export type TweetConstructionParameters = {
    id?: number,
    content: string,
    likes?: number,
    retweets?: number,
    creation_date?: Date,
    userId: number,
    parentId?: number | null,
    is_bookmarked_by_user?: boolean,
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

    static async loadForClient(using: Partial<TweetRow>, client: ServerUser): Promise<ClientDeserializableTweet>{
        const tweet = await ServerTweet.load(using);

        return tweet.serializeForFrontend(client);
    }

    static async loadSet(using: Partial<TweetRow>, limit?: number): Promise<ServerTweet[]> {
        let query = "";

        if (Object.keys(using).length === 0){
            query = `SELECT * from tweets`;
        } else {
            query = `SELECT * from tweets WHERE ${Object.keys(using).map(keys => (using as any)[keys] == null ? `${keys} is ? ` : `${keys} = ?`).join(" AND ")}`;
        }

        if (limit !== undefined){
            query += " LIMIT " + limit;
        }

        const params = Object.values(using);
        const tweetRows = await Database.query<TweetRow>(query,params);

        return tweetRows.map(tweet => new ServerTweet(tweet));
    }

    static async loadLossy(using: Partial<TweetRow>): Promise<ServerTweet | undefined> {
        const query = `SELECT * from tweets WHERE ${Object.keys(using).map(keys => `${keys} = ?`).join(" AND ")}`;
        const params = Object.values(using);
        const tweetRows = await Database.query<TweetRow>(query,params);

        if (tweetRows.length == 0) {
            return undefined;
        }
        if (tweetRows.length > 1){
            throw new Error("Ambiguous Input: Multiple tweets found");
        }
        return new ServerTweet(tweetRows[0]);
    }

    static async loadBookmarks(userId: number): Promise<ServerTweet[]> {
        const query = `SELECT * from bookmarks WHERE userId = ?`;
        const tweet_id_array = await Database.query<{ tweetId: number }>(query, [userId]);
        const promise_array_tweet= tweet_id_array.map(tweet_id => ServerTweet.load({id: tweet_id.tweetId}));
        const tweet_array = await Promise.all(promise_array_tweet);

        return tweet_array;
    }

    static async create(constructionParameters: TweetConstructionParameters): Promise<ServerTweet> {
        let query = "INSERT INTO tweets (";
        const params: any[] = [];
    
        for (const [key, value] of Object.entries(constructionParameters)) {
          query += `${key}, `;

          params.push(value);
        }
    
        query = query.slice(0, -2);
    
        query += ") VALUES (";
    
        for (const _ of params) {
          query += "?, ";
        }
    
        query = query.slice(0, -2);
    
        query += ")";
    
        const id = await Database.withConnection(async c => {
            await c.beginTransaction();
            await c.query(query, params);
            const r = await c.query("SELECT @@IDENTITY as TweetId");
            await c.commit();

            return r[0].TweetId;
        });

        return new ServerTweet(await ServerTweet.load({ id }));
    }
    
    constructor(private row: TweetRow) {}

    get id(): number{return this.row.id;}
    get content(): string{return this.row.content;}
    get likes(): number{return this.row.likes;}
    get retweets(): number{return this.row.retweets;}
    get creation_date(): Date{return this.row.creation_date;}
    get userId(): number{return this.row.userId;}
    get parentId(): number | null {return this.row.parentId;}
    get is_bookmarked_by_user(): boolean {return this.row.is_bookmarked_by_user}

    private async like(user: ServerUser) {
        // modify the tweet
        await Database.query("UPDATE tweets SET likes = likes + 1 WHERE id = ?", [this.id]);
        this.row.likes += 1;

        // add the event if it doesn't already exist
        return await ServerEvent.getOrCreate({
            type: EventType.Like,
            actor: user.id,
            subject: this.userId,
            post: this.id,
        });
    }

    private async bookmark(user: ServerUser) {
        // modify the tweet
        await Database.query("INSERT INTO `bookmarks`(`userId`, `tweetId`) VALUES (?, ?)", [user.id, this.id]);
        this.row.is_bookmarked_by_user = true;
    }

    private async unlike(user: ServerUser) {
        const evt = await this.getLikedBy(user);

        if (evt === undefined)
            throw new Error("Cannot unlike a tweet that you haven't liked");

        await Database.query("UPDATE tweets SET likes = likes - 1 WHERE id = ?", [this.id]);
        this.row.likes -= 1;

        return await evt.delete();
    }

    private async unBookmark(user: ServerUser) {
        let query = await Database.query("SELECT * FROM `bookmarks` WHERE userId = ? and tweetId = ?", [user.id,this.id]);
        if (query.length === 0)
            throw new Error("Cannot unBookmark a tweet that you haven't booked");

        await Database.query("DELETE FROM `bookmarks` WHERE userId = ? and tweetId = ?", [user.id,this.id]);
        this.row.is_bookmarked_by_user = false;

    }

    getBookmarkState(user: ServerTweet): boolean {
        return this.row.is_bookmarked_by_user
    }

    async getLikedBy(user: ServerUser): Promise<ServerEvent | undefined> {
        return ServerEvent.loadLossy({
            actor: user.id,
            type: EventType.Like,
            post: this.id,
        })
    }


    async toggleBookmark(user: ServerUser) {
        let query = await Database.query("SELECT * FROM `bookmarks` WHERE userId = ? and tweetId = ?", [user.id,this.id]);

        if (query.length !== 0){
            await this.unBookmark(user);
        } else {
            await this.bookmark(user);
        }
    }

    async toggleLike(user: ServerUser) {
        const evt = await this.getLikedBy(user);

        if (evt !== undefined) {
            await this.unlike(user);
        } else {
            await this.like(user);
        }
    }

    async serializeForFrontend(consumer?: ServerUser): Promise<ClientDeserializableTweet>{
        let user = await this.loadUser();
        let comments = await this.loadComments();
        let images = await this.loadImages()

        return{
            id: this.id,
            content: this.content,
            likes: this.likes,
            retweets: this.retweets,
            creation_date: this.creation_date,
            user: await user.serializeForFrontend(consumer), 
            comments: await Promise.all(comments.map(comment => comment.serializeForFrontendComments(consumer))),
            images: images.map(image => image.serializeForFrontend()),
            parentId: this.parentId,
            is_liked_by_user: await this.getLikedBy(user) !== undefined,
            is_bookmarked_by_user: false,
            bookmarks: await this.getBookmarkCount(),
        }
    }

    async serializeForFrontendComments(consumer?: ServerUser): Promise<ClientDeserializableTweetComments> {
        let user = await this.loadUser();
        let comments = await this.loadComments();
        const images = await this.loadImages();

        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            retweets: this.retweets,
            comments: comments.length,
            creation_date: this.creation_date,
            user: await user.serializeForFrontend(consumer), 
            parentId: this.parentId,
            images: images.map(i => i.serializeForFrontend()),
            is_liked_by_user: await this.getLikedBy(user) !== undefined,
            is_bookmarked_by_user: false,
            bookmarks: await this.getBookmarkCount(),
        }
    }

    async getBookmarkCount(): Promise<number> {
        let query = await Database.query("SELECT * FROM `bookmarks` WHERE tweetId = ?", [this.id]);

        return query.length;
    }

    async loadComments(): Promise<ServerTweet[]> {
        return ServerTweet.loadSet({parentId: this.id});
    }

    async loadImages(): Promise<ServerAsset[]> {
        const query = `SELECT * from tweets_images WHERE tweetId = ?`
        const result = await Database.query<{ tweetId: number, imageId: Buffer }>(query, [this.id]);
        
        const image_array = Promise.all(result.map(row => ServerAsset.load([... row.imageId])));
        
        return image_array;
    }

    async loadUser(): Promise<ServerUser> {
        return ServerUser.load({ id: this.userId });
    }

    async setContent(newContent: string): Promise<void>{
        await Database.query("UPDATE tweets SET content = ? WHERE id = ?", [newContent, this.id]);
    }

    async addImage(asset: AssetId): Promise<void> {
        await Database.query("INSERT INTO tweets_images (tweetId, imageId) VALUES (?, ?)", [
          this.id,
          asset
        ]);
    }

    async removeImage(asset: AssetId): Promise<void>{
        await Database.query("DELETE FROM tweets_images WHERE tweetId = ? and imageId = ? ",[this.id, asset]);
    }
}