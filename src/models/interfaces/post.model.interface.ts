import { Post } from "../../entities/post.entity";

export interface IPostModel {
  listPosts(): Promise<Post[]>
  getPost(id: number): Promise<Post>
  createPost(): Promise<Post>
  editPost(id: number): Promise<Post>
  listPostsAdmin(): Promise<Post[]>
  deletePost(id: number): Promise<Post>
  searchPosts(search: string): Promise<Post[]>
}