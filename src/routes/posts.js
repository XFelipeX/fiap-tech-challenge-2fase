var express = require('express');
var router = express.Router();

import { PostsModel } from '../models/posts.model';

router.get('/', async function (req, res) {
  const postsModel = new PostsModel();
  const postsList = await postsModel.listPosts();

  res.render('postsList', { postsList: postsList });
});

router.get('/search', async function (req, res) {
  const search = req.query.keyword;
  if (!search) {
    return res
      .status(400)
      .json({ error: 'Query parameter "keyword" is required.' });
  }
  const postsModel = new PostsModel();
  const postsList = await postsModel.searchPosts(search);

  res.render('postsList', { postsList: postsList });
});

router.get('/:id', async function (req, res) {
  const id = req.params.id;

  const postsModel = new PostsModel();
  const post = await postsModel.getPost(id);

  res.render('readPost', { post: post });
});

router.post('/', async function (req, res) {
  const { title, content, teacherId } = req.body;

  const postsModel = new PostsModel();
  const post = await postsModel.createPost(title, content, teacherId);
  console.log(post);

  res.redirect('/posts');
});

module.exports = router;
