const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const notificationSchema = mongoose.Schema(
    {
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        date: {
            type: Date,
            required: [true, 'Please add an date'],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Isread: {
            type: Boolean,
            required: [true, 'Please add an Isread'],
        }
       
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('notification', notificationSchema)