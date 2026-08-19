// Upload Document Controller

const uploadDocument = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // File uploaded successfully
    res.status(200).json({
        success: true,
        message: 'file uploaded successfully',
        file: {
            originalName: req.file.originalname,
            saveAs: req.file.filename,
            size: req.file.size,
            mimeType: req.file.mimetype,
            path: req.file.path,
        }
    })
}

module.exports = {
    uploadDocument
};