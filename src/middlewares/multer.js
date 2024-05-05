import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/temp')
    },

    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  }) // returm file path
  
  export const upload = multer({ storage }) // storage is localFilePath