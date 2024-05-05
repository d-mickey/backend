import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // console.log("hgfhfhf")
      cb(null, '/backend/public/temp')
    },

    filename: function (req, file, cb) {
      // console.log("hgfhfhf")
      cb(null, file.originalname)
    }
  }) // returm file path
  
  export const upload = multer({ storage }) // storage is localFilePath