const mongoose = require('mongoose')
const UploadFileSchema = new mongoose.Schema({
    filename: {
        type: String,
        trim: true,
    },
    file:{
        type:String,
        required:true
    }
}, {
    timestamps: true,
})

// Define the model
const UploadForm = mongoose.model('UploadForm', UploadFileSchema)
module.exports = UploadForm
