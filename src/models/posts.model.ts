import { Posts } from "../entities/posts.entity";
import { IPostsModel } from "./interfaces/posts.model.interface";
import { QueryResult } from 'pg';
const pool = require('../config/db.config')

export class PostsModel implements IPostsModel {

  public async listPosts(): Promise<Posts[]> {
    const client = await pool.connect();
    let result: QueryResult<Posts>;

    try {
      result = await client.query('SELECT * FROM posts');

    } catch (error) {
      console.error('Erro ao selecionar posts', error);
      return [];
    }
  
    return result.rows;
  }
  getPost(id: number): Promise<Posts> {
    throw new Error("Method not implemented.");
  }
  createPost(): Promise<Posts> {
    throw new Error("Method not implemented.");
  }
  editPost(id: number): Promise<Posts> {
    throw new Error("Method not implemented.");
  }
  listPostsAdmin(): Promise<Posts[]> {
    throw new Error("Method not implemented.");
  }
  deletePost(id: number): Promise<Posts> {
    throw new Error("Method not implemented.");
  }
  searchPosts(search: string): Promise<Posts[]> {
    throw new Error("Method not implemented.");
  }
  
}