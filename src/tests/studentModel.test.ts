import { StudentModel } from '../models/student.model';
const pool = require('../config/db.config');

jest.mock('../config/db.config');

describe('StudentModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('listStudents', async () => {
    const mockStudents = [
      { id: 1, name: 'Test Student 1' },
      { id: 2, name: 'Test Student 2' },
    ];

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: mockStudents }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const studentModel = new StudentModel();
    const students = await studentModel.listStudents();

    expect(students).toEqual(mockStudents);
    expect(mockClient.query).toHaveBeenCalledWith(`
        SELECT 
          Student.id,
          Student.name
        FROM 
          Student
        `);
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('getStudent', async () => {
    const mockStudent = { id: 1, name: 'Test Student' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockStudent] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const studentModel = new StudentModel();
    const student = await studentModel.getStudent(1);

    expect(student).toEqual(mockStudent);
    expect(mockClient.query).toHaveBeenCalledWith(`
        SELECT 
          Student.id,
          Student.name
        FROM 
            Student
        WHERE
          Student.id = $1;`,
        [1]
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('createStudent', async () => {
    const mockStudent = { id: 1, name: 'New Student' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockStudent] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const studentModel = new StudentModel();
    const student = await studentModel.createStudent('New Student');

    expect(student).toEqual(mockStudent);
    expect(mockClient.query).toHaveBeenCalledWith(`
        INSERT INTO Student (name) VALUES
        ($1)
        RETURNING *`,
        ['New Student']
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('editStudent', async () => {
    const mockStudent = { id: 1, name: 'Updated Student' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockStudent] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const studentModel = new StudentModel();
    const student = await studentModel.editStudent(1, 'Updated Student');

    expect(student).toEqual(mockStudent);
    expect(mockClient.query).toHaveBeenCalledWith(`
        UPDATE Student 
        SET name = $1
        WHERE
        Student.id = $2
        RETURNING *;`,
        ['Updated Student', 1]
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('deleteStudent', async () => {
    const mockStudent = { id: 1, name: 'Test Student' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockStudent] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const studentModel = new StudentModel();
    const student = await studentModel.deleteStudent(1);

    expect(student).toEqual(mockStudent);
    expect(mockClient.query).toHaveBeenCalledWith(`
        DELETE
        FROM Student
        WHERE
        Student.id = $1
        RETURNING *;`,
        [1]
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('searchStudents', async () => {
    const mockStudents = [
      { id: 1, name: 'Test Student' },
      { id: 2, name: 'Another Test Student' },
    ];

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: mockStudents }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const studentModel = new StudentModel();
    const students = await studentModel.searchStudents('Test');

    expect(students).toEqual(mockStudents);
    expect(mockClient.query).toHaveBeenCalledWith(`
        SELECT 
          Student.id,
          Student.name
        FROM 
          Student
        WHERE
          Student.name ILIKE $1
        `,[`%Test%`]);
    expect(mockClient.release).toHaveBeenCalled();
  });
});
