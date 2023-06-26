const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const followUpSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please select a User'],
        }, 
       studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Students',
            required: [true, 'Please select a student'],
        },
        date: {
            type: Date,
            required: [true, 'Please add an date'],
        },
        remark: {
            type: String,
            required: [true, 'Please add an remark'],
        },
        notificationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'notification'
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('followUp', followUpSchema)