const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
   const post = new Post({
     title: req.body.title,
     content: req.body.content,
     imagePath: url + '/images/' + req.file.filename,
     creator: req.userData.userId
    })

   post.save().then(createdPost => {
     res.status(201).json({
     message: 'Post added succesfully',
     post: {
       ...createdPost,
       id: createdPost._id,
      }
   })
   })
   .catch(() => {
     res.status(500).json({
      message: 'Creating a post failed!'
    });
   })
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath
  if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
  }
    const post = new Post({
     _id: req.body.id,
     title: req.body.title,
     content: req.body.content,
     imagePath: imagePath,
     creator: req.userData.userId
   })
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
  .then(updatePost => {
       if (updatePost.n > 0) {
          res.status(200).json({
              message: 'Posts updated succesfully!',
             })
       } else {
           res.status(401).json({ message: 'Not authorized!'})
       }
  })
  .catch(error => {
     res.status(500).json({
      message: "Couldn't update post!"
    });
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id:req.params.id, creator: req.userData.userId})
  .then(deletedPost => {
       if (deletedPost.n > 0) {
         res.status(200).json({ message:'Post deleted'})
       } else {
         res.status(401).json({ message:'Not authorized!'})
       }
  })
  .catch(error => {
     res.status(500).json({
      message: 'Deleting post failed!'
    })
  })
 }
