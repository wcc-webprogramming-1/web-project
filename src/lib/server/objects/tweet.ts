import type { ClientDeserializableAsset } from "$lib/client/objects/asset";
import type { ClientDeserializableTweet, ClientDeserializableTweetComments } from "$lib/client/objects/tweet";
import { Database } from "../database"
import { ServerAsset, type AssetId } from "./asset";
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

export type TweetConstructionParameters = {
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

    static async loadSet(using: Partial<TweetRow> , limit?: number): Promise<ServerTweet[]> {
        let query = `SELECT * from tweets WHERE ${Object.keys(using).map(keys => `${keys} = ?`).join(" AND ")}`;
        
        if (limit !== undefined){
            query += " LIMIT " + limit;
        }

        const params = Object.values(using);
        const tweetRows = await Database.query<TweetRow>(query,params);

        return tweetRows.map(tweet => new ServerTweet(tweet));
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
        let comments = await this.loadComments();
        const images = await this.loadImages();

        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            retweets: this.retweets,
            bookmarks: this.bookmarks,
            comments: comments.length,
            creation_date: this.creation_date,
            user: await user.serializeForFrontend(), 
            parentId: this.parentId,
            images: images.map(i => i.serializeForFrontend()),
        }
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