import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload');
    },

    filename: (req, file, cb) => {
        cb(null, Date().toString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const filefilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if(allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
      cb(null, false);
  }
};

const upload = multer({ storage, filefilter });

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded',
        // image: req.protocol + '://' + req.get('host') + '/' + req?.file?.filename
    });
});

export default router;  