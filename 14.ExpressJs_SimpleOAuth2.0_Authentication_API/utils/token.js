const crypto = require("crypto")
const jwtsecretKey = crypto.randomBytes(32).toString('hex')
module.exports=jwtsecretKey