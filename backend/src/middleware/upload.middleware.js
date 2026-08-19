const multer = require('multer')
const path = require('path')

// Storage config - kaha or kis path pe file save hogi

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads')) // uploads folder me save hoga
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`
        cb(null, uniqueName)
    }
}
)

// file filter - kis type ki file allow hogi only pdf.
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true) // allow pdf file
    } else {
        cb(new Error("Only PDF files are allowed"), false) // reject other file types
    }
}

// Multer middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB LIMIT
})

module.exports = upload;