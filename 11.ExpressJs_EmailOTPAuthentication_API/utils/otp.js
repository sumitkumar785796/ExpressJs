const crypto = require('crypto');

exports.generateOtp = () => {
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // Set OTP expiration time (5 minutes)
    return { otp, expiresAt };
};
