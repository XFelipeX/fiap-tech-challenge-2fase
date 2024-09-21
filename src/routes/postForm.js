const express = require('express');
const router = express.Router();

const { PostsModel } = require('../models/posts.model');
const postsModel = new PostsModel();
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, function (req, res) {
  res.render('postForm', {
    title: 'Criar Post',
    isEdit: false,
    post: null,
    formAction: '/posts',
  });
});

router.get('/:id', verifyToken, async function (req, res) {
  const id = req.params.id;

  const post = await postsModel.getPost(id);
  const formAction = `/posts/${id}?_method=PUT`;
  res.render('postForm', {
    title: 'Editar Post',
    isEdit: true,
    post: post,
    formAction: formAction,
  });
});

module.exports = router;
