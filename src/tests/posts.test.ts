import request from 'supertest';
import app from '../app';
import { PostsModel } from '../models/posts.model';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcrypt';

jest.mock('../models/posts.model');
jest.mock('../models/user.model');
jest.mock('../config/db.config');

describe('Posts API', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  let token: string;

  beforeAll(async () => {
    try{
      const createMockUser = async () => {
        const hashedPassword = await bcrypt.hash('1234', 10);
      
        return {
          id: 1,
          email: 'bob@fiap.com.br',
          password: hashedPassword,
        };
      };
  
      const mockUser = await createMockUser();
  
      (UserModel.prototype.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'bob@fiap.com.br',
        password: '1234'
      });
    
      token = response.body.token; 
    }catch(error){
      console.error(error);
    }
  });

    it('Retorna um token JWT', () => {
    expect(token).toBeDefined();
  });

  test('Get /posts', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Test Title 1',
        content: 'Test Content 1',
        createdDate: '01/01/2024 12:00',
        teacherName: 'Test Teacher',
      },
      {
        id: 2,
        title: 'Test Title 2',
        content: 'Test Content 2',
        createdDate: '02/01/2024 13:00',
        teacherName: 'Test Teacher',
      },
    ];

    (PostsModel.prototype.listPosts as jest.Mock).mockResolvedValue(mockPosts);

    const response = await request(app).get('/posts').set('Authorization', `${token}`);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Test Title 1');
    expect(response.text).toContain('Test Title 2');
  });

  test('Get /posts/admin', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Test Title 1',
        content: 'Test Content 1',
        createdDate: '01/01/2024 12:00',
        teacherName: 'Test Teacher',
      },
      {
        id: 2,
        title: 'Test Title 2',
        content: 'Test Content 2',
        createdDate: '02/01/2024 13:00',
        teacherName: 'Test Teacher',
      },
    ];

    (PostsModel.prototype.listPosts as jest.Mock).mockResolvedValue(mockPosts);

    const response = await request(app).get('/posts/admin').set('Authorization',`${token}`);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Administrar Posts');
    expect(response.text).toContain('Test Title 1');
    expect(response.text).toContain('Test Title 2');
  });

  test('Get /posts/search', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Test Title 1',
        content: 'Test Content 1',
        createdDate: '01/01/2024 12:00',
        teacherName: 'Test Teacher',
      },
      {
        id: 2,
        title: 'Test Title 2',
        content: 'Test Content 2',
        createdDate: '02/01/2024 13:00',
        teacherName: 'Test Teacher',
      },
    ];

    (PostsModel.prototype.searchPosts as jest.Mock).mockResolvedValue(mockPosts);

    const response = await request(app).get('/posts/search').query({ keyword: 'Test' });
    expect(response.status).toBe(200);
    // expect(response.text).toContain('Procurar Posts');
    expect(response.text).toContain('Test Title 1');
    expect(response.text).toContain('Test Title 2');
  });

  test('Get /posts/search without keyword', async () => {
    const response = await request(app).get('/posts/search');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Query parameter "keyword" is required.' });
  });

  test('Get /posts/:id', async () => {
    const mockPost = {
      id: 1,
      title: 'Test Title',
      content: 'Test Content',
      createdDate: '01/01/2024 12:00',
      teacherName: 'Test Teacher',
    };

    (PostsModel.prototype.getPost as jest.Mock).mockResolvedValue(mockPost);

    const response = await request(app).get('/posts/1');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Detalhes do Post');
    expect(response.text).toContain('Test Title');
  });

  test('Post /posts', async () => {
    const newPost = {
      id: 1,
      title: 'New post title',
      content: 'New post content',
      teacherId: 1,
    };

    (PostsModel.prototype.createPost as jest.Mock).mockResolvedValue(newPost);

    const response = await request(app).post('/posts').set('Authorization',`${token}`).send(newPost).set('Accept', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(newPost)
    // expect(response.headers.location).toBe('/posts');  // Redirecionando para /posts
    
    expect(PostsModel.prototype.createPost).toHaveBeenCalledWith(
      newPost.title,
      newPost.content,
      newPost.teacherId
    );
  });

  test('Put /posts/:id', async () => {
    const post = {
      id: 1,
      title: 'Post Title',
      content: 'Post Content',
      teacherId: 1,
    };

    const updatedPost = {
      id: 1,
      title: 'Updated post title',
      content: 'Updated post content',
      teacherId: 2,
    };

    (PostsModel.prototype.getPost as jest.Mock).mockResolvedValue(post);
    (PostsModel.prototype.editPost as jest.Mock).mockResolvedValue(updatedPost);

    const response = await request(app).put('/posts/1').send(updatedPost).set('Authorization',`${token}`).set('Accept', 'application/json');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/posts');  // Redirecionando para /posts

    expect(PostsModel.prototype.getPost).toHaveBeenCalledWith(1);
    expect(PostsModel.prototype.editPost).toHaveBeenCalledWith(
      updatedPost.id,
      updatedPost.title,
      updatedPost.content,
      updatedPost.teacherId
    );
  });

  test('Put /posts/:id Post not found', async () => {
    (PostsModel.prototype.getPost as jest.Mock).mockResolvedValue(null);

    const response = await request(app).put('/posts/1').set('Authorization',`${token}`).send({
      title: 'Updated post title',
      content: 'Updated post content',
      teacherId: 1,
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Post not found.' });
  });

  test('Delete /posts/:id', async () => {
    const post = {
      id: 1,
      title: 'Post title',
      content: 'Post content',
      teacherId: 1,
    };

    (PostsModel.prototype.getPost as jest.Mock).mockResolvedValue(post);

    const response = await request(app).delete('/posts/1').set('Authorization', `${token}`);
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/posts');
    
    expect(PostsModel.prototype.getPost).toHaveBeenCalledWith(1);
    expect(PostsModel.prototype.deletePost).toHaveBeenCalledWith(1);
  });

  test('Delete /posts/:id Post not found', async () => {
    (PostsModel.prototype.getPost as jest.Mock).mockResolvedValue(null);

    const response = await request(app).delete('/posts/1').set('Authorization', `${token}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Post not found.' });
  });
});