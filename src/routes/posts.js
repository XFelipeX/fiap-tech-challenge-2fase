var express = require('express');
var router = express.Router();

import { PostsModel } from '../models/posts.model'

router.get('/', async function(req, res) {
  const postsModel = new PostsModel();
  const postsList = await postsModel.listPosts();
  console.log(postsList)
  res.send(postsList)
});

module.exports = router;
