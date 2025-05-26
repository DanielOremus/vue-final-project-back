import multer from "multer"

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true)
    }
    cb(new Error("Attached file must be an image"), false)
  },
})

export default upload
