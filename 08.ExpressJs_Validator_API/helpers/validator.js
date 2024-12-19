const simpleForm = require("../models/models")
const { body, param } = require('express-validator');
// Define your validation middleware functions
exports.InsertionRules = [
    body('full_name')
        .notEmpty()
        .withMessage('full name is required')
        .isLength({ min: 5 })
        .withMessage('full name must be at least 5 characters'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .custom(async value => {
            const existingUser = await simpleForm.findOne({ email: value })
            if (existingUser) {
                throw new Error('Email is already exists...')
            }
        }),
    body('mobile')
        .notEmpty().withMessage('Mobile is required')
        .isMobilePhone()
        .withMessage('Invalid mobile phone number')
        .isLength({ min: 10 })
        .withMessage('Mobile number must be at least 10 digits')
        .custom(async value => {
            const existingUser = await simpleForm.findOne({ mobile: value });
            if (existingUser) {
                throw new Error('Mobile number already exists...');
            }
            return true;
        }),
];
exports.UpdationRules = [
    param('id')
        .notEmpty().withMessage('Id is required')
        .isMongoId().withMessage('Invalid ID format.')
        .custom(async value => {
            const existingUser = await simpleForm.findById(value)
            if (!existingUser) {
                throw new Error('Data not found...')
            }
        }),
    body('full_name')
        .notEmpty()
        .withMessage('full name is required')
        .isLength({ min: 5 })
        .withMessage('full name must be at least 5 characters'),
    body('email')
        .notEmpty().withMessage('Email is required'),
    body('mobile')
        .notEmpty().withMessage('Mobile is required')
        .isMobilePhone()
        .withMessage('Invalid mobile phone number')
        .isLength({ min: 10 })
        .withMessage('Mobile number must be at least 10 digits'),
];
exports.DeletionRules = [
    param('id')
        .notEmpty().withMessage('Id is required')
        .isMongoId().withMessage('Invalid ID format.')
        .custom(async value => {
            const existingUser = await simpleForm.findById(value)
            if (!existingUser) {
                throw new Error('Data not found...')
            }
        })
];
