import { User } from "../../entities/user.entity";

export interface IUserModel {
  getUser(id: number): Promise<User>
  getUserByEmail(email:string, password:string): Promise<User>
  getUserByTeacher(teacherId: number): Promise<User>
  getUsers(): Promise<User[]>
  createUser(email: string, password:string, teacherId:number): Promise<User>
  editUser(id: number, email: string, password:string): Promise<User>
  deleteUser(id: number): Promise<User>
}