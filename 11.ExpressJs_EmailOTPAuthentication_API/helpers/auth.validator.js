const AuthForm = require("../models/auth.models")
const { body, param } = require('express-validator');
// Define your validation middleware functions
exports.RegistrationRules = [
    body('fname')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 5 })
        .withMessage('First name must be at least 5 characters'),
    body('lname')
        .notEmpty()
        .withMessage('Last name is also required'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async value => {
            const existingUser = await AuthForm.findOne({ email: value });
            if (existingUser) {
                throw new Error('Email already exists');
            }
        }),
    body('mobile')
        .notEmpty()
        .withMessage('Mobile number is required')
        .isMobilePhone()
        .withMessage('Invalid mobile phone number')
        .isLength({ min: 10, max: 10 })
        .withMessage('Mobile number must be 10 digits')
        .custom(async value => {
            const existingUser = await AuthForm.findOne({ mobile: value });
            if (existingUser) {
                throw new Error('Mobile number is already registered');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one digit')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character')
        .not().isIn(['password', '123456', 'qwerty'])
        .withMessage('Common passwords are not allowed'),
    body('repassword')
        .notEmpty()
        .withMessage('Password confirmation is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];
exports.MailRules=[
    param('id')
        .notEmpty().withMessage('Id is required')
        .isMongoId().withMessage('Invalid User ID format.') 
]
exports.SignInRules = [
    body('email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];
exports.UpdationRules = [
    body('fname')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 5 })
        .withMessage('First name must be at least 5 characters'),
    body('lname')
        .notEmpty()
        .withMessage('Last name is also required'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .custom(async (value, { req }) => {
            const existingUser = await AuthForm.findOne({ email: value });
            if (existingUser && existingUser._id.toString() !== req.user.user._id) {
                throw new Error('Email is already in use by another account');
            }
        }),
    body('mobile')
        .notEmpty()
        .withMessage('Mobile number is required')
        .isMobilePhone()
        .withMessage('Invalid mobile phone number')
        .isLength({ min: 10, max: 10 })
        .withMessage('Mobile number must be 10 digits')
        .custom(async (value, { req }) => {
            const existingUser = await AuthForm.findOne({ mobile: value });
            if (existingUser && existingUser._id.toString() !== req.user.user._id) {
                throw new Error('Mobile number is already registered to another account');
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one digit')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character')
        .not().isIn(['password', '123456', 'qwerty'])
        .withMessage('Common passwords are not allowed'),
    body('repassword')
        .optional()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];
