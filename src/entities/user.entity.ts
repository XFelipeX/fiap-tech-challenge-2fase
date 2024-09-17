import { IUser } from "./interfaces/user.interface"

export class User implements IUser {
  id?: number
  email: string
  password: string
  teacherId: number

  constructor(email: string, password: string, teacherId: number) {
    this.email = email
    this.password = password
    this.teacherId = teacherId
  }
}