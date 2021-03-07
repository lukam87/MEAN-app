const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
}

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');

    if (isValid) {
      error = null
    }

    callBack(error,'backend/images')
  },
  filename: (req, file, callBack) => {
     const name = file.originalname.toLowerCase().split(' ').join('-');
     const extension = MIME_TYPE_MAP[file.mimetype];
    callBack(null, name + '-' + Date.now() + '.' + extension)
  }
})

module.exports = multer({storage: storage}).single('image');
