const express = require('express');

const { createPost, updatePost, deletePost } = require('../controllers/post');
const checkAuth = require('../middleware/check-auth')
const multer = require('../middleware/multer');
const getController = require('../controllers/get')

const router = express.Router();



router.post('',checkAuth, multer , createPost);

router.put('/:id',checkAuth, multer, updatePost);

router.get('', getController.getPosts);

router.get('/:id', getController.getPostById);

router.delete('/:id',checkAuth, deletePost);

module.exports = router;
