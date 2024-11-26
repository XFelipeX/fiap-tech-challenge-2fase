import { Student } from '../entities/student.entitiy';
import { IStudentModel } from './interfaces/student.model.interface'
import { QueryResult } from 'pg';
const pool = require('../config/db.config')

export class StudentModel implements IStudentModel {

  public async listStudents(): Promise<Student[]> {
    const client = await pool.connect();
    let result: QueryResult<Student>;

    try {
      result = await client.query(`
        SELECT 
          Student.id,
          Student.name
        FROM 
          Student
        `);

    } catch (error) {
      console.error('Erro ao selecionar alunos', error);
      return [];

    } finally {
      client.release();
    }
  
    return result.rows;
  }

  public async getStudent(id: number): Promise<Student> {
    const client = await pool.connect();
    let result: QueryResult<Student>;

    try {
      result = await client.query(`
        SELECT 
          Student.id,
          Student.name
        FROM 
            Student
        WHERE
          Student.id = $1;`,
        [id]
        );

    } catch (error) {
      console.error('Erro ao selecionar aluno', error);
      throw error;

    } finally {
      client.release();
    }
  
    return result.rows[0];
  }

  public async createStudent(name: string): Promise<Student> {
    const client = await pool.connect();
    let result: QueryResult<Student>;

    try {
      result = await client.query(`
        INSERT INTO Student (name) VALUES
        ($1)`,
        [name]
      );
    } catch (error) {
      console.error('Erro ao criar aluno', error);
      throw error;

    } finally {
      client.release();
    }

    return result.rows[0];
  }

  public async editStudent(id:number, name: string): Promise<Student> {
    const client = await pool.connect();
    let result: QueryResult<Student>;

    try {
      result = await client.query(`
        UPDATE Student 
        SET name = $1
        WHERE
        Student.id = $2
        RETURNING *;`,
        [name,id]
      );
    } catch (error) {
      console.error('Erro ao editar aluno', error);
      throw error;
    } finally {
      client.release();
    }

    return result.rows[0];
  }

  public async deleteStudent(id: number): Promise<Student> {
    const client = await pool.connect();
    let result: QueryResult<Student>;

    try {
      result = await client.query(`
        DELETE
        FROM Student
        WHERE
        Student.id = $1
        RETURNING *;`,
        [id]
      );
    } catch (error) {
      console.error('Erro ao deletar aluno', error);
      throw error;
    } finally {
      client.release();
    }

    return result.rows[0];
  }

  public async searchStudents(search: string): Promise<Student[]> {
    const client = await pool.connect();
    let result: QueryResult<Student>;
    try {
      result = await client.query(`
        SELECT 
          Student.id,
          Student.name
        FROM 
          Student
        WHERE
          Student.name ILIKE $1
        `,[`%${search}%`]);
    } catch (error) {
      console.error('Erro ao procurar alunos utilizando palavra-chave', error);
      return []
    } finally {
      client.release();
    }
    return result.rows;
  }
  
}