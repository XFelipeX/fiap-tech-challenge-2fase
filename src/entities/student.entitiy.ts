import { IStudent } from "./interfaces/student.interface"


export class Student implements  IStudent{
  id?: number
  name: string

  constructor(name: string) {
    this.name = name
  }
}