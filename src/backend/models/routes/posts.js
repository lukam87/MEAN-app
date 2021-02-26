const express = require('express');
const { getPostById, getPost } = require('../../controllers/get');
const { createPost, updatePost, deletePost } = require('../../controllers/post');
const checkAuth = require('../middleware/check-auth')
const multer = require('../middleware/multer')

const router = express.Router();



router.post('',checkAuth, multer , createPost)

router.put('/:id',checkAuth, multer, updatePost)

router.get('', getPost)

router.get('/:id', getPostById)

router.delete('/:id',checkAuth, deletePost)

module.exports = router;
