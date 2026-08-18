// Health check controller
require('dotenv').config();
const healthCheck = (req,res)=>{
    res.status(200).json({
        success : true,
        message : "Documind API is running",
        environment : process.env.NODE_ENV,
    })
}

module.exports = {healthCheck}
