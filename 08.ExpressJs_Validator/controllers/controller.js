const { validationResult } = require('express-validator');
const simpleForm = require("../models/models")
const { InsertionRules, UpdationRules, DeletionRules } = require("../middleware/validator")
exports.AddData = async (req, res) => {
    // Run validation rules
    await Promise.all(InsertionRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { full_name, email, mobile } = req.body

    try {
        const sendData = await simpleForm.create({
            full_name, email, mobile
        })
        return res.status(201).json({
            message: "Insert Data",
            data: sendData
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.ViewData = async (req, res) => {
    try {
        const view = await simpleForm.find()
        if (view.length === 0) {
            return res.status(404).json({
                message: "No Data found."
            })
        }
        res.status(200).json({
            message: "View All Data:" + view.length,
            data: view,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.UpdateData = async (req, res) => {
    // Run validation rules
    await Promise.all(UpdationRules.map((Rule) => Rule.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { id } = req.params
    
    const { full_name, email, mobile } = req.body
    try {
        const sendData = await simpleForm.findByIdAndUpdate(id, {
            full_name, email, mobile
        }, {
            new: true
        })
        return res.status(201).json({
            message: "Update Data",
            data: sendData
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}
exports.DeleteData = async (req, res) => {
    // Run validation rules
    await Promise.all(DeletionRules.map((Rules) => Rules.run(req)))
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    const { id } = req.params

    try {
        const sendData = await simpleForm.findByIdAndDelete(id)
        return res.status(201).json({
            message: "Delete Data",
            data: sendData
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}