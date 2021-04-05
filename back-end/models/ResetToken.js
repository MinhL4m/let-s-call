
const mongoose = require('mongoose')
const resetTokenSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"user"
    },
    token:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 7200, // auto delete in 1 min 
    }
})

module.exports = mongoose.model("ResetToken", resetTokenSchema)