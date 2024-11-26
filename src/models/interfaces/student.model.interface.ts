import { Student } from '../../entities/student.entitiy'

export interface IStudentModel {
  listStudents(): Promise<Student[]>
  getStudent(id: number): Promise<Student>
  createStudent(name: string): Promise<Student>
  editStudent(id: number, name: string): Promise<Student>
  deleteStudent(id: number): Promise<Student>
}