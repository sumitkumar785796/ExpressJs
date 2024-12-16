const mongoose = require("mongoose")
const UploadForm = require("../models/UploadFile.models")
const upload = require("../middleware/uploadFile.middleware")
const { validateMIMEType } = require('validate-image-type')
const path = require("path")
const fs = require("fs")
const cloudinary = require("../config/cloudinary")
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
            // const filePath = req.file ? req.file.filename : null

            // if (!filePath) {
            //     return res.status(400).json({ message: 'Image file is required.' })
            // }
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: `${Date.now()}_${req.file.originalname}`.replace(/\s+/g, '_'),
                resource_type: 'auto', // Use Cloudinary's automatic resource type detection
                secure: true, // Ensure uploaded files are secured by default
            })
            const created = await UploadForm.create({
                filename: req.body.filename || req.file.originalname,
                file: cloudinaryResult.secure_url
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
                    message: "Invalid file ID provided."
                })
            }

            // Find the file in the database
            const fileExists = await UploadForm.findById(id);
            if (!fileExists) {
                return res.status(404).json({
                    message: "File not found."
                })
            }

            // Check if a new file is uploaded
            if (req.file) {
                // Validate MIME type
                const validation = await validateMIMEType(req.file.path, {
                    allowMimeTypes: ['image/jpeg', 'image/jpg', 'image/avif', 'image/gif', 'image/png'],
                })

                if (!validation.ok) {
                    return res.status(400).json({ error: 'Invalid file type.' })
                }

                // Upload new file to Cloudinary
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    public_id: `${Date.now()}_${req.file.originalname}`.replace(/\s+/g, '_'), // Unique public_id
                    resource_type: 'image'
                })

                // Delete old file from Cloudinary (if it exists)
                if (fileExists.file) {
                    const publicIdMatch = fileExists.file.match(/\/upload\/v\d+\/(.+)\./)
                    if (publicIdMatch && publicIdMatch[1]) {
                        const publicId = publicIdMatch[1];
                        await cloudinary.uploader.destroy(publicId);
                    }
                }

                // Update the database record with the new file URL
                fileExists.file = cloudinaryResult.secure_url
            }

            // Update the filename if provided
            if (req.body.filename) {
                fileExists.filename = req.body.filename
            }

            // Save the updated record
            const updatedFile = await fileExists.save()

            return res.status(200).json({
                message: "File updated successfully.",
                data: updatedFile
            })
        } catch (error) {
            console.error("Error during file update:", error)
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
        const fileExists = await UploadForm.findById(id)
        if (!fileExists) {
            return res.status(404).json({
                message: "File not found."
            })
        }

        // Delete the old file from Cloudinary if it exists
        if (fileExists.file) {
            const publicIdMatch = fileExists.file.match(/\/upload\/v\d+\/(.+)\./);
            if (publicIdMatch && publicIdMatch[1]) {
                const publicId = publicIdMatch[1]
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Cloudinary file deleted successfully:', publicId)
                } catch (err) {
                    console.error('Error deleting file from Cloudinary:', err)
                    return res.status(500).json({
                        message: "Error deleting file from Cloudinary.",
                        error: err.message
                    })
                }
            } else {
                console.log('No valid Cloudinary public ID found for file:', fileExists.file)
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
        console.error('Internal Server Error:', error)
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}