import { Post } from "../entities/post.entity";
import { IPostModel } from "./interfaces/post.model.interface";

export class PostModel implements IPostModel {
  listPosts(): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  getPost(id: number): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  createPost(): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  editPost(id: number): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  listPostsAdmin(): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  deletePost(id: number): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  searchPosts(search: string): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
  
}