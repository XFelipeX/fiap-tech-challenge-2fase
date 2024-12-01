var express = require('express');
var router = express.Router();

const { PostsModel } = require('../models/posts.model');
const { responseMiddleware } = require('../middlewares/responseMiddleware');
const postsModel = new PostsModel();
const verifyToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - teacherId
 *       properties:
 *         id:
 *           type: number
 *           description: ID do posts
 *         title:
 *           type: string
 *           description: Título do post
 *         content:
 *           type: string
 *           description: Conteúdo do post
 *         techerId:
 *           type: string
 *           description: ID do professor
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retorna a lista de todos os posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 */

router.get(
  '/',
  async function (req, res, next) {
    const postsList = await postsModel.listPosts();
    req.customData = { title: 'Administrar Posts', posts: postsList };
    req.viewName = 'posts';
    next();
  },
  responseMiddleware,
);

/**
 * @swagger
 * /posts/admin:
 *   get:
 *     summary: Retorna a lista de todos os posts com a visão administrativa
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 */

router.get(
  '/admin',
  verifyToken,
  async function (req, res, next) {
    const postsList = await postsModel.listPosts();
    req.customData = { title: 'Administrar Posts', posts: postsList };
    req.viewName = 'posts';
    next();
  },
  responseMiddleware,
);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Busca posts por palavra-chave
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Palavra-chave para buscar posts
 *     responses:
 *       200:
 *         description: Lista de posts correspondentes à palavra-chave
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Parâmetro de consulta "keyword" é obrigatório
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Post não encontrado
 */

router.get(
  '/search',
  async function (req, res, next) {
    const search = req.query.keyword;
    if (!search) {
      return res
        .status(400)
        .json({ error: 'Query parameter "keyword" is required.' });
    }
    const postsList = await postsModel.searchPosts(search);

    req.customData = { title: 'Administrar Posts', posts: postsList };
    next();
  },
  responseMiddleware,
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retorna o post pelo ID especificado
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post especificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       400:
 *          description: Post não encontrado
 */

router.get(
  '/:id',
  async function (req, res, next) {
    const id = req.params.id;

    const post = await postsModel.getPost(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    req.customData = { title: 'Detalhes do Post', currentPost: post };
    req.viewName = 'postDetail';
    next();
  },
  responseMiddleware,
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *       400:
 *         description: Requisição inválida
 */

router.post(
  '/',
  verifyToken,
  async function (req, res, next) {
    const { title, content, teacherId } = req.body;
    if (!title || !content || !teacherId) {
      return res.status(400).json({
        error: 'Missing required fields (title || content || teacherId)',
      });
    }
    const post = await postsModel.createPost(title, content, teacherId);
    if (post) {
      req.customData = post;
      req.status = 201;
    } else {
      return res.status(500).json({
        error: 'Failed to create post',
      });
    }
    next();
  },
  responseMiddleware,
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Atualiza um post existente
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *       404:
 *         description: Post não encontrado
 *       400:
 *         description: Requisição inválida
 */

router.put(
  '/:id',
  verifyToken,
  async function (req, res, next) {
    const id = parseInt(req.params.id);
    const { title, content, teacherId } = req.body;

    const post = await postsModel.getPost(id);

    if (!post) return res.status(404).send({ error: 'Post not found.' });

    if (title) post.title = title;
    if (content) post.content = content;
    if (teacherId) post.teacherid = teacherId;

    const result = await postsModel.editPost(
      post.id,
      post.title,
      post.content,
      post.teacherid,
    );

    if (result) {
      req.customData = result;
      req.status = 302;
    }

    next();
  },
  responseMiddleware,
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deleta o post pelo ID especificado
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       204:
 *         description: Post deletado com sucesso
 *       404:
 *         description: Post não encontrado
 */

router.delete(
  '/:id',
  verifyToken,
  async function (req, res, next) {
    const id = parseInt(req.params.id);

    const post = await postsModel.getPost(id);

    if (!post) return res.status(404).send({ error: 'Post not found.' });

    const result = await postsModel.deletePost(post.id);

    req.customData = result;
    req.status = 204;

    next();
  },
  responseMiddleware,
);

module.exports = router;
