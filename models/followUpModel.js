const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const followUpSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        mobileNo: {
            type: String,
            required: [true, 'Please add an mobileNo'],
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student'
        },
        date: {
            type: Date,
            required: [true, 'Please add an date'],
        },
        remark: {
            type: String,
            required: [true, 'Please add an remark'],
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('followUp', followUpSchema)