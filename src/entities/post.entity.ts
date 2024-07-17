import { IPost } from './interfaces/post.interface'

export class Post implements IPost {
  id?: number | undefined;
  title: string;
  content: string;
  professorId: number;

  constructor(title: string, content: string, professorId: number) {
    this.title = title
    this.content = content
    this.professorId = professorId
  }

}