import { TeacherModel } from '../models/teacher.model';
const pool = require('../config/db.config');

jest.mock('../config/db.config');

describe('TeacherModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('listTeachers', async () => {
    const mockTeachers = [
      { id: 1, name: 'Test Teacher 1' },
      { id: 2, name: 'Test Teacher 2' },
    ];

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: mockTeachers }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const teacherModel = new TeacherModel();
    const teachers = await teacherModel.listTeachers();

    expect(teachers).toEqual(mockTeachers);
    expect(mockClient.query).toHaveBeenCalledWith(`
        SELECT 
          teacher.id,
          teacher.name
        FROM 
          teacher
        `);
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('getTeacher', async () => {
    const mockTeacher = { id: 1, name: 'Test Teacher' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockTeacher] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const teacherModel = new TeacherModel();
    const teacher = await teacherModel.getTeacher(1);

    expect(teacher).toEqual(mockTeacher);
    expect(mockClient.query).toHaveBeenCalledWith(`
        SELECT 
          teacher.id,
          teacher.name
        FROM 
            teacher
        WHERE
          teacher.id = $1;`,
        [1]
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('createTeacher', async () => {
    const mockTeacher = { id: 1, name: 'New Teacher' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockTeacher] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const teacherModel = new TeacherModel();
    const teacher = await teacherModel.createTeacher('New Teacher');

    expect(teacher).toEqual(mockTeacher);
    expect(mockClient.query).toHaveBeenCalledWith(`
        INSERT INTO teacher (name) VALUES
        ($1)
        RETURNING *`,
        ['New Teacher']
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('editTeacher', async () => {
    const mockTeacher = { id: 1, name: 'Updated Teacher' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockTeacher] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const teacherModel = new TeacherModel();
    const teacher = await teacherModel.editTeacher(1, 'Updated Teacher');

    expect(teacher).toEqual(mockTeacher);
    expect(mockClient.query).toHaveBeenCalledWith(`
        UPDATE teacher 
        SET name = $1
        WHERE
        teacher.id = $2
        RETURNING *;`,
        ['Updated Teacher', 1]
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('deleteTeacher', async () => {
    const mockTeacher = { id: 1, name: 'Test Teacher' };

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [mockTeacher] }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const teacherModel = new TeacherModel();
    const teacher = await teacherModel.deleteTeacher(1);

    expect(teacher).toEqual(mockTeacher);
    expect(mockClient.query).toHaveBeenCalledWith(`
        DELETE
        FROM teacher
        WHERE
        teacher.id = $1
        RETURNING *;`,
        [1]
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  test('searchTeachers', async () => {
    const mockTeachers = [
      { id: 1, name: 'Test Teacher' },
      { id: 2, name: 'Another Test Teacher' },
    ];

    const mockClient = {
      query: jest.fn().mockResolvedValue({ rows: mockTeachers }),
      release: jest.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    const teacherModel = new TeacherModel();
    const teachers = await teacherModel.searchTeachers('Test');

    expect(teachers).toEqual(mockTeachers);
    expect(mockClient.query).toHaveBeenCalledWith(`
        SELECT 
          teacher.id,
          teacher.name
        FROM 
          teacher
        WHERE
          teacher.name ILIKE $1
        `,[`%Test%`]);
    expect(mockClient.release).toHaveBeenCalled();
  });
});
