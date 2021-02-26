const Post = require('../models/post')

exports.getPost = (req, res, next) => {
   const pageSize = +req.query.pagesize;
   const currentPage = +req.query.page;
   const postQuery = Post.find()
   let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage  - 1))
    .limit(pageSize)
  }

  postQuery.find()
  .then(documents => {
       fetchedPosts = documents
       return Post.count()
  }).then(count => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxPosts: count
    })
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetchig post failed!'
    })
  })
  }

  exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    if (post) {
       res.status(200).json(post)
    } else {
      res.status(404).json({
        message: 'Post not found!'
      })
    }
  })
  .catch(error => {
     res.status(500).json({
      message: 'Fetchig post failed!'
    })
  })
}
