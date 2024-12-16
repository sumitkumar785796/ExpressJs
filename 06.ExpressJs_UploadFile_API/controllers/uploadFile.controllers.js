const mongoose = require("mongoose")
const UploadForm = require("../models/UploadFile.models");
const upload = require("../middleware/uploadFile.middleware");
const { validateMIMEType } = require('validate-image-type');
const path = require("path")
const fs = require("fs")

exports.FileUpload = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: "File Upload Failed.",
                error: err.message
            })
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' })
        }
        try {
            // Validate MIME type
            const result = await validateMIMEType(req.file.path, {
                allowMimeTypes: ['image/jpeg', 'image/jpg', 'image/avif', 'image/gif', 'image/png'],
            });

            if (!result.ok) {
                return res.status(400).json({ error: 'Invalid file type.' })
            }
            const filePath = req.file ? req.file.filename : null

            if (!filePath) {
                return res.status(400).json({ message: 'Image file is required.' })
            }

            const created = await UploadForm.create({
                filename: req.body.filename || req.file.originalname,
                file: filePath
            });

            return res.status(201).json({
                message: "File uploaded successfully.",
                data: created
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    })
}


exports.FileView = async (req, res) => {
    try {
        const File = await UploadForm.find()

        if (File.length === 0) {
            return res.status(404).json({
                message: "No File found."
            })
        }

        // Respond with users
        return res.status(200).json({
            message: "All File retrieved successfully.",
            data: File
        })
    } catch (error) {
        // Handle internal server errors
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}


exports.FileUpdate = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: "File Upload Failed.",
                error: err.message
            })
        }

        try {
            const { id } = req.params

            // Validate ID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid user ID provided."
                })
            }

            // Find the file in the database
            const fileExists = await UploadForm.findById(id)
            if (!fileExists) {
                return res.status(404).json({
                    message: "File not found."
                })
            }

            // Keep the old file path by default
            let filePath = fileExists.file

            // Check if a new file is uploaded
            if (req.file) {
                // Validate MIME type
                const result = await validateMIMEType(req.file.path, {
                    allowMimeTypes: ['image/jpeg', 'image/jpg', 'image/avif', 'image/gif', 'image/png'],
                })

                if (!result.ok) {
                    return res.status(400).json({ error: 'Invalid file type.' })
                }

                // Update the file path to the new file's name
                filePath = req.file.filename

                // Delete the old file if it exists
                const oldImagePath = path.join(__dirname, '../public/uploadFile', fileExists.file)
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error('Error deleting old image:', err);
                        }
                    })
                }
            }

            // Update the database record
            const updatedFile = await UploadForm.findByIdAndUpdate(id, {
                filename: req.body.filename || fileExists.filename, // Keep old filename if not provided
                file: filePath // Use new or old file path
            }, { new: true })

            return res.status(201).json({
                message: "File updated successfully.",
                data: updatedFile
            })
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    })
}



exports.FileDelete = async (req, res) => {
    try {
        const { id } = req.params

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID provided."
            })
        }

        // Check if the file exists in the database
        const fileExists = await UploadForm.findById(id);
        if (!fileExists) {
            return res.status(404).json({
                message: "File not found."
            })
        }

        // Delete the old file if it exists
        if (fileExists.file) {
            const oldImagePath = path.join(__dirname, '../public/uploadFile', fileExists.file)

            if (fs.existsSync(oldImagePath)) {
                try {
                    await fs.promises.unlink(oldImagePath) // Use promises for better async handling
                    console.log('Old image deleted successfully:', oldImagePath)
                } catch (err) {
                    console.error('Error deleting old image:', err);
                    return res.status(500).json({
                        message: "Error deleting file from server.",
                        error: err.message
                    })
                }
            } else {
                console.log('File not found on server:', oldImagePath)
            }
        }

        // Delete the file record from the database
        const deleted = await UploadForm.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({
                message: "File could not be deleted from the database."
            })
        }

        return res.status(200).json({
            message: "File deleted successfully.",
            data: deleted
        })
    } catch (error) {
        console.error('Internal Server Error:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
