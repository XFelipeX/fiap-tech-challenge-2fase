import { IProfessor } from "./interfaces/professor.interface";

export class Professor implements IProfessor {
  id?: number
  name: string

  constructor(name: string) {
    this.name = name
  }
}